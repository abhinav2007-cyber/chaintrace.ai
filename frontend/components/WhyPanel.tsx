'use client';

import React from 'react';
import { X, Check, AlertTriangle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface WhyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  sourceNode?: string;
  targetNode?: string;
  signals?: string[];
  evidenceIds?: string[];
  confidenceScore?: number;
  onViewEvidence?: (id: string) => void;
}

export function WhyPanel({
  isOpen,
  onClose,
  title = 'WHY THIS CONNECTION?',
  sourceNode = 'Wallet C',
  targetNode = 'VASP-X',
  signals = [
    'Deposit cluster relationship (multi-input heuristic)',
    'Historical address association in synthetic intelligence cluster',
    'Graph proximity (1 direct hop from cross-chain bridge)',
    'Transaction timing and gas token reuse pattern',
  ],
  evidenceIds = ['E-008', 'E-011'],
  confidenceScore = 92,
  onViewEvidence,
}: WhyPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 170,
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
          zIndex: 180,
          padding: '24px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 28px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              EXPLAINABLE AI REASONING
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {title}
            </h3>
            <div style={{ fontSize: 13, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{sourceNode}</span>
              <ArrowRight size={13} />
              <span>{targetNode}</span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Supporting Signals */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 10 }}>
            <span className="section-title">SUPPORTING SIGNALS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signals.map((sig, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 12,
                  color: 'var(--text-secondary)'
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-green)',
                  flexShrink: 0,
                  marginTop: 1
                }}>
                  <Check size={12} />
                </div>
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence References */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 10 }}>
            <span className="section-title">ANCHOR EVIDENCE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              onClick={() => onViewEvidence?.('E-008')}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ev-id">E-008</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                  wallet.txt (BSC Ledger Data)
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--accent-blue)' }}>View →</span>
            </div>

            <div
              onClick={() => onViewEvidence?.('E-011')}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ev-id">E-011</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                  Attribution Reference Dataset (Synthetic)
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--accent-blue)' }}>View →</span>
            </div>
          </div>
        </div>

        {/* Confidence Score with Visual Bar */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-header" style={{ marginBottom: 10 }}>
            <span className="section-title">MODEL ATTRIBUTION SCORE</span>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {confidenceScore}%
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Prototype Candidate Score
              </span>
            </div>

            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{ width: `${confidenceScore}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}
              />
            </div>
          </div>
        </div>

        {/* Critical Legal Disclaimer */}
        <div style={{
          marginTop: 'auto',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 6,
          padding: 14,
          fontSize: 11,
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-red)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} />
            <span>CRITICAL LEGAL NOTICE</span>
          </div>
          This is an <strong>investigative candidate</strong>, not proof of ownership or criminal liability. All attribution scores are probabilistic and derived from synthetic hackathon test data. Official verification requires formal Sahyog inquiry.
        </div>
      </div>
    </>
  );
}
