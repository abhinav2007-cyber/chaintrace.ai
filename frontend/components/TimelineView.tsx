'use client';

import React from 'react';
import { Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface TimelineViewProps {
  timelineEvents: any[];
  onSelectEvidence: (evidenceId: string) => void;
}

export function TimelineView({ timelineEvents, onSelectEvidence }: TimelineViewProps) {
  // Default demo events if none in DB
  const defaultEvents = [
    {
      event_timestamp: '2026-09-15T10:02:14Z',
      timeFormatted: '10:02 AM',
      event_description: 'Victim first contacted via WhatsApp regarding guaranteed 400% returns scheme',
      source: 'complaint.txt',
      evidence_id: 'E-001',
      fact_type: 'FACT',
      confidence: 95,
      event_type: 'off_chain',
    },
    {
      event_timestamp: '2026-09-15T10:07:30Z',
      timeFormatted: '10:07 AM',
      event_description: 'Victim receives UPI payment instructions via Telegram chat #492',
      source: 'chat.txt',
      evidence_id: 'E-003',
      fact_type: 'FACT',
      confidence: 92,
      event_type: 'off_chain',
    },
    {
      event_timestamp: '2026-09-15T10:31:12Z',
      timeFormatted: '10:31 AM',
      event_description: 'Victim initiates ₹2,50,000 UPI payment (UTR: 629104882910) to merchant fastgains@okicici',
      source: 'bank_statement.csv',
      evidence_id: 'E-002',
      fact_type: 'FACT',
      confidence: 99,
      event_type: 'off_chain',
    },
    {
      event_timestamp: '2026-09-15T10:38:41Z',
      timeFormatted: '10:38 AM',
      event_description: 'Primary Wallet A (0xa1b2...) receives 1.84 ETH (~₹2,48,700 equivalent) on Ethereum Mainnet',
      source: 'wallet.txt',
      evidence_id: 'E-005',
      fact_type: 'INFERENCE',
      confidence: 84,
      event_type: 'on_chain',
    },
    {
      event_timestamp: '2026-09-15T10:45:19Z',
      timeFormatted: '10:45 AM',
      event_description: 'Wallet A transfers 1.82 ETH to intermediary Wallet B (0xb2c3...)',
      source: 'wallet.txt',
      evidence_id: 'E-006',
      fact_type: 'FACT',
      confidence: 98,
      event_type: 'on_chain',
    },
    {
      event_timestamp: '2026-09-15T11:02:05Z',
      timeFormatted: '11:02 AM',
      event_description: 'Wallet B deposits funds into cross-chain Bridge Contract (Ethereum → BSC bridge)',
      source: 'wallet.txt',
      evidence_id: 'E-007',
      fact_type: 'FACT',
      confidence: 96,
      event_type: 'on_chain',
    },
    {
      event_timestamp: '2026-09-15T11:19:44Z',
      timeFormatted: '11:19 AM',
      event_description: 'Wallet C (0xc3d4...) unlocks pegged tokens on Binance Smart Chain (BSC)',
      source: 'wallet.txt',
      evidence_id: 'E-008',
      fact_type: 'FACT',
      confidence: 94,
      event_type: 'on_chain',
    },
    {
      event_timestamp: '2026-09-15T11:25:30Z',
      timeFormatted: '11:25 AM',
      event_description: 'Wallet C interacts with VASP-X deposit cluster (92% candidate attribution)',
      source: 'attribution_dataset.json',
      evidence_id: 'E-011',
      fact_type: 'INFERENCE',
      confidence: 92,
      event_type: 'on_chain',
    },
  ];

  const events = timelineEvents && timelineEvents.length > 0 ? timelineEvents : defaultEvents;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          CHRONOLOGICAL EVIDENCE TIMELINE
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Unified chronological sequence bridging off-chain banking events with on-chain blockchain ledger movements.
        </p>
      </div>

      <div className="timeline">
        {events.map((ev, index) => {
          const isFact = ev.fact_type === 'FACT';
          const isOnChain = ev.event_type === 'on_chain';

          return (
            <div key={index} className="timeline-item">
              <div className={`timeline-dot ${isOnChain ? 'on-chain' : 'off-chain'}`} />

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span className="timeline-ts" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)' }}>
                  {ev.timeFormatted || ev.event_timestamp.substring(11, 16)}
                </span>

                <span className={`badge ${isFact ? 'badge-fact' : 'badge-inference'}`}>
                  {ev.fact_type}
                </span>

                <span className={`badge ${isOnChain ? 'badge-onchain' : 'badge-offchain'}`}>
                  {isOnChain ? 'ON-CHAIN' : 'OFF-CHAIN'}
                </span>
              </div>

              <div className="timeline-desc" style={{ fontSize: 14 }}>
                {ev.event_description}
              </div>

              <div className="timeline-meta" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Source: {ev.source}
                </span>

                <button
                  onClick={() => onSelectEvidence(ev.evidence_id || 'E-001')}
                  className="ev-id"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <span>{ev.evidence_id || 'E-001'}</span>
                  <ExternalLink size={10} />
                </button>

                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                  Confidence: {ev.confidence || 85}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
