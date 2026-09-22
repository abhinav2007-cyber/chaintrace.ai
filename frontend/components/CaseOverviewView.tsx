'use client';

import React from 'react';
import { ArrowLeft, Clock, GitFork, CheckCircle2, Circle, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface CaseOverviewViewProps {
  bundle: any;
  onBackToCases: () => void;
  onNavigateStage: (stage: string) => void;
  onSelectAnalysisTab: (tab: string) => void;
  onOpenCopilot?: () => void;
}

export function CaseOverviewView({
  bundle,
  onBackToCases,
  onNavigateStage,
  onSelectAnalysisTab,
  onOpenCopilot,
}: CaseOverviewViewProps) {
  const caseData = bundle?.case || {};
  const evidenceCount = bundle?.evidence?.length || 4;
  const entitiesCount = bundle?.entities?.length || 14;
  const correlationsCount = bundle?.correlations?.length || 2;
  const gapsCount = bundle?.gaps?.length || 3;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={onBackToCases}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <ArrowLeft size={14} />
        <span>← All Investigations</span>
      </button>

      {/* Case Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
              {caseData.id || 'CYBER-2026-0847'}
            </span>
            <span className="badge badge-fact">
              ● ANALYSIS READY
            </span>
            <span className="badge badge-demo">
              DEMO / SYNTHETIC DATA
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {caseData.title || 'Investment Scam — fastgains-trading.com'}
          </h2>

          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Victim transferred ₹2,50,000 via UPI. Cross-chain tracking and off-chain chat evidence fused.
          </div>
        </div>
      </div>

      {/* 4 Stat Tiles */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div 
          className="stat-tile" 
          onClick={() => onNavigateStage('evidence')}
          style={{ cursor: 'pointer', textAlign: 'left', padding: '16px 18px', transition: 'border-color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{evidenceCount}</div>
          <div className="stat-label">Evidence Items</div>
          <div style={{ fontSize: 11, color: 'var(--accent-blue)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>View 01 Evidence</span>
            <ArrowUpRight size={12} />
          </div>
        </div>

        <div 
          className="stat-tile" 
          onClick={() => { onNavigateStage('analysis'); onSelectAnalysisTab('graph'); }}
          style={{ cursor: 'pointer', textAlign: 'left', padding: '16px 18px', transition: 'border-color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{entitiesCount}</div>
          <div className="stat-label">Entities Extracted</div>
          <div style={{ fontSize: 11, color: 'var(--accent-cyan)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>Explore Graph</span>
            <ArrowUpRight size={12} />
          </div>
        </div>

        <div 
          className="stat-tile" 
          onClick={() => { onNavigateStage('analysis'); onSelectAnalysisTab('correlations'); }}
          style={{ cursor: 'pointer', textAlign: 'left', padding: '16px 18px', transition: 'border-color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{correlationsCount}</div>
          <div className="stat-label">Correlations</div>
          <div style={{ fontSize: 11, color: 'var(--accent-purple)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>Review Links</span>
            <ArrowUpRight size={12} />
          </div>
        </div>

        <div 
          className="stat-tile" 
          onClick={() => onNavigateStage('findings')}
          style={{ cursor: 'pointer', textAlign: 'left', padding: '16px 18px', transition: 'border-color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{gapsCount}</div>
          <div className="stat-label">Investigation Gaps</div>
          <div style={{ fontSize: 11, color: 'var(--accent-amber)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>Actionable Gaps</span>
            <ArrowUpRight size={12} />
          </div>
        </div>
      </div>

      {/* Case Story Card */}
      <div className="card" style={{ marginBottom: 28, borderLeft: '3px solid var(--accent-blue)' }}>
        <div className="card-header">
          <span className="card-title">CASE RECONSTRUCTION & STORY</span>
          <span className="badge badge-inference">AI SYNTHESIS • PROBABILISTIC</span>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {caseData.case_story || (
            <>
              A ₹2,50,000 UPI payment was identified at 10:31 AM. Approximately 7 minutes later, corresponding crypto activity appears in the synthetic transaction dataset.
              <br /><br />
              The funds subsequently moved through Wallet B, a bridge contract and Wallet C before reaching a VASP candidate attribution cluster (92% candidate attribution confidence).
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button
            onClick={() => { onNavigateStage('analysis'); onSelectAnalysisTab('timeline'); }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Clock size={15} />
            <span>View Timeline</span>
          </button>

          <button
            onClick={() => { onNavigateStage('analysis'); onSelectAnalysisTab('graph'); }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <GitFork size={15} />
            <span>Investigate Graph</span>
          </button>
        </div>
      </div>

      {/* Interactive AI Copilot Chat Feature Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.15) 100%)',
        border: '1px solid rgba(139,92,246,0.35)',
        borderRadius: 10,
        padding: '20px 24px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ maxWidth: 580 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Ask Questions directly to ChainTrace AI Copilot
            </span>
            <span className="badge badge-inference" style={{ fontWeight: 700 }}>
              INTERACTIVE CHAT
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }}>
            Have questions about this case? Ask about wallet hops, evidence linkages, or legal caveats. The AI responds with citations to uploaded files and separates Facts from Inferences.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--accent-cyan)', background: 'var(--bg-card)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
              Try: "What connects Wallet A to this case?"
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent-purple)', background: 'var(--bg-card)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
              Try: "Why was VASP-X flagged as candidate?"
            </span>
          </div>
        </div>

        <button
          onClick={onOpenCopilot}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            fontWeight: 700,
            fontSize: 13,
            padding: '11px 20px',
            border: 'none',
            boxShadow: '0 0 16px rgba(139,92,246,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <span>💬 Open Copilot Chat →</span>
        </button>
      </div>

      {/* Investigation Progress Checklist */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">INVESTIGATION PROGRESS</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Workflow Tracking</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={18} color="var(--accent-green)" />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              Evidence collected & SHA-256 hashed (4 items)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={18} color="var(--accent-green)" />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              Entities extracted (phone, website, bank utr, wallets, bridge)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={18} color="var(--accent-green)" />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              Multi-hop fund flow reconstructed (Wallet A → B → Bridge → C)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>●</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              Correlations under review (Bank payment ↔ Wallet A temporal linkage)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Circle size={18} color="var(--text-muted)" />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Official VASP packet & forensic report not yet generated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
