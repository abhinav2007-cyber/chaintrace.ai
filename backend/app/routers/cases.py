"""
Cases router — CRUD for investigations + derived data endpoints.
"""
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import (
    Case, CaseCreate, Evidence, Entity, Correlation,
    TimelineEvent, VASPAttribution, RiskIndicator, InvestigationGap, CrossCaseLink,
)
from app.services import ai_service, graph_service, timeline_service

router = APIRouter(prefix="/api/cases", tags=["cases"])

SessionDep = Annotated[Session, Depends(get_session)]

DEMO_PATH = Path(__file__).parent.parent / "data" / "demo_case.json"


# ── Create case ───────────────────────────────────────────────────────────────

@router.post("")
def create_case(body: CaseCreate, session: SessionDep):
    import uuid, re
    case_id = f"CYBER-2026-{str(uuid.uuid4())[:4].upper()}"
    case = Case(
        id=case_id,
        title=body.title,
        description=body.description,
        blockchain=body.blockchain,
        wallet_address=body.wallet_address,
        created_at=datetime.utcnow().isoformat(),
    )
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


# ── List cases ────────────────────────────────────────────────────────────────

@router.get("")
def list_cases(session: SessionDep):
    cases = session.exec(select(Case)).all()
    result = []
    for c in cases:
        ev_count = len(session.exec(select(Evidence).where(Evidence.case_id == c.id)).all())
        ent_count = len(session.exec(select(Entity).where(Entity.case_id == c.id)).all())
        result.append({**c.model_dump(), "evidence_count": ev_count, "entity_count": ent_count})
    return result


# ── Get case detail ───────────────────────────────────────────────────────────

@router.get("/{case_id}")
def get_case(case_id: str, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")
    return case


# ── Full case bundle (evidence + entities + correlations + vasp + risk + gaps) ─

@router.get("/{case_id}/bundle")
def get_case_bundle(case_id: str, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    correlations = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()
    vasp = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    risks = session.exec(select(RiskIndicator).where(RiskIndicator.case_id == case_id)).all()
    gaps = session.exec(select(InvestigationGap).where(InvestigationGap.case_id == case_id)).all()
    links = session.exec(select(CrossCaseLink).where(CrossCaseLink.source_case_id == case_id)).all()
    timeline = session.exec(select(TimelineEvent).where(TimelineEvent.case_id == case_id)).all()

    return {
        "case": case,
        "evidence": [e.model_dump() for e in evidence],
        "entities": [e.model_dump() for e in entities],
        "correlations": [c.model_dump() for c in correlations],
        "vasp": [v.model_dump() for v in vasp],
        "risks": [r.model_dump() for r in risks],
        "gaps": [g.model_dump() for g in gaps],
        "cross_case_links": [l.model_dump() for l in links],
        "timeline": [t.model_dump() for t in timeline],
    }


# ── Graph ─────────────────────────────────────────────────────────────────────

@router.get("/{case_id}/graph")
def get_graph(case_id: str, session: SessionDep):
    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    vasp = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    return graph_service.build_graph(
        [e.model_dump() for e in entities],
        [v.model_dump() for v in vasp],
        [ev.model_dump() for ev in evidence],
    )


# ── Timeline ──────────────────────────────────────────────────────────────────

@router.get("/{case_id}/timeline")
def get_timeline(case_id: str, session: SessionDep):
    stored = session.exec(select(TimelineEvent).where(TimelineEvent.case_id == case_id)).all()
    if stored:
        return [t.model_dump() for t in stored]

    # Compute on the fly
    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    correlations = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()

    events = timeline_service.build_timeline(
        [e.model_dump() for e in entities],
        [ev.model_dump() for ev in evidence],
        [c.model_dump() for c in correlations],
    )
    return events


# ── Build investigation (trigger AI analysis) ──────────────────────────────────

@router.post("/{case_id}/build")
def build_investigation(case_id: str, session: SessionDep):
    """
    Run AI analysis on all uploaded evidence:
    1. Generate correlations
    2. Build timeline
    3. Detect investigation gaps
    4. Generate case story
    """
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    vasp = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    correlations_existing = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()

    case_data = {
        "case": case.model_dump(),
        "entities": [e.model_dump() for e in entities],
        "evidence": [ev.model_dump() for ev in evidence],
        "vasp": [v.model_dump() for v in vasp],
        "correlations": [c.model_dump() for c in correlations_existing],
    }

    # Correlations
    if not correlations_existing:
        corr_result = ai_service.generate_correlations(case_data)
        for c_data in corr_result.get("correlations", []):
            corr = Correlation(
                case_id=case_id,
                title=c_data.get("title", "Correlation"),
                description=c_data.get("description", ""),
                evidence_ids=json.dumps(c_data.get("evidence_ids", [])),
                amount_similarity=float(c_data.get("amount_similarity", 0)),
                temporal_proximity=float(c_data.get("temporal_proximity", 0)),
                entity_linkage=float(c_data.get("entity_linkage", 0)),
                overall_score=float(c_data.get("overall_score", 0)),
                overall_label=c_data.get("overall_label", "MEDIUM"),
                explanation=c_data.get("explanation", ""),
                fact_type="INFERENCE",
            )
            session.add(corr)

    # Timeline
    existing_tl = session.exec(select(TimelineEvent).where(TimelineEvent.case_id == case_id)).all()
    if not existing_tl:
        timeline_events = timeline_service.build_timeline(
            [e.model_dump() for e in entities],
            [ev.model_dump() for ev in evidence],
            [],
        )
        for ev_data in timeline_events:
            tl = TimelineEvent(
                case_id=case_id,
                event_timestamp=ev_data.get("event_timestamp", ""),
                event_description=ev_data.get("event_description", ""),
                source=ev_data.get("source", ""),
                evidence_id=ev_data.get("evidence_id", ""),
                confidence=float(ev_data.get("confidence", 80)),
                event_type=ev_data.get("event_type", "off_chain"),
                fact_type=ev_data.get("fact_type", "FACT"),
            )
            session.add(tl)

    # Gaps
    existing_gaps = session.exec(select(InvestigationGap).where(InvestigationGap.case_id == case_id)).all()
    if not existing_gaps:
        gaps_result = ai_service.detect_gaps(case_data)
        for g_data in gaps_result.get("gaps", []):
            gap = InvestigationGap(
                case_id=case_id,
                gap_description=g_data.get("gap_description", ""),
                why_it_matters=g_data.get("why_it_matters", ""),
                next_action=g_data.get("next_action", ""),
                severity=g_data.get("severity", "MEDIUM"),
                related_entities=json.dumps(g_data.get("related_entities", [])),
            )
            session.add(gap)

    # Case story
    if not case.case_story:
        all_corr = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()
        story_result = ai_service.generate_case_story({
            **case_data,
            "correlations": [c.model_dump() for c in all_corr],
            "timeline": timeline_events if not existing_tl else [t.model_dump() for t in existing_tl],
        })
        case.case_story = story_result.get("story", "")
        session.add(case)

    # VASP candidates (if none yet)
    if not vasp:
        wallet_entities = [e for e in entities if e.get_entity_type() == "wallet"] if hasattr(entities[0] if entities else None, "get_entity_type") else [e for e in entities if e.entity_type == "wallet"]
        for idx, w_ent in enumerate(wallet_entities[:1]):
            vasp_rec = VASPAttribution(
                case_id=case_id,
                wallet_address=w_ent.value,
                vasp_name="VASP-X (Candidate)",
                confidence=72.0,
                attribution_type="CANDIDATE",
                supporting_signals=json.dumps([
                    "Address cluster similarity (synthetic dataset)",
                    "Transaction behavioral pattern",
                    "Graph proximity",
                ]),
                limitations=json.dumps([
                    "Prototype attribution — not independently verified",
                    "Synthetic intelligence dataset",
                    "Does not establish ownership",
                ]),
                evidence_ids=json.dumps([w_ent.evidence_id]),
                source="Prototype attribution dataset — SYNTHETIC",
                last_verified="2026-09-22",
            )
            session.add(vasp_rec)

        # Risk indicators
        for indicator in _default_risk_indicators(case_id, entities):
            session.add(RiskIndicator(**indicator))

    session.commit()
    return {"status": "built", "case_id": case_id}


def _default_risk_indicators(case_id: str, entities) -> list:
    return [
        {"case_id": case_id, "indicator_type": "Rapid Fund Movement", "detected": True,
         "description": "Funds moved through multiple wallets within a 47-minute window.", "evidence_ids": "[]"},
        {"case_id": case_id, "indicator_type": "Cross-Chain Movement", "detected": True,
         "description": "Bridge contract interaction detected between Ethereum and BSC (synthetic data).", "evidence_ids": "[]"},
        {"case_id": case_id, "indicator_type": "Multiple Intermediary Wallets", "detected": True,
         "description": "Fund flow passed through at least 3 intermediate addresses.", "evidence_ids": "[]"},
        {"case_id": case_id, "indicator_type": "Layering Pattern", "detected": True,
         "description": "Transaction pattern consistent with layering behaviour (not proof of criminal activity).", "evidence_ids": "[]"},
        {"case_id": case_id, "indicator_type": "Mixer Interaction", "detected": False,
         "description": "No mixer interaction detected in available synthetic dataset.", "evidence_ids": "[]"},
        {"case_id": case_id, "indicator_type": "Fragmentation", "detected": False,
         "description": "No fragmentation pattern detected.", "evidence_ids": "[]"},
    ]


# ── Report ────────────────────────────────────────────────────────────────────

@router.get("/{case_id}/report")
def get_report(case_id: str, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    correlations = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()
    vasp = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    risks = session.exec(select(RiskIndicator).where(RiskIndicator.case_id == case_id)).all()
    gaps = session.exec(select(InvestigationGap).where(InvestigationGap.case_id == case_id)).all()
    timeline = session.exec(select(TimelineEvent).where(TimelineEvent.case_id == case_id)).all()
    links = session.exec(select(CrossCaseLink).where(CrossCaseLink.source_case_id == case_id)).all()

    return {
        "generated_at": datetime.utcnow().isoformat(),
        "disclaimer": "AI-generated investigative assistance. Human verification required. All AI outputs are probabilistic.",
        "case": case.model_dump(),
        "evidence_inventory": [e.model_dump() for e in evidence],
        "entities": [e.model_dump() for e in entities],
        "correlations": [c.model_dump() for c in correlations],
        "vasp_candidates": [v.model_dump() for v in vasp],
        "risk_indicators": [r.model_dump() for r in risks],
        "timeline": [t.model_dump() for t in timeline],
        "investigation_gaps": [g.model_dump() for g in gaps],
        "cross_case_links": [l.model_dump() for l in links],
        "evidence_hashes": [{"evidence_id": e.evidence_id, "sha256": e.sha256_hash, "filename": e.filename} for e in evidence],
    }


# ── VASP Request Packet ───────────────────────────────────────────────────────

@router.get("/{case_id}/vasp-packet")
def get_vasp_packet(case_id: str, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    vasp_list = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    correlations = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()

    vasp_info = vasp_list[0].model_dump() if vasp_list else {}

    return {
        "packet_type": "VASP_INFORMATION_REQUEST",
        "status": "PENDING_HUMAN_REVIEW",
        "disclaimer": "This packet requires human review and authorisation before any transmission. ChainTrace AI does not transmit legal requests automatically.",
        "sahyog_ready": True,
        "case_id": case_id,
        "generated_at": datetime.utcnow().isoformat(),
        "case_summary": case.case_story or case.description,
        "vasp_candidate": vasp_info.get("vasp_name", "Unknown"),
        "vasp_attribution_confidence": vasp_info.get("confidence", 0),
        "relevant_wallet": vasp_info.get("wallet_address", ""),
        "evidence_references": [{"id": e.evidence_id, "hash": e.sha256_hash} for e in evidence],
        "requested_information": [
            "Account details associated with the identified wallet address",
            "KYC/AML records for the account holder",
            "Transaction records for the specified date range",
            "IP address logs for account activity on the specified date",
        ],
        "date_range": "2026-09-15",
        "reason": f"Investigation into potential investment fraud. Wallet address identified in complaint {case_id}.",
        "limitations": vasp_info.get("limitations", "[]"),
        "human_review_required": True,
    }


# ── Demo loader ───────────────────────────────────────────────────────────────

@router.post("/demo/load")
def load_demo(session: SessionDep):
    """Load the pre-built synthetic demo investigation."""
    if not DEMO_PATH.exists():
        raise HTTPException(500, "Demo data file not found")

    with open(DEMO_PATH, "r", encoding="utf-8") as f:
        demo = json.load(f)

    case_id = demo["case"]["id"]

    # Idempotent — don't duplicate
    existing = session.get(Case, case_id)
    if existing:
        return {"case_id": case_id, "loaded": False, "message": "Demo case already loaded"}

    # Case
    c = Case(**demo["case"])
    session.add(c)

    # Evidence
    for e_data in demo.get("evidence", []):
        session.add(Evidence(**e_data))

    # Entities
    for e_data in demo.get("entities", []):
        session.add(Entity(**e_data))

    # Correlations
    for c_data in demo.get("correlations", []):
        session.add(Correlation(**c_data))

    # Timeline
    for t_data in demo.get("timeline", []):
        session.add(TimelineEvent(**t_data))

    # VASP
    for v_data in demo.get("vasp", []):
        session.add(VASPAttribution(**v_data))

    # Risk
    for r_data in demo.get("risks", []):
        session.add(RiskIndicator(**r_data))

    # Gaps
    for g_data in demo.get("gaps", []):
        session.add(InvestigationGap(**g_data))

    # Cross-case links
    for l_data in demo.get("cross_case_links", []):
        session.add(CrossCaseLink(**l_data))

    session.commit()
    return {"case_id": case_id, "loaded": True, "message": "Demo investigation loaded successfully"}
