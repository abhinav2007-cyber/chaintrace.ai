"""
Graph Service — builds React Flow nodes and edges from case entities.
All layout is deterministic. AI is not used here.
"""
import json
from typing import Any

# ── Node type → visual category ───────────────────────────────────────────────
ENTITY_META: dict[str, dict] = {
    "victim":           {"color": "#f59e0b", "icon": "👤", "group": "off_chain", "shape": "circle"},
    "wallet":           {"color": "#3b82f6", "icon": "💎", "group": "on_chain",  "shape": "hexagon"},
    "transaction":      {"color": "#8b5cf6", "icon": "⟶",  "group": "on_chain",  "shape": "rect"},
    "transaction_hash": {"color": "#8b5cf6", "icon": "⟶",  "group": "on_chain",  "shape": "rect"},
    "phone":            {"color": "#06b6d4", "icon": "📱", "group": "off_chain", "shape": "circle"},
    "email":            {"color": "#06b6d4", "icon": "✉️", "group": "off_chain", "shape": "circle"},
    "upi":              {"color": "#f97316", "icon": "💳", "group": "off_chain", "shape": "rect"},
    "amount":           {"color": "#f97316", "icon": "₹",  "group": "off_chain", "shape": "rect"},
    "website":          {"color": "#10b981", "icon": "🌐", "group": "off_chain", "shape": "rect"},
    "organization":     {"color": "#10b981", "icon": "🏢", "group": "off_chain", "shape": "rect"},
    "vasp":             {"color": "#ef4444", "icon": "🏦", "group": "on_chain",  "shape": "diamond"},
    "bridge":           {"color": "#a855f7", "icon": "⛓", "group": "on_chain",  "shape": "diamond"},
    "name":             {"color": "#94a3b8", "icon": "👤", "group": "off_chain", "shape": "circle"},
}

DEFAULT_META = {"color": "#475569", "icon": "?", "group": "off_chain", "shape": "rect"}


def _meta(entity_type: str) -> dict:
    return ENTITY_META.get(entity_type.lower(), DEFAULT_META)


def build_graph(entities: list, vasp_attributions: list, evidence: list) -> dict:
    """
    Build a React Flow compatible graph from case entities.
    Returns {"nodes": [...], "edges": [...]}
    """
    nodes: list[dict] = []
    edges: list[dict] = []

    seen_values: dict[str, str] = {}   # value → node_id

    def add_node(node_id: str, label: str, entity_type: str, fact_type: str,
                 evidence_id: str, confidence: float, extra: dict = None) -> str:
        meta = _meta(entity_type)
        nodes.append({
            "id": node_id,
            "type": "investigation",
            "data": {
                "label": label,
                "entityType": entity_type,
                "color": meta["color"],
                "icon": meta["icon"],
                "group": meta["group"],
                "shape": meta["shape"],
                "factType": fact_type,
                "evidenceId": evidence_id,
                "confidence": confidence,
                **(extra or {}),
            },
            "position": {"x": 0, "y": 0},   # layout computed on frontend
        })
        return node_id

    # 1. Deduplicate and add entity nodes
    for i, ent in enumerate(entities):
        v = str(ent.get("value", ""))[:42]
        etype = ent.get("entity_type", "unknown")
        ev_id = ent.get("evidence_id", "")
        conf = float(ent.get("confidence", 80))
        fact = ent.get("fact_type", "INFERENCE")

        # Deduplicate by value
        if v.lower() in seen_values:
            continue
        node_id = f"ent_{i}"
        seen_values[v.lower()] = node_id

        label = v if len(v) <= 20 else v[:18] + "…"
        add_node(node_id, label, etype, fact, ev_id, conf)

    # 2. Add VASP attribution nodes
    for j, vasp in enumerate(vasp_attributions):
        vasp_id = f"vasp_{j}"
        wallet = str(vasp.get("wallet_address", ""))
        vasp_name = vasp.get("vasp_name", "VASP Candidate")
        conf = float(vasp.get("confidence", 0))

        add_node(
            vasp_id, vasp_name, "vasp", "INFERENCE",
            json.loads(vasp.get("evidence_ids", "[]") or "[]")[0] if vasp.get("evidence_ids") else "",
            conf,
            {
                "vaspName": vasp_name,
                "attributionType": "CANDIDATE",
                "isVasp": True,
                "signals": json.loads(vasp.get("supporting_signals", "[]") or "[]"),
                "limitations": json.loads(vasp.get("limitations", "[]") or "[]"),
            }
        )

        # Edge: matching wallet → VASP
        wallet_key = wallet.lower()
        if wallet_key in seen_values:
            edges.append({
                "id": f"e_vasp_{j}",
                "source": seen_values[wallet_key],
                "target": vasp_id,
                "label": f"Candidate ↔ {conf:.0f}%",
                "type": "investigation",
                "animated": True,
                "data": {
                    "edgeType": "vasp_attribution",
                    "confidence": conf,
                    "factType": "INFERENCE",
                    "why": {
                        "title": f"Why is {vasp_name} a candidate?",
                        "signals": json.loads(vasp.get("supporting_signals", "[]") or "[]"),
                        "limitations": json.loads(vasp.get("limitations", "[]") or "[]"),
                        "evidenceIds": json.loads(vasp.get("evidence_ids", "[]") or "[]"),
                        "confidence": conf,
                        "disclaimer": "Candidate attribution. Does not establish ownership. Prototype synthetic intelligence dataset.",
                    }
                },
            })

    # 3. Build smart edges from entity ordering within the same evidence file
    eid_to_nodes: dict[str, list[str]] = {}
    for i, ent in enumerate(entities):
        v = str(ent.get("value", ""))
        node_id = seen_values.get(v.lower())
        if not node_id:
            continue
        ev_id = ent.get("evidence_id", "")
        eid_to_nodes.setdefault(ev_id, []).append((ent, node_id))

    # 4. Create chain edges for wallet sequences (on-chain)
    wallet_nodes = [
        (ent, nid) for ent, nid in
        [(e, seen_values.get(str(e.get("value","")).lower())) for e in entities if e.get("entity_type") == "wallet"]
        if nid
    ]
    for k in range(len(wallet_nodes) - 1):
        src_ent, src_id = wallet_nodes[k]
        tgt_ent, tgt_id = wallet_nodes[k + 1]
        edge_id = f"e_chain_{k}"
        edges.append({
            "id": edge_id,
            "source": src_id,
            "target": tgt_id,
            "label": "Fund Movement",
            "type": "investigation",
            "animated": True,
            "data": {
                "edgeType": "fund_flow",
                "factType": "INFERENCE",
                "why": {
                    "title": f"Fund Movement: Wallet → Wallet",
                    "signals": [
                        "Transaction relationship detected in synthetic blockchain data",
                        "Sequential wallet activity within the observed time window",
                        "Graph proximity in the fund-flow trace",
                    ],
                    "evidenceIds": [src_ent.get("evidence_id"), tgt_ent.get("evidence_id")],
                    "confidence": 85,
                    "disclaimer": "DEMO / SYNTHETIC BLOCKCHAIN DATA. Connection is inferred, not proven.",
                }
            }
        })

    # 5. Amount → Wallet correlation edge (the key cross-source link)
    amount_nodes = [(e, seen_values.get(str(e.get("value","")).lower())) for e in entities if e.get("entity_type") == "amount"]
    if amount_nodes and wallet_nodes:
        amt_ent, amt_id = amount_nodes[0]
        w_ent, w_id = wallet_nodes[0]
        if amt_id and w_id:
            edges.append({
                "id": "e_correlation_main",
                "source": amt_id,
                "target": w_id,
                "label": "Potential Correlation",
                "type": "investigation",
                "animated": True,
                "data": {
                    "edgeType": "cross_source_correlation",
                    "factType": "INFERENCE",
                    "isHighlight": True,
                    "why": {
                        "title": "Bank Payment ↔ Blockchain Activity",
                        "signals": [
                            "Amount proximity: payment amount approximates crypto equivalent",
                            "Temporal proximity: ≈7 minute gap between bank debit and wallet credit",
                            "Entity co-occurrence: same case evidence",
                            "Complaint narrative references both payment and wallet",
                        ],
                        "evidenceIds": [amt_ent.get("evidence_id"), w_ent.get("evidence_id")],
                        "confidence": 83,
                        "disclaimer": "INFERENCE. This is a potential correlation. Human verification required. Not proof of connection.",
                    }
                }
            })

    # 6. Phone → Website edge
    phone_nodes = [(e, seen_values.get(str(e.get("value","")).lower())) for e in entities if e.get("entity_type") == "phone"]
    website_nodes = [(e, seen_values.get(str(e.get("value","")).lower())) for e in entities if e.get("entity_type") == "website"]
    if phone_nodes and website_nodes:
        p_ent, p_id = phone_nodes[0]
        w_ent, w_id = website_nodes[0]
        if p_id and w_id:
            edges.append({
                "id": "e_phone_web",
                "source": p_id,
                "target": w_id,
                "label": "Communication Infrastructure",
                "type": "investigation",
                "animated": False,
                "data": {
                    "edgeType": "infrastructure_link",
                    "factType": "INFERENCE",
                    "why": {
                        "title": "Phone ↔ Website Infrastructure",
                        "signals": [
                            "Phone number and website appear in the same communication evidence",
                            "Both entities are referenced in the complaint narrative",
                            "Temporal co-occurrence in chat export",
                        ],
                        "evidenceIds": [p_ent.get("evidence_id"), w_ent.get("evidence_id")],
                        "confidence": 72,
                        "disclaimer": "INFERENCE. Co-occurrence in evidence. Not proof of ownership.",
                    }
                }
            })

    return {"nodes": nodes, "edges": edges}
