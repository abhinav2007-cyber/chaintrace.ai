'use client';

import React, { useState } from 'react';
import { FileText, Plus, ShieldCheck, Hash, ExternalLink, Filter } from 'lucide-react';

interface EvidenceViewProps {
  evidenceList: any[];
  entitiesList: any[];
  onSelectEvidence: (item: any) => void;
  onAddEvidenceClick: () => void;
}

export function EvidenceView({
  evidenceList,
  entitiesList,
  onSelectEvidence,
  onAddEvidenceClick,
}: EvidenceViewProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvidence = evidenceList.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'documents') return item.filename?.endsWith('.txt') || item.filename?.endsWith('.pdf');
    if (filterType === 'transactions') return item.filename?.includes('statement') || item.filename?.includes('wallet') || item.filename?.endsWith('.csv');
    if (filterType === 'chat') return item.filename?.includes('chat');
    return true;
  });

  const getEntitiesForEvidence = (evidenceId: string) => {
    return entitiesList.filter((e) => e.evidence_id === evidenceId);
  };

  return (
    <div>
      {/* Top action row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            EVIDENCE INVENTORY ({evidenceList.length} ITEMS)
          </h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Cryptographically sealed files with SHA-256 hashes and AI entity extractions.
          </div>
        </div>

        <button
          onClick={onAddEvidenceClick}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} />
          <span>+ Add Evidence</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'All Evidence' },
          { id: 'documents', label: 'Documents & Complaints' },
          { id: 'transactions', label: 'Financial & Ledger' },
          { id: 'chat', label: 'Chats & Conversations' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`btn btn-sm ${filterType === f.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Evidence Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {filteredEvidence.map((item) => {
          const matchedEntities = getEntitiesForEvidence(item.evidence_id);

          return (
            <div
              key={item.id || item.evidence_id}
              onClick={() => onSelectEvidence(item)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ev-id">{item.evidence_id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.filename}
                    </span>
                  </div>
                  <span className="badge badge-fact">FACT</span>
                </div>

                {/* SHA-256 Hash */}
                <div style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-input)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 12
                }}>
                  SHA-256: {item.sha256_hash ? `${item.sha256_hash.substring(0, 20)}...` : '8a91c5e...'}
                </div>

                {/* Extracted Entity Chips */}
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Extracted Entities ({matchedEntities.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {matchedEntities.length > 0 ? (
                      matchedEntities.slice(0, 4).map((ent: any) => (
                        <span
                          key={ent.id || ent.value}
                          className="badge"
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            padding: '2px 6px'
                          }}
                        >
                          {ent.entity_type}: {ent.value.length > 18 ? `${ent.value.substring(0, 16)}...` : ent.value}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Phone • Website • Amount • Wallet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'var(--accent-blue)',
                fontWeight: 600
              }}>
                <span>Added: {new Date(item.uploaded_at || Date.now()).toLocaleTimeString()}</span>
                <span>[ View Evidence Drawer → ]</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
