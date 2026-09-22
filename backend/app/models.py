from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime


class Case(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str
    description: str = ""
    status: str = "ACTIVE"
    blockchain: str = "Ethereum"
    wallet_address: str = ""
    case_story: str = ""
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    is_demo: bool = False


class Evidence(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    evidence_id: str        # E-001, E-002, …
    case_id: str
    filename: str
    file_type: str
    sha256_hash: str
    upload_timestamp: str
    status: str = "HASH_VERIFIED"
    content: str = ""       # stored decoded text
    file_size: int = 0


class Entity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    evidence_id: str        # E-001
    entity_type: str        # phone | email | wallet | amount | upi | website | name | transaction_hash | timestamp | organization
    value: str
    source_file: str
    source_location: str = ""
    confidence: float = 0.0
    is_on_chain: bool = False
    fact_type: str = "INFERENCE"   # FACT | INFERENCE | UNKNOWN


class Correlation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    title: str
    description: str = ""
    evidence_ids: str = "[]"        # JSON
    entity_ids: str = "[]"          # JSON
    amount_similarity: float = 0.0
    temporal_proximity: float = 0.0
    entity_linkage: float = 0.0
    overall_score: float = 0.0
    overall_label: str = "MEDIUM"   # HIGH | MEDIUM | LOW
    explanation: str = ""
    fact_type: str = "INFERENCE"


class TimelineEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    event_timestamp: str
    event_description: str
    source: str
    evidence_id: str
    confidence: float = 0.0
    event_type: str = "off_chain"   # on_chain | off_chain
    fact_type: str = "FACT"


class VASPAttribution(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    wallet_address: str
    vasp_name: str
    confidence: float
    attribution_type: str = "CANDIDATE"   # never CONFIRMED
    supporting_signals: str = "[]"         # JSON
    limitations: str = "[]"               # JSON
    evidence_ids: str = "[]"              # JSON
    source: str = "Prototype attribution dataset — SYNTHETIC"
    last_verified: str = ""
    fact_type: str = "INFERENCE"


class RiskIndicator(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    indicator_type: str
    detected: bool = False
    description: str = ""
    evidence_ids: str = "[]"


class InvestigationGap(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str
    gap_description: str
    why_it_matters: str
    next_action: str
    severity: str = "MEDIUM"        # HIGH | MEDIUM | LOW
    related_entities: str = "[]"    # JSON


class CrossCaseLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source_case_id: str
    linked_case_id: str
    linked_case_title: str
    similarity_score: float
    shared_entities: str = "[]"      # JSON: [{type, value}]


# ── Pydantic response schemas (non-table) ──────────────────────────────────

class CaseCreate(SQLModel):
    title: str
    description: str = ""
    blockchain: str = "Ethereum"
    wallet_address: str = ""


class CopilotRequest(SQLModel):
    question: str
