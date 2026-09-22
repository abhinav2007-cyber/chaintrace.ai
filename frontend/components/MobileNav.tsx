'use client';

import React from 'react';
import { FileText, GitFork, AlertTriangle, Send } from 'lucide-react';

interface MobileNavProps {
  currentStage: string;
  onSelectStage: (stage: string) => void;
  activeCaseId: string | null;
}

export function MobileNav({ currentStage, onSelectStage, activeCaseId }: MobileNavProps) {
  if (!activeCaseId) return null;

  const tabs = [
    { id: 'evidence', label: 'Evidence', icon: FileText, num: '01' },
    { id: 'analysis', label: 'Analysis', icon: GitFork, num: '02' },
    { id: 'findings', label: 'Findings', icon: AlertTriangle, num: '03' },
    { id: 'actions', label: 'Actions', icon: Send, num: '04' },
  ];

  return (
    <nav className="mobile-nav mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 120,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.5)'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentStage === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectStage(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 4px',
              background: 'none',
              border: 'none',
              borderTop: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <Icon size={18} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
