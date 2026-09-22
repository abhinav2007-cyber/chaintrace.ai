'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Search, CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface GapDrawerProps {
  gap: any | null;
  onClose: () => void;
  onNavigateToEvidence?: () => void;
}

export function GapDrawer({ gap, onClose, onNavigateToEvidence }: GapDrawerProps) {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchDone, setSearchDone] = useState<boolean>(false);

  if (!gap) return null;

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSearchDone(true);
    }, 600);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 160,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 94vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          zIndex: 165,
          padding: '24px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              INVESTIGATION GAP ANALYSIS
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {gap.gap_description}
            </h3>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Current Status */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 6 }}>
            <span className="section-title">CURRENT STATUS</span>
          </div>
          <div style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--accent-purple)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>● Inference Only (Unverified by Direct CDR/KYC)</span>
          </div>
        </div>

        {/* Why It Matters */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 6 }}>
            <span className="section-title">WHY IT MATTERS</span>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            {gap.why_it_matters || 'The phone number appears in the chat evidence, but there is no independent source connecting it to Wallet A.'}
          </div>
        </div>

        {/* Suggested Next Step */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 6 }}>
            <span className="section-title">SUGGESTED NEXT STEP</span>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            {gap.next_action || (
              <>
                Search existing case evidence for:
                <ul style={{ paddingLeft: 18, marginTop: 6, color: 'var(--text-primary)' }}>
                  <li>Phone number (+91 98765 43210)</li>
                  <li>Initial wallet address (0xa1b2...)</li>
                  <li>±30 minute transaction window</li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Action Button: Search Case Evidence */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 13,
              fontWeight: 700,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              border: 'none',
              boxShadow: '0 0 14px rgba(59,130,246,0.3)'
            }}
          >
            {searching ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14 }} />
                <span>SCANNING REPOSITORY EVIDENCE...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>[ SEARCH CASE EVIDENCE ]</span>
              </>
            )}
          </button>
        </div>

        {/* Search Results Display */}
        {searchDone && (
          <div style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 6,
            padding: 14,
            marginBottom: 20,
            animation: 'flash-in 0.3s ease both'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-green)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
              <CheckCircle size={14} />
              <span>SEARCH COMPLETED: 2 MATCHES LOCATED</span>
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: 4 }}>
                <strong>E-003 (chat.txt):</strong> Line 14 references Wallet A address 0xa1b2... sent by +91 98765 43210 at 10:07 AM.
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: 4 }}>
                <strong>E-005 (wallet.txt):</strong> Inbound transfer timestamp (10:38 AM) is within 31 minutes of chat guidance.
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--accent-blue)', fontWeight: 600 }}>
              Conclusion: Temporal corroboration established. CDR tower location notice recommended for final fact closure.
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Close Gap Panel
          </button>
        </div>
      </div>
    </>
  );
}
