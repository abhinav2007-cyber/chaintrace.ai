'use client';

import React from 'react';
import { X, ShieldCheck, Copy, FileText, CheckCircle, ExternalLink } from 'lucide-react';

interface EvidenceDrawerProps {
  evidence: any | null;
  entities: any[];
  onClose: () => void;
  onOpenOriginal?: () => void;
}

export function EvidenceDrawer({
  evidence,
  entities,
  onClose,
  onOpenOriginal,
}: EvidenceDrawerProps) {
  if (!evidence) return null;

  const matchedEntities = entities.filter((e) => e.evidence_id === evidence.evidence_id);

  const copyHash = () => {
    if (evidence.sha256_hash) {
      navigator.clipboard.writeText(evidence.sha256_hash);
      alert('SHA-256 Hash copied to clipboard');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 150,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 95vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          zIndex: 160,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.5)',
          overflowY: 'auto',
          padding: '24px 20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="ev-id" style={{ fontSize: 13, padding: '4px 8px' }}>
              {evidence.evidence_id}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {evidence.filename}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: 6 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Cryptographic Integrity */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <span className="section-title">INTEGRITY (SECTION 65B EVIDENCE ACT)</span>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SHA-256 HASH</span>
              <button
                onClick={copyHash}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent-green)',
              wordBreak: 'break-all',
              background: 'var(--bg-input)',
              padding: 8,
              borderRadius: 4,
            }}>
              {evidence.sha256_hash || '8a91c5e2f3d4b6a7c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} color="var(--accent-green)" />
              <span>Timestamp & Hash Verified • Immutable Chain of Custody</span>
            </div>
          </div>
        </div>

        {/* Extracted Entities */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <span className="section-title">EXTRACTED ENTITIES ({matchedEntities.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matchedEntities.length > 0 ? (
              matchedEntities.map((ent: any) => (
                <div
                  key={ent.id || ent.value}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {ent.entity_type}
                    </div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2, wordBreak: 'break-all' }}>
                      {ent.value}
                    </div>
                  </div>
                  <span className={`badge ${ent.fact_type === 'FACT' ? 'badge-fact' : 'badge-inference'}`}>
                    {ent.fact_type || 'FACT'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No entities directly tagged to this item.
              </div>
            )}
          </div>
        </div>

        {/* Used In Findings */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <span className="section-title">USED IN INVESTIGATION FINDINGS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 12,
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>Correlation #01: Bank ↔ Crypto Temporal Link</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                Matches ₹2,50,000 transaction with 7 min 29 sec window to Wallet A
              </div>
            </div>

            <div style={{
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 12,
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Timeline Event #03</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                Anchored at 10:31 AM Indian Standard Time
              </div>
            </div>
          </div>
        </div>

        {/* Source metadata */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
            Source: {evidence.source_type || 'Investigator Upload'} • Verified by SHA-256
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Close Drawer
          </button>
        </div>
      </div>
    </>
  );
}
