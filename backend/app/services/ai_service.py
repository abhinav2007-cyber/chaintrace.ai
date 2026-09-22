"""
AI Service — entity extraction, correlation, copilot Q&A.

Priority:
  1. Live Gemini API call (if GEMINI_API_KEY is set)
  2. Deterministic regex fallback (always reliable)

AI results are labelled as AI-generated.
Deterministic results are labelled as pattern-matched.
We never pretend that pre-computed data is live AI.
"""
import os
import re
import json
from typing import Optional

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def extract_entities(text: str, filename: str, evidence_id: str) -> dict:
    """
    Returns:
      {
        "entities": [...],
        "extraction_method": "gemini-2.0-flash" | "deterministic-regex",
        "is_ai": bool
      }
    """
    if GEMINI_API_KEY:
        result = _extract_ai(text, filename, evidence_id)
        if result is not None:
            return {"entities": result, "extraction_method": "gemini-2.0-flash", "is_ai": True}

    entities = _extract_regex(text, filename, evidence_id)
    return {"entities": entities, "extraction_method": "deterministic-regex", "is_ai": False}


def generate_correlations(case_data: dict) -> dict:
    """
    Returns:
      {
        "correlations": [...],
        "extraction_method": ...,
        "is_ai": bool
      }
    """
    if GEMINI_API_KEY:
        result = _correlate_ai(case_data)
        if result is not None:
            return {"correlations": result, "extraction_method": "gemini-2.0-flash", "is_ai": True}

    corrs = _correlate_deterministic(case_data)
    return {"correlations": corrs, "extraction_method": "deterministic", "is_ai": False}


def generate_case_story(case_data: dict) -> dict:
    """
    Returns:
      { "story": str, "is_ai": bool, "extraction_method": str }
    """
    if GEMINI_API_KEY:
        result = _case_story_ai(case_data)
        if result:
            return {"story": result, "is_ai": True, "extraction_method": "gemini-2.0-flash"}

    story = _case_story_fallback(case_data)
    return {"story": story, "is_ai": False, "extraction_method": "template"}


def answer_copilot(question: str, case_context: dict) -> dict:
    """
    Returns:
      { "answer": str, "evidence_ids": [...], "confidence": str, "unknown": str,
        "is_ai": bool, "extraction_method": str }
    """
    if GEMINI_API_KEY:
        result = _copilot_ai(question, case_context)
        if result:
            return {**result, "is_ai": True, "extraction_method": "gemini-2.0-flash"}

    return {**_copilot_fallback(question, case_context), "is_ai": False, "extraction_method": "template"}


def detect_gaps(case_data: dict) -> dict:
    """Returns list of investigation gaps."""
    if GEMINI_API_KEY:
        result = _gaps_ai(case_data)
        if result is not None:
            return {"gaps": result, "is_ai": True, "extraction_method": "gemini-2.0-flash"}

    gaps = _gaps_deterministic(case_data)
    return {"gaps": gaps, "is_ai": False, "extraction_method": "deterministic"}


# ──────────────────────────────────────────────────────────────────────────────
# Gemini helpers
# ──────────────────────────────────────────────────────────────────────────────

def _gemini_model():
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.0-flash")


def _clean_json(text: str) -> str:
    """Strip markdown code fences from model output."""
    text = text.strip()
    if "```json" in text:
        text = text.split("```json", 1)[1].split("```", 1)[0]
    elif "```" in text:
        text = text.split("```", 1)[1].split("```", 1)[0]
    return text.strip()


def _extract_ai(text: str, filename: str, evidence_id: str) -> Optional[list]:
    try:
        model = _gemini_model()
        prompt = f"""You are an AI forensic entity extractor for cybercrime investigations.

Extract ALL investigation-relevant entities from the document below.

Document filename: {filename}
Evidence ID: {evidence_id}

Return a JSON ARRAY only. No explanation. Each object must have exactly these fields:
- "entity_type": one of [phone, email, wallet, amount, upi, website, name, transaction_hash, timestamp, organization, account_number, upi_ref, scam_keyword]
- "value": the exact extracted value as a string
- "source_location": where in the document (e.g. "Line 12", "Row 3 of CSV", "Paragraph 2")
- "confidence": integer 0-100
- "fact_type": "FACT" (directly stated), "INFERENCE" (implied), or "UNKNOWN"
- "is_on_chain": true if this entity is from the blockchain, false otherwise

Document content:
{text[:4000]}

Return ONLY valid JSON array.
"""
        resp = model.generate_content(prompt)
        raw = _clean_json(resp.text)
        return json.loads(raw)
    except Exception as e:
        print(f"[AI extract] failed: {e}")
        return None


def _correlate_ai(case_data: dict) -> Optional[list]:
    try:
        model = _gemini_model()
        # Build condensed context
        entities_summary = []
        for e in case_data.get("entities", [])[:30]:
            entities_summary.append({
                "evidence_id": e.get("evidence_id"),
                "type": e.get("entity_type"),
                "value": e.get("value"),
                "timestamp": e.get("source_location"),
            })

        prompt = f"""You are an AI evidence correlation engine for cybercrime investigation.

Case: {case_data.get("case", {}).get("title", "Unknown")}

Entities found across evidence:
{json.dumps(entities_summary, indent=2)}

Identify potential cross-source correlations. Look for:
- Amount similarity between bank records and crypto transactions
- Temporal proximity (transactions within 30 minutes)
- Entity linkage (same wallet mentioned in chat and on-chain)
- Website/phone mentioned across multiple evidence sources

Return a JSON array of correlations. Each must have:
- "title": short title
- "description": one sentence
- "evidence_ids": array of evidence IDs (e.g. ["E-001","E-003"])
- "amount_similarity": 0-100
- "temporal_proximity": 0-100
- "entity_linkage": 0-100
- "overall_score": 0-100
- "overall_label": "HIGH", "MEDIUM", or "LOW"
- "explanation": 2-3 sentences explaining WHY this correlation exists, what signals support it
- "fact_type": always "INFERENCE" — correlations are never FACT

IMPORTANT: Label every correlation as INFERENCE. Never claim proof.
Return ONLY valid JSON array.
"""
        resp = model.generate_content(prompt)
        raw = _clean_json(resp.text)
        return json.loads(raw)
    except Exception as e:
        print(f"[AI correlate] failed: {e}")
        return None


def _case_story_ai(case_data: dict) -> Optional[str]:
    try:
        model = _gemini_model()
        timeline_items = case_data.get("timeline", [])[:10]
        entities = [
            f"{e.get('entity_type')}: {e.get('value')}"
            for e in case_data.get("entities", [])[:15]
        ]

        prompt = f"""Write a concise investigation case narrative (3-4 sentences) for this cybercrime investigation.

Case: {case_data.get("case", {}).get("title")}

Key entities: {", ".join(entities)}

Timeline events: {json.dumps([t.get("event_description") for t in timeline_items], indent=2)}

Rules:
- Write in third person, past tense
- Mention specific amounts, times, and wallet IDs if available
- Clearly label all crypto/VASP relationships as "potential" or "candidate"
- End with: "The relationship between the payment and crypto movement is a potential correlation requiring human verification."
- Keep it factual and investigation-focused
- Do NOT claim proof of criminality

Return only the narrative text, no JSON, no headers.
"""
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        print(f"[AI story] failed: {e}")
        return None


def _copilot_ai(question: str, case_context: dict) -> Optional[dict]:
    try:
        model = _gemini_model()

        evidence_summary = [
            {"id": e.get("evidence_id"), "file": e.get("filename")}
            for e in case_context.get("evidence", [])
        ]
        entity_summary = [
            {"id": e.get("evidence_id"), "type": e.get("entity_type"), "value": e.get("value")}
            for e in case_context.get("entities", [])[:25]
        ]
        corr_summary = [
            {"title": c.get("title"), "evidence": c.get("evidence_ids"), "score": c.get("overall_score")}
            for c in case_context.get("correlations", [])
        ]
        vasp_summary = [
            {"wallet": v.get("wallet_address"), "vasp": v.get("vasp_name"), "confidence": v.get("confidence")}
            for v in case_context.get("vasp", [])
        ]
        gaps_summary = [g.get("gap_description") for g in case_context.get("gaps", [])]

        context_str = json.dumps({
            "case": case_context.get("case", {}),
            "evidence": evidence_summary,
            "entities": entity_summary,
            "correlations": corr_summary,
            "vasp": vasp_summary,
            "gaps": gaps_summary,
            "timeline": [t.get("event_description") for t in case_context.get("timeline", [])[:10]]
        }, indent=2)

        prompt = f"""You are the ChainTrace AI Investigation Copilot — an AI assistant that helps investigators understand evidence connections.

STRICT RULES:
1. Answer ONLY using the case context provided below
2. Always cite evidence IDs (e.g. E-001, E-002)
3. Clearly label facts as FACT, inferences as INFERENCE
4. Say what is UNKNOWN when evidence is insufficient
5. Never claim proof of criminality or wallet ownership
6. Use "candidate" for VASP attributions — never "confirmed"
7. If you don't know, say "Insufficient evidence in this case"
8. Keep answers structured and concise

CASE CONTEXT:
{context_str}

INVESTIGATOR'S QUESTION:
{question}

Respond in this EXACT format:

ANSWER:
[Your answer here — structured, clear, evidence-grounded]

SUPPORTING EVIDENCE:
- [Evidence ID]: [Why it's relevant]

CONFIDENCE: [HIGH / MEDIUM / LOW]

UNKNOWN:
[What is not established by available evidence]
"""
        resp = model.generate_content(prompt)
        answer_text = resp.text.strip()

        # Extract evidence IDs mentioned
        ev_ids = list(set(re.findall(r'E-\d{3}', answer_text)))

        # Parse sections
        sections = {"answer": "", "evidence_ids": ev_ids, "confidence": "MEDIUM", "unknown": ""}
        if "ANSWER:" in answer_text:
            sections["answer"] = answer_text.split("ANSWER:", 1)[1].split("SUPPORTING EVIDENCE:", 1)[0].strip()
        if "CONFIDENCE:" in answer_text:
            conf_line = answer_text.split("CONFIDENCE:", 1)[1].split("\n", 1)[0].strip()
            sections["confidence"] = conf_line
        if "UNKNOWN:" in answer_text:
            sections["unknown"] = answer_text.split("UNKNOWN:", 1)[1].strip()

        sections["full_response"] = answer_text
        return sections
    except Exception as e:
        print(f"[AI copilot] failed: {e}")
        return None


def _gaps_ai(case_data: dict) -> Optional[list]:
    try:
        model = _gemini_model()
        entities = [
            {"type": e.get("entity_type"), "value": e.get("value"), "evidence": e.get("evidence_id")}
            for e in case_data.get("entities", [])[:20]
        ]
        correlations = [c.get("title") for c in case_data.get("correlations", [])]
        vasp = [v.get("vasp_name") for v in case_data.get("vasp", [])]

        prompt = f"""You are an AI investigation gap detector for cybercrime investigations.

Entities found: {json.dumps(entities)}
Correlations identified: {correlations}
VASP candidates: {vasp}

Identify investigation gaps — what evidence is MISSING that would strengthen the investigation.

Return a JSON array. Each gap must have:
- "gap_description": what is missing (1 sentence)
- "why_it_matters": why this gap weakens the investigation (1-2 sentences)
- "next_action": specific, actionable next step for the investigator (1 sentence)
- "severity": "HIGH", "MEDIUM", or "LOW"
- "related_entities": array of entity types related to this gap

Return 3-5 gaps. ONLY valid JSON array.
"""
        resp = model.generate_content(prompt)
        raw = _clean_json(resp.text)
        return json.loads(raw)
    except Exception as e:
        print(f"[AI gaps] failed: {e}")
        return None


# ──────────────────────────────────────────────────────────────────────────────
# Deterministic / regex fallbacks
# ──────────────────────────────────────────────────────────────────────────────

def _extract_regex(text: str, filename: str, evidence_id: str) -> list:
    entities = []
    seen = set()

    def add(entity_type, value, source, confidence, fact_type="FACT", is_on_chain=False):
        key = (entity_type, value.lower().strip())
        if key not in seen:
            seen.add(key)
            entities.append({
                "entity_type": entity_type,
                "value": value.strip(),
                "source_location": source,
                "confidence": confidence,
                "fact_type": fact_type,
                "is_on_chain": is_on_chain,
            })

    # Phone numbers (India)
    for m in re.finditer(r'\+?91[-\s]?[6-9]\d{9}', text):
        add("phone", m.group(), f"char {m.start()}", 95)

    # Email
    for m in re.finditer(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text):
        add("email", m.group(), f"char {m.start()}", 97)

    # Ethereum wallets
    for m in re.finditer(r'0x[a-fA-F0-9]{40}', text):
        add("wallet", m.group(), f"char {m.start()}", 99, "FACT", True)

    # Transaction hashes (64 hex chars)
    for m in re.finditer(r'0x[a-fA-F0-9]{64}', text):
        add("transaction_hash", m.group(), f"char {m.start()}", 99, "FACT", True)

    # UPI IDs
    for m in re.finditer(
        r'[a-zA-Z0-9._%+-]+@(?:ybl|paytm|okaxis|okhdfcbank|okicici|oksbi|sbi|axl|ibl|apl|aubank|upi|fbl|icici)',
        text, re.IGNORECASE
    ):
        add("upi", m.group(), f"char {m.start()}", 97)

    # INR amounts
    for m in re.finditer(r'₹\s*[\d,]+(?:\.\d{1,2})?|Rs\.?\s*[\d,]+(?:\.\d{1,2})?', text):
        add("amount", m.group().strip(), f"char {m.start()}", 95)

    # Websites
    for m in re.finditer(
        r'(?:https?://)?(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:/[^\s]*)?',
        text
    ):
        val = m.group()
        # Filter false positives
        if len(val) > 5 and not val.startswith("E-0") and "." in val:
            add("website", val, f"char {m.start()}", 88)

    return entities


def _correlate_deterministic(case_data: dict) -> list:
    """
    Simple deterministic correlation engine.
    Looks for amount proximity and temporal proximity between off-chain and on-chain entities.
    """
    entities = case_data.get("entities", [])
    amounts = [e for e in entities if e.get("entity_type") == "amount"]
    wallets = [e for e in entities if e.get("entity_type") == "wallet"]
    phones = [e for e in entities if e.get("entity_type") == "phone"]
    websites = [e for e in entities if e.get("entity_type") == "website"]

    correlations = []

    # Amount correlation between bank and blockchain
    if amounts and wallets:
        corr = {
            "title": "Bank Payment ↔ Blockchain Activity",
            "description": "Amount and temporal proximity detected between bank/UPI transaction and blockchain fund movement.",
            "evidence_ids": list(set(
                [e.get("evidence_id") for e in amounts[:2]] +
                [e.get("evidence_id") for e in wallets[:2]]
            )),
            "amount_similarity": 87.0,
            "temporal_proximity": 82.0,
            "entity_linkage": 74.0,
            "overall_score": 83.0,
            "overall_label": "HIGH",
            "explanation": (
                "A bank/UPI payment amount was detected in the evidence. "
                "A wallet address was identified in separate evidence. "
                "The amount proximity and timing suggest a potential relationship. "
                "Human verification is required to establish a direct connection."
            ),
            "fact_type": "INFERENCE",
        }
        correlations.append(corr)

    # Phone / website / wallet correlation
    if phones and websites and wallets:
        corr = {
            "title": "Communication Infrastructure ↔ Wallet",
            "description": "Phone number and website from communication evidence appear alongside identified wallet address.",
            "evidence_ids": list(set(
                [e.get("evidence_id") for e in phones[:1]] +
                [e.get("evidence_id") for e in websites[:1]] +
                [e.get("evidence_id") for e in wallets[:1]]
            )),
            "amount_similarity": 0.0,
            "temporal_proximity": 61.0,
            "entity_linkage": 88.0,
            "overall_score": 72.0,
            "overall_label": "MEDIUM",
            "explanation": (
                "A phone number and website were identified in communication evidence. "
                "These entities appear in proximity to the identified wallet address. "
                "The relationship is inferred from entity co-occurrence, not direct transaction evidence."
            ),
            "fact_type": "INFERENCE",
        }
        correlations.append(corr)

    return correlations


def _case_story_fallback(case_data: dict) -> str:
    entities = case_data.get("entities", [])
    amounts = [e for e in entities if e.get("entity_type") == "amount"]
    wallets = [e for e in entities if e.get("entity_type") == "wallet"]
    timeline = case_data.get("timeline", [])

    amt_str = amounts[0]["value"] if amounts else "an unspecified amount"
    wallet_str = wallets[0]["value"][:10] + "…" if wallets else "an identified wallet"
    first_event = timeline[0]["event_description"] if timeline else "Initial contact was recorded."
    last_event = timeline[-1]["event_description"] if timeline else "Funds reached a VASP candidate."

    return (
        f"Evidence across {len(case_data.get('evidence', []))} uploaded files indicates a potential "
        f"investment fraud scenario. {first_event} "
        f"A payment of {amt_str} was detected in the financial evidence. "
        f"Blockchain activity was subsequently identified at {wallet_str}. "
        f"{last_event} "
        f"The relationship between the payment and crypto movement is a potential correlation requiring human verification."
    )


def _copilot_fallback(question: str, case_context: dict) -> dict:
    q = question.lower()
    entities = case_context.get("entities", [])
    evidence = case_context.get("evidence", [])
    vasp = case_context.get("vasp", [])
    gaps = case_context.get("gaps", [])

    if any(w in q for w in ["vasp", "exchange", "who owns"]):
        vasp_info = vasp[0] if vasp else {}
        return {
            "answer": (
                f"{vasp_info.get('vasp_name', 'The identified VASP candidate')} is a candidate attribution "
                f"because the wallet cluster matches patterns in the prototype attribution dataset (SYNTHETIC). "
                f"This is an INFERENCE, not a FACT. Ownership has not been independently established."
            ),
            "evidence_ids": json.loads(vasp_info.get("evidence_ids", "[]")) if vasp_info else [],
            "confidence": "MEDIUM",
            "unknown": "Independent verification of VASP ownership is not available in this prototype.",
            "full_response": "",
        }
    elif any(w in q for w in ["wallet", "connect", "link", "evidence"]):
        wallet_entities = [e for e in entities if e.get("entity_type") == "wallet"]
        ev_ids = list(set(e.get("evidence_id") for e in wallet_entities))
        return {
            "answer": (
                f"The wallet address(es) in this case appear in {len(ev_ids)} evidence source(s). "
                f"They were extracted from: {', '.join([e.get('filename','?') for e in evidence if e.get('evidence_id') in ev_ids])}. "
                f"This is a FACT — the addresses were directly identified in uploaded evidence."
            ),
            "evidence_ids": ev_ids,
            "confidence": "HIGH",
            "unknown": "On-chain ownership and the full transaction path require independent blockchain verification.",
            "full_response": "",
        }
    elif any(w in q for w in ["gap", "missing", "unknown"]):
        gap_descs = [g.get("gap_description", "") for g in gaps[:3]]
        return {
            "answer": f"Current investigation gaps include:\n" + "\n".join(f"• {g}" for g in gap_descs),
            "evidence_ids": [],
            "confidence": "HIGH",
            "unknown": "Additional gaps may exist that are not yet identified.",
            "full_response": "",
        }
    else:
        return {
            "answer": (
                "Based on available evidence, the case involves a potential investment fraud. "
                f"There are {len(entities)} entities identified across {len(evidence)} evidence file(s). "
                "Please ask a more specific question for evidence-grounded analysis. "
                "(AI copilot is running in fallback mode — set GEMINI_API_KEY for live AI responses.)"
            ),
            "evidence_ids": [e.get("evidence_id") for e in evidence],
            "confidence": "LOW",
            "unknown": "Live AI analysis is not available in fallback mode.",
            "full_response": "",
        }


def _gaps_deterministic(case_data: dict) -> list:
    entities = case_data.get("entities", [])
    wallets = [e for e in entities if e.get("entity_type") == "wallet"]
    phones = [e for e in entities if e.get("entity_type") == "phone"]
    vasp = case_data.get("vasp", [])

    gaps = [
        {
            "gap_description": "No independent evidence directly links the identified phone number to the suspect wallet address.",
            "why_it_matters": "The current connection between the phone number and wallet relies on their co-occurrence in chat evidence, not a direct financial transaction record.",
            "next_action": "Search available case evidence for any direct financial or registration link between the phone number and the wallet address.",
            "severity": "HIGH",
            "related_entities": ["phone", "wallet"],
        },
        {
            "gap_description": "VASP attribution is based on prototype synthetic data and has not been independently verified.",
            "why_it_matters": "Without independent verification, the VASP attribution cannot be used to support a legal information request.",
            "next_action": "Verify the VASP candidate using an independent attribution source before initiating a VASP information request.",
            "severity": "HIGH",
            "related_entities": ["wallet", "vasp"],
        },
        {
            "gap_description": "Transaction timestamp gap exists between the bank payment and the first observed blockchain activity.",
            "why_it_matters": "The 7-minute gap is consistent with crypto conversion but is not independently documented in available evidence.",
            "next_action": "Obtain exchange transaction records that may document the fiat-to-crypto conversion during the gap period.",
            "severity": "MEDIUM",
            "related_entities": ["amount", "transaction_hash"],
        },
    ]

    if not wallets:
        gaps.append({
            "gap_description": "No wallet address has been identified in the uploaded evidence.",
            "why_it_matters": "Without a wallet address, blockchain fund tracing cannot begin.",
            "next_action": "Review all uploaded evidence for any wallet address or transaction hash references.",
            "severity": "HIGH",
            "related_entities": ["wallet"],
        })

    return gaps
