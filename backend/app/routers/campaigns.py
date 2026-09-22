"""
Campaigns router — cross-case shared infrastructure detection.
"""
import json
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Case, Entity, CrossCaseLink

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("")
def detect_campaigns(session: SessionDep):
    """
    Find shared infrastructure across all cases.
    Returns clusters of cases sharing wallets, phones, websites, or emails.
    """
    all_cases = session.exec(select(Case)).all()
    all_entities = session.exec(select(Entity)).all()

    # Group entities by (type, value) → list of case_ids
    infra_map: dict[tuple, list[str]] = {}
    for ent in all_entities:
        if ent.entity_type in ("wallet", "phone", "email", "website", "upi"):
            key = (ent.entity_type, ent.value.lower().strip())
            if key not in infra_map:
                infra_map[key] = []
            if ent.case_id not in infra_map[key]:
                infra_map[key].append(ent.case_id)

    # Find shared infra (appears in 2+ cases)
    shared = {k: v for k, v in infra_map.items() if len(v) >= 2}

    # Group into campaign clusters
    case_map = {c.id: c for c in all_cases}
    clusters: dict[str, dict] = {}   # cluster_id → {cases, shared_entities}

    for (etype, evalue), case_ids in shared.items():
        # Use first case as anchor
        anchor = min(case_ids)
        if anchor not in clusters:
            clusters[anchor] = {
                "anchor_case_id": anchor,
                "cases": list(case_ids),
                "shared_entities": [],
            }
        else:
            for cid in case_ids:
                if cid not in clusters[anchor]["cases"]:
                    clusters[anchor]["cases"].append(cid)

        clusters[anchor]["shared_entities"].append({
            "type": etype,
            "value": evalue[:20] + "…" if len(evalue) > 20 else evalue,
        })

    result = []
    for anchor_id, cluster in clusters.items():
        cases_detail = []
        for cid in cluster["cases"]:
            c = case_map.get(cid)
            if c:
                cases_detail.append({"id": c.id, "title": c.title, "status": c.status})

        # Similarity score based on shared entity count
        shared_count = len(cluster["shared_entities"])
        similarity = min(95, 50 + shared_count * 12)

        # Group shared entities by type
        by_type: dict[str, list] = {}
        for se in cluster["shared_entities"]:
            by_type.setdefault(se["type"], []).append(se["value"])

        result.append({
            "cluster_id": f"CLUSTER-{anchor_id[-4:]}",
            "anchor_case_id": anchor_id,
            "cases": cases_detail,
            "shared_entity_count": shared_count,
            "similarity_score": similarity,
            "shared_by_type": by_type,
            "label": "Potential Shared Infrastructure",
            "disclaimer": "Shared infrastructure detected. Does not establish a common origin or criminal organization.",
        })

    return {
        "clusters": result,
        "total_cases_analyzed": len(all_cases),
        "shared_infrastructure_found": len(result) > 0,
    }
