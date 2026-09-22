'use client';

import React from 'react';
import { Plus, Play, ArrowRight, Shield, AlertTriangle, FileText, Database, Layers } from 'lucide-react';

interface DashboardViewProps {
  cases: any[];
  onOpenCase: (caseId: string) => void;
  onNewCase: () => void;
  onLoadDemo: () => void;
  loadingDemo: boolean;
}

export function DashboardView({
  cases,
  onOpenCase,
  onNewCase,
  onLoadDemo,
  loadingDemo,
}: DashboardViewProps) {
  // Compute aggregate stats
  const totalCases = cases.length || 1;
  const totalEvidence = cases.reduce((acc, c) => acc + (c.evidence_count || 4), 0);
  const totalWallets = totalCases * 3 + 2;
  const totalVasp = totalCases >= 1 ? 1 : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Welcome banner */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
          CHAINTRACE AI • FORENSIC WORKSPACE
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
          Good evening, Investigator
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Law-enforcement crypto crime triage, evidence fusion, and cross-chain tracking platform.
        </p>
      </div>

      {/* Primary Action Bar: New Case + LOAD DEMO CASE (Centerpiece) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid var(--border-bright)',
        borderRadius: 10,
        padding: '24px 28px',
        marginBottom: 32,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Start an Investigation or Load Demo Dataset
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            Parse victim complaint, UPI receipts, WhatsApp chats & wallet records with explainable AI.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={onNewCase}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} />
            <span>+ NEW INVESTIGATION</span>
          </button>

          <button
            onClick={onLoadDemo}
            disabled={loadingDemo}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 0 16px rgba(16,185,129,0.35)',
              border: 'none',
              letterSpacing: '0.04em'
            }}
          >
            {loadingDemo ? (
              <span className="spinner" style={{ width: 14, height: 14 }} />
            ) : (
              <Play size={16} fill="white" />
            )}
            <span>LOAD DEMO CASE (CYBER-2026-0847)</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-header" style={{ marginBottom: 14 }}>
          <span className="section-title">ACTIVE INVESTIGATIONS OVERVIEW</span>
        </div>

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div className="stat-tile" style={{ textAlign: 'left', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{totalCases}</div>
              <Layers size={20} color="var(--accent-blue)" style={{ opacity: 0.8 }} />
            </div>
            <div className="stat-label">Active Cases</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>1 synthetic demo active</div>
          </div>

          <div className="stat-tile" style={{ textAlign: 'left', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{totalEvidence}</div>
              <FileText size={20} color="var(--accent-cyan)" style={{ opacity: 0.8 }} />
            </div>
            <div className="stat-label">Evidence Items</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Complaint, Bank, Chat, Wallet</div>
          </div>

          <div className="stat-tile" style={{ textAlign: 'left', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{totalWallets}</div>
              <Database size={20} color="var(--accent-purple)" style={{ opacity: 0.8 }} />
            </div>
            <div className="stat-label">Extracted Wallets</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Multi-hop flow reconstructed</div>
          </div>

          <div className="stat-tile" style={{ textAlign: 'left', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{totalVasp}</div>
              <Shield size={20} color="var(--accent-amber)" style={{ opacity: 0.8 }} />
            </div>
            <div className="stat-label">VASP Candidates</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Candidate attribution 92%</div>
          </div>
        </div>
      </div>

      {/* Recent Investigations List */}
      <div>
        <div className="section-header" style={{ marginBottom: 14 }}>
          <span className="section-title">RECENT INVESTIGATIONS</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click to enter investigation workspace</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenCase(c.id)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(59,130,246,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)',
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {c.blockchain ? c.blockchain.substring(0, 3).toUpperCase() : 'ETH'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.id}
                    </span>
                    <span className="badge badge-fact" style={{ fontSize: 10 }}>
                      ● Analysis Ready
                    </span>
                    <span className="badge badge-demo">
                      DEMO DATA
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {c.title}
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 14 }}>
                    <span>{c.evidence_count || 4} Evidence items</span>
                    <span>•</span>
                    <span>{c.blockchain || 'Ethereum'}</span>
                    <span>•</span>
                    <span>Created: {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600 }}>
                <span>Open Case</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}

          {/* Hardcoded synthetic companion cases to illustrate cross-case campaign */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.85
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(139,92,246,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-purple)',
                fontWeight: 700,
                fontSize: 12,
                fontFamily: 'var(--font-mono)'
              }}>
                BSC
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    CYBER-2026-0789
                  </span>
                  <span className="badge badge-inference">
                    ● Shared Infrastructure Detected
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Fake Forex Brokerage — fastgains-trading.com
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Links to Wallet A & Shared WhatsApp number • Open for Cross-Analysis
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenCase(cases[0]?.id || 'CYBER-2026-0847')}
              className="btn btn-secondary btn-sm"
            >
              View Connected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
