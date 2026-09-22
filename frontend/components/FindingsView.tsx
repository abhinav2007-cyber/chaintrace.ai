'use client';

import React from 'react';
import { ArrowRight, HelpCircle, AlertTriangle, ShieldCheck, Search, Activity, CheckCircle2, XCircle } from 'lucide-react';

interface FindingsViewProps {
  risks: any[];
  vasp: any[];
  gaps: any[];
  onOpenWhy: () => void;
  onSelectGap: (gap: any) => void;
}

export function FindingsView({
  risks,
  vasp,
  gaps,
  onOpenWhy,
  onSelectGap,
}: FindingsViewProps) {
  const vaspItem = vasp && vasp.length > 0 ? vasp[0] : {
    vasp_name: 'VASP-X',
    confidence: 92,
    wallet_address: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
  };

  const defaultRisks = [
    { indicator_type: 'RAPID FUND MOVEMENT', detected: true, description: 'Transferred through 3 wallets within 47 minutes' },
    { indicator_type: 'MULTIPLE HOPS', detected: true, description: 'Structured through 2 intermediate non-custodial wallets' },
    { indicator_type: 'CROSS-CHAIN MOVEMENT', detected: true, description: 'Bridge interaction between Ethereum Mainnet and BSC' },
    { indicator_type: 'MIXER INTERACTION', detected: false, description: 'No known privacy pool (Tornado/Railgun) deposits detected' },
  ];

  const riskList = risks && risks.length > 0 ? risks : defaultRisks;

  const defaultGaps = [
    {
      id: 'gap-1',
      gap_description: 'Phone → Wallet relationship not independently verified',
      severity: 'HIGH',
      why_it_matters: 'The phone number appears in the chat evidence, but there is no independent source connecting it to Wallet A.',
      next_action: 'Search existing case evidence for phone number, wallet address, and ±30 minute transaction window.',
    },
    {
      id: 'gap-2',
      gap_description: 'VASP attribution requires formal compliance verification',
      severity: 'MEDIUM',
      why_it_matters: 'VASP-X identification is based on prototype clustering heuristic and cannot be treated as proven fact in court without exchange confirmation.',
      next_action: 'Generate Sahyog-ready VASP Information Request Packet for legal nodal officer sign-off.',
    },
    {
      id: 'gap-3',
      gap_description: 'Independent evidence linking website hosting to entity unavailable',
      severity: 'MEDIUM',
      why_it_matters: 'fastgains-trading.com domain WHOIS is privacy-protected with Cloudflare proxy.',
      next_action: 'Issue Section 91 CrPC notice to registrar or preserve web server access logs.',
    },
  ];

  const gapsList = gaps && gaps.length > 0 ? gaps : defaultGaps;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          INVESTIGATIVE FINDINGS & EVIDENCE SYNTHESIS
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Structured forensic deductions derived from unified on-chain and off-chain evidence fusion.
        </p>
      </div>

      {/* 1. FUND FLOW SUMMARY */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">1. RECONSTRUCTED FUND FLOW CHAIN</span>
          <span className="badge badge-fact">CROSS-CHAIN RECONSTRUCTION</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '16px 12px',
          background: 'var(--bg-input)',
          borderRadius: 8,
          overflowX: 'auto'
        }}>
          {[
            { name: 'Victim Bank', sub: '₹2,50,000 UPI', color: '#10b981' },
            { name: 'Wallet A', sub: '1.84 ETH (Hop 1)', color: '#3b82f6' },
            { name: 'Wallet B', sub: '1.82 ETH (Intermediary)', color: '#3b82f6' },
            { name: 'Bridge Contract', sub: 'ETH ↔ BSC', color: '#f59e0b' },
            { name: 'Wallet C', sub: 'Pegged BSC Token', color: '#8b5cf6' },
            { name: 'VASP-X', sub: 'Candidate Deposit', color: '#ef4444' },
          ].map((hop, idx, arr) => (
            <React.Fragment key={hop.name}>
              <div style={{
                textAlign: 'center',
                minWidth: 110,
                background: 'var(--bg-card)',
                padding: '10px',
                borderRadius: 6,
                border: `1px solid ${hop.color}40`,
                borderTop: `3px solid ${hop.color}`
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{hop.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{hop.sub}</div>
              </div>

              {idx < arr.length - 1 && (
                <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. BEHAVIORAL INDICATORS & 3. VASP CANDIDATES (Side-by-side) */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Behavioral Indicators */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">2. BEHAVIORAL PATTERN INDICATORS</span>
            <span className="badge badge-inference">HEURISTICS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {riskList.map((risk: any, i: number) => {
              const detected = risk.detected !== false;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 12px',
                    background: 'var(--bg-input)',
                    borderRadius: 6,
                    border: '1px solid var(--border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {risk.indicator_type}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {risk.description}
                    </div>
                  </div>

                  <span className={`badge ${detected ? 'badge-high' : 'badge-low'}`} style={{ flexShrink: 0 }}>
                    {detected ? 'DETECTED' : 'NOT DETECTED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* VASP Candidates */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <span className="card-title">3. VASP CANDIDATE ATTRIBUTION</span>
              <span className="badge badge-candidate">CANDIDATE</span>
            </div>

            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              padding: '18px',
              marginBottom: 16
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {vaspItem.vasp_name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--accent-amber)', fontWeight: 700, marginTop: 4 }}>
                Candidate Attribution: {vaspItem.confidence || 92}%
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 6, wordBreak: 'break-all' }}>
                Wallet C: {vaspItem.wallet_address || '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2'}
              </div>

              <div style={{ marginTop: 14 }}>
                <button
                  onClick={onOpenWhy}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}
                >
                  <HelpCircle size={14} />
                  <span>[ WHY? Explanatory Reasoning ]</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px dashed var(--border-bright)',
            borderRadius: 6,
            padding: '10px 12px',
            fontSize: 11,
            color: 'var(--text-muted)'
          }}>
            Attribution is derived from synthetic cluster clustering. Indian Sahyog / FIU-IND formal production order required before legal freezing.
          </div>
        </div>
      </div>

      {/* 4. INVESTIGATION GAPS (Actionable) */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="card-title">4. ACTIONABLE INVESTIGATION GAPS ({gapsList.length})</span>
            <span className="badge badge-medium">CRITICAL UNKNOWNS</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click any gap to take action</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {gapsList.map((gap: any, idx: number) => (
            <div
              key={gap.id || idx}
              onClick={() => onSelectGap(gap)}
              className="gap-card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: 0
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <AlertTriangle size={18} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {gap.gap_description}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {gap.why_it_matters}
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0, fontSize: 11 }}>
                  <span>Inspect Gap →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
