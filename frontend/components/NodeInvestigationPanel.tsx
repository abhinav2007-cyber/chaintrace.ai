'use client';

import React from 'react';
import { X, HelpCircle, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

interface NodeInvestigationPanelProps {
  node: any | null;
  onClose: () => void;
  onOpenWhy: () => void;
  onViewEvidence: (evidenceId: string) => void;
}

export function NodeInvestigationPanel({
  node,
  onClose,
  onOpenWhy,
  onViewEvidence,
}: NodeInvestigationPanelProps) {
  if (!node) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 140,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(400px, 92vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          zIndex: 145,
          padding: '24px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-6px 0 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ENTITY INVESTIGATION
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {node.label}
            </h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {node.address || node.subtitle}
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Status & Fact vs Inference */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>STATUS / FACT TYPE</div>
            <div style={{ marginTop: 4 }}>
              <span className={`badge ${node.factType === 'FACT' ? 'badge-fact' : 'badge-inference'}`}>
                {node.factType || 'INFERENCE'}
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>TRANSACTIONS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              {node.type === 'wallet' ? '23 Observed' : 'Verified Event'}
            </div>
          </div>
        </div>

        {/* Connected Entities */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <span className="section-title">CONNECTED ENTITIES</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Wallet B', 'Bridge Contract', 'VASP-X (Candidate)'].map((conn) => (
              <span
                key={conn}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  color: 'var(--text-secondary)'
                }}
              >
                {conn}
              </span>
            ))}
          </div>
        </div>

        {/* Attribution Card */}
        <div style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            VASP ATTRIBUTION
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
            VASP-X
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent-amber)', fontWeight: 600, marginTop: 2 }}>
            Candidate Attribution: 92%
          </div>

          <button
            onClick={onOpenWhy}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: 14,
              fontSize: 12,
              fontWeight: 600,
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              boxShadow: '0 0 10px rgba(59,130,246,0.3)'
            }}
          >
            <HelpCircle size={15} />
            <span>[ Why this connection? ]</span>
          </button>
        </div>

        {/* Supporting Evidence Items */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <span className="section-title">SUPPORTING EVIDENCE</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['E-005', 'E-008', 'E-011'].map((evId) => (
              <button
                key={evId}
                onClick={() => onViewEvidence(evId)}
                className="ev-id"
                style={{ fontSize: 12, padding: '4px 10px' }}
              >
                {evId}
              </button>
            ))}
          </div>
        </div>

        {/* Limitations Notice */}
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px dashed rgba(245,158,11,0.3)',
          borderRadius: 6,
          padding: 12,
          fontSize: 11,
          color: 'var(--accent-amber)',
          lineHeight: 1.5,
          marginTop: 'auto'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={13} />
            <span>INVESTIGATIVE LIMITATIONS</span>
          </div>
          Prototype attribution dataset. Does not establish legal ownership. Requires formal Sahyog / VASP compliance verification.
        </div>
      </div>
    </>
  );
}
