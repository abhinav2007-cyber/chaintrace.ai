"""
Copilot router — evidence-grounded AI Q&A.
"""
import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import (
    Case, Evidence, Entity, Correlation,
    VASPAttribution, InvestigationGap, TimelineEvent, CopilotRequest,
)
from app.services import ai_service

router = APIRouter(prefix="/api/cases", tags=["copilot"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/{case_id}/copilot")
def ask_copilot(case_id: str, body: CopilotRequest, session: SessionDep):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    # Build case context for AI
    evidence = session.exec(select(Evidence).where(Evidence.case_id == case_id)).all()
    entities = session.exec(select(Entity).where(Entity.case_id == case_id)).all()
    correlations = session.exec(select(Correlation).where(Correlation.case_id == case_id)).all()
    vasp = session.exec(select(VASPAttribution).where(VASPAttribution.case_id == case_id)).all()
    gaps = session.exec(select(InvestigationGap).where(InvestigationGap.case_id == case_id)).all()
    timeline = session.exec(select(TimelineEvent).where(TimelineEvent.case_id == case_id)).all()

    case_context = {
        "case": case.model_dump(),
        "evidence": [e.model_dump() for e in evidence],
        "entities": [e.model_dump() for e in entities],
        "correlations": [c.model_dump() for c in correlations],
        "vasp": [v.model_dump() for v in vasp],
        "gaps": [g.model_dump() for g in gaps],
        "timeline": [t.model_dump() for t in timeline],
    }

    result = ai_service.answer_copilot(body.question, case_context)
    return {
        "question": body.question,
        **result,
    }
