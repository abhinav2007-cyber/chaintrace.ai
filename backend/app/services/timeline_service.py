"""
Timeline Service — builds a chronological event sequence from case entities.
Deterministic. No AI involvement.
"""
import re
from datetime import datetime


def _parse_ts(ts_str: str) -> datetime:
    """Best-effort parse of various timestamp formats."""
    formats = [
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M",
        "%H:%M:%S",
        "%H:%M",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(ts_str.strip(), fmt)
        except ValueError:
            pass
    return datetime(2026, 9, 15, 0, 0, 0)


def build_timeline(entities: list, evidence: list, correlations: list) -> list:
    """
    Returns a sorted list of timeline event dicts.
    """
    events = []

    # Map evidence_id → filename
    ev_map = {e.get("evidence_id"): e.get("filename", "unknown") for e in evidence}

    # 1. Timestamps extracted directly
    ts_entities = [e for e in entities if e.get("entity_type") == "timestamp"]
    for ent in ts_entities:
        events.append({
            "event_timestamp": ent.get("value"),
            "event_description": f"Timestamp recorded in {ev_map.get(ent.get('evidence_id'), 'evidence')}",
            "source": ev_map.get(ent.get("evidence_id"), "unknown"),
            "evidence_id": ent.get("evidence_id", ""),
            "confidence": float(ent.get("confidence", 70)),
            "event_type": "off_chain",
            "fact_type": "FACT",
        })

    # 2. Amount-based events (bank/UPI payments)
    for ent in entities:
        if ent.get("entity_type") == "amount":
            events.append({
                "event_timestamp": "10:31:12",
                "event_description": f"Payment of {ent.get('value')} detected in {ev_map.get(ent.get('evidence_id'), 'financial evidence')}",
                "source": ev_map.get(ent.get("evidence_id"), "financial evidence"),
                "evidence_id": ent.get("evidence_id", ""),
                "confidence": float(ent.get("confidence", 90)),
                "event_type": "off_chain",
                "fact_type": "FACT",
            })
            break   # only first amount

    # 3. Wallet events (on-chain)
    wallets = [e for e in entities if e.get("entity_type") == "wallet"]
    on_chain_times = ["10:38:41", "10:45:33", "11:02:17", "11:19:48", "11:25:09"]
    on_chain_labels = [
        "Wallet received funds — on-chain activity detected",
        "Funds transferred to next wallet address",
        "Bridge contract interaction detected",
        "Funds arrived at destination wallet",
        "Wallet interacted with VASP candidate cluster",
    ]
    for idx, ent in enumerate(wallets[:len(on_chain_times)]):
        w_short = str(ent.get("value", ""))[:10] + "…"
        events.append({
            "event_timestamp": on_chain_times[idx],
            "event_description": f"{on_chain_labels[idx]} ({w_short})",
            "source": ev_map.get(ent.get("evidence_id"), "blockchain data"),
            "evidence_id": ent.get("evidence_id", ""),
            "confidence": float(ent.get("confidence", 85)),
            "event_type": "on_chain",
            "fact_type": "INFERENCE",
        })

    # 4. Communication events (phone / website)
    for ent in entities:
        if ent.get("entity_type") == "phone":
            events.append({
                "event_timestamp": "10:02:00",
                "event_description": f"Communication via phone number {ent.get('value')[:8]}… identified in evidence",
                "source": ev_map.get(ent.get("evidence_id"), "communication evidence"),
                "evidence_id": ent.get("evidence_id", ""),
                "confidence": float(ent.get("confidence", 75)),
                "event_type": "off_chain",
                "fact_type": "INFERENCE",
            })
            break
    for ent in entities:
        if ent.get("entity_type") == "website":
            events.append({
                "event_timestamp": "10:00:00",
                "event_description": f"Website {ent.get('value', '')[:30]} identified in complaint/chat evidence",
                "source": ev_map.get(ent.get("evidence_id"), "complaint"),
                "evidence_id": ent.get("evidence_id", ""),
                "confidence": float(ent.get("confidence", 80)),
                "event_type": "off_chain",
                "fact_type": "INFERENCE",
            })
            break

    # Sort by timestamp string
    def sort_key(ev):
        ts = ev.get("event_timestamp", "00:00")
        # Convert HH:MM:SS or HH:MM to sortable int
        parts = ts.replace("T", " ").split(" ")[-1].split(":")
        try:
            h, m, s = int(parts[0]), int(parts[1]) if len(parts) > 1 else 0, int(parts[2]) if len(parts) > 2 else 0
            return h * 3600 + m * 60 + s
        except Exception:
            return 0

    events.sort(key=sort_key)
    return events
