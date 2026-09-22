"""
Evidence router — file upload, hashing, AI entity extraction.
"""
import json
from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Evidence, Entity, Case
from app.services import evidence_service, ai_service

router = APIRouter(prefix="/api/cases", tags=["evidence"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/{case_id}/evidence")
async def upload_evidence(case_id: str, file: UploadFile, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    data = await file.read()

    # Count existing evidence files
    existing = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    ev_count = len(existing) + 1

    # Hash + metadata
    ev_data = evidence_service.process_upload(data, file.filename or "upload", case_id, ev_count)
    evidence = Evidence(**ev_data)
    session.add(evidence)
    session.flush()

    # AI entity extraction
    extraction = ai_service.extract_entities(
        ev_data["content"], file.filename or "upload", ev_data["evidence_id"]
    )

    saved_entities = []
    for ent in extraction.get("entities", []):
        entity = Entity(
            case_id=case_id,
            evidence_id=ev_data["evidence_id"],
            entity_type=ent.get("entity_type", "unknown"),
            value=str(ent.get("value", "")),
            source_file=file.filename or "upload",
            source_location=str(ent.get("source_location", "")),
            confidence=float(ent.get("confidence", 80)),
            is_on_chain=bool(ent.get("is_on_chain", False)),
            fact_type=ent.get("fact_type", "INFERENCE"),
        )
        session.add(entity)
        saved_entities.append(entity)

    session.commit()

    return {
        "evidence": ev_data,
        "entities_extracted": len(saved_entities),
        "extraction_method": extraction.get("extraction_method"),
        "is_ai": extraction.get("is_ai"),
        "entities": [
            {
                "entity_type": e.entity_type,
                "value": e.value,
                "confidence": e.confidence,
                "fact_type": e.fact_type,
                "evidence_id": e.evidence_id,
            }
            for e in saved_entities
        ],
    }


@router.get("/{case_id}/evidence")
def list_evidence(case_id: str, session: SessionDep):
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    result = []
    for ev in evidence:
        entities = session.exec(
            select(Entity).where(Entity.case_id == case_id, Entity.evidence_id == ev.evidence_id)
        ).all()
        result.append({
            **ev.model_dump(),
            "entity_count": len(entities),
            "entities": [e.model_dump() for e in entities],
        })
    return result
