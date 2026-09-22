'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Network, 
  CheckCircle2, 
  Share2, 
  ShieldAlert, 
  FileSearch,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeCaseId: string | null;
  activeCaseTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot?: () => void;
}

export function Sidebar({
  currentView,
  onNavigate,
  activeCaseId,
  activeCaseTitle,
  isOpen,
  onClose,
  onOpenCopilot,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 90,
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 230,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div className="sidebar-logo" style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 13
            }}>
              CT
            </div>
            <div>
              <div className="logo-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                CHAINTRACE <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
              </div>
              <div className="logo-sub" style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Forensic Evidence Fusion
              </div>
            </div>
          </div>
        </div>

        {/* Demo banner indicator */}
        <div style={{
          padding: '6px 14px',
          background: 'rgba(245,158,11,0.08)',
          borderBottom: '1px solid rgba(245,158,11,0.2)',
          fontSize: 10,
          color: 'var(--accent-amber)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
          SYNTHETIC / DEMO MODE
        </div>

        {/* Navigation list */}
        <div className="sidebar-nav" style={{ padding: '12px 0', flex: 1 }}>
          {/* WORKSPACE */}
          <div className="nav-section-label">WORKSPACE</div>
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => { onNavigate('dashboard'); onClose(); }}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
          >
            <LayoutDashboard className="nav-icon" size={15} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${currentView === 'cases_list' ? 'active' : ''}`}
            onClick={() => { onNavigate('cases_list'); onClose(); }}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
          >
            <FolderKanban className="nav-icon" size={15} />
            <span>Cases</span>
          </button>

          {/* CURRENT INVESTIGATION */}
          <div style={{ marginTop: 16 }}>
            <div className="nav-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>CURRENT INVESTIGATION</span>
              {activeCaseId && (
                <span style={{ fontSize: 9, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                  ACTIVE
                </span>
              )}
            </div>

            {activeCaseId ? (
              <>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(59,130,246,0.05)',
                  margin: '4px 10px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(59,130,246,0.15)'
                }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {activeCaseId}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                    {activeCaseTitle || 'Investment Scam'}
                  </div>
                </div>

                <button
                  className={`nav-item ${currentView === 'case_overview' ? 'active' : ''}`}
                  onClick={() => { onNavigate('case_overview'); onClose(); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  <FileText className="nav-icon" size={15} />
                  <span>Overview</span>
                </button>
                <button
                  className={`nav-item ${currentView === 'evidence' ? 'active' : ''}`}
                  onClick={() => { onNavigate('evidence'); onClose(); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 18, color: 'var(--accent-blue)' }}>01</span>
                  <span>Evidence</span>
                </button>
                <button
                  className={`nav-item ${currentView === 'analysis' ? 'active' : ''}`}
                  onClick={() => { onNavigate('analysis'); onClose(); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 18, color: 'var(--accent-cyan)' }}>02</span>
                  <span>Analysis</span>
                </button>
                <button
                  className={`nav-item ${currentView === 'findings' ? 'active' : ''}`}
                  onClick={() => { onNavigate('findings'); onClose(); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 18, color: 'var(--accent-amber)' }}>03</span>
                  <span>Findings</span>
                </button>
                <button
                  className={`nav-item ${currentView === 'actions' ? 'active' : ''}`}
                  onClick={() => { onNavigate('actions'); onClose(); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 18, color: 'var(--accent-green)' }}>04</span>
                  <span>Actions</span>
                </button>

                {/* Direct AI Chat trigger inside case */}
                <button
                  className="nav-item"
                  onClick={() => { onOpenCopilot?.(); onClose(); }}
                  style={{
                    width: 'calc(100% - 20px)',
                    margin: '8px 10px 0',
                    textAlign: 'left',
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 13 }}>💬</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#c084fc' }}>Chat with Copilot</span>
                  <span className="badge badge-inference" style={{ marginLeft: 'auto', fontSize: 9, padding: '1px 5px' }}>
                    ASK AI
                  </span>
                </button>
              </>
            ) : (
              <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No active case selected. Open a case from Dashboard.
              </div>
            )}
          </div>

          {/* INTELLIGENCE */}
          <div style={{ marginTop: 16 }}>
            <div className="nav-section-label">INTELLIGENCE</div>
            <button
              className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}
              onClick={() => { onNavigate('campaigns'); onClose(); }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
            >
              <ShieldAlert className="nav-icon" size={15} />
              <span>Campaigns</span>
            </button>
          </div>

          {/* SYSTEM */}
          <div style={{ marginTop: 16 }}>
            <div className="nav-section-label">SYSTEM</div>
            <button
              className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
              onClick={() => { onNavigate('reports'); onClose(); }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
            >
              <FileSearch className="nav-icon" size={15} />
              <span>Reports</span>
            </button>
          </div>
        </div>

        {/* Footer info: iQOO 2026 */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.2)',
          fontSize: 10,
          color: 'var(--text-muted)'
        }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>iQOO Hackathon 2026</div>
          <div>Mobile Forensic Edition</div>
        </div>
      </aside>
    </>
  );
}
