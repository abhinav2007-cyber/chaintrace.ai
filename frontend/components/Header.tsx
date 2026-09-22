'use client';

import React from 'react';
import { Menu, Search, Sparkles, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  activeCaseId: string | null;
  onOpenMobileMenu: () => void;
  onOpenCopilot: () => void;
}

export function Header({
  currentView,
  activeCaseId,
  onOpenMobileMenu,
  onOpenCopilot,
}: HeaderProps) {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Investigator Dashboard';
      case 'cases_list': return 'All Investigations';
      case 'case_overview': return `Case Overview — ${activeCaseId || 'Active Case'}`;
      case 'evidence': return `Evidence Locker — ${activeCaseId || 'Active Case'}`;
      case 'analysis': return `Forensic Analysis — ${activeCaseId || 'Active Case'}`;
      case 'findings': return `Investigative Findings — ${activeCaseId || 'Active Case'}`;
      case 'actions': return `Case Actions & Packets — ${activeCaseId || 'Active Case'}`;
      case 'campaigns': return 'Campaign & Multi-Case Intelligence';
      case 'reports': return 'Formal Investigative Reports';
      default: return 'ChainTrace AI';
    }
  };

  return (
    <header className="page-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: 'var(--header-h)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="btn btn-secondary btn-sm mobile-only"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 8px' }}
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {getTitle()}
          </h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Cybercrime Cell • Digital Forensics & Crypto Intelligence
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Synthetic intelligence indicator */}
        <div 
          className="badge badge-demo"
          style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'help' }}
          title="All data generated for iQOO Hackathon 2026. No real-world PII or criminal accusations."
        >
          <ShieldCheck size={12} />
          <span>DEMO / SYNTHETIC</span>
        </div>

        {/* Global Copilot Ask Button */}
        <button
          onClick={onOpenCopilot}
          className="btn"
          title="Open interactive AI chat to ask questions about evidence, wallets, and legal facts"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            fontWeight: 700,
            fontSize: 12,
            boxShadow: '0 0 16px rgba(139,92,246,0.4)',
            border: 'none',
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={15} />
          <span>💬 Chat with AI Copilot</span>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981'
          }} />
        </button>
      </div>
    </header>
  );
}
