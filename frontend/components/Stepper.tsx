'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface StepperProps {
  currentStage: 'evidence' | 'analysis' | 'findings' | 'actions' | string;
  onSelectStage: (stage: string) => void;
  stats?: {
    evidenceCount?: number;
    entitiesCount?: number;
    gapsCount?: number;
    vaspCount?: number;
  };
}

export function Stepper({ currentStage, onSelectStage, stats }: StepperProps) {
  const steps = [
    { id: 'evidence', num: '01', title: 'EVIDENCE', subtitle: `${stats?.evidenceCount || 4} items extracted` },
    { id: 'analysis', num: '02', title: 'ANALYSIS', subtitle: 'Graph, timeline & flows' },
    { id: 'findings', num: '03', title: 'FINDINGS', subtitle: `${stats?.gapsCount || 3} gaps • 1 VASP` },
    { id: 'actions', num: '04', title: 'ACTIONS', subtitle: 'Report & VASP packet' },
  ];

  const getStatus = (stepId: string) => {
    const order = ['evidence', 'analysis', 'findings', 'actions'];
    const currentIndex = order.indexOf(currentStage);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 16px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflowX: 'auto',
      gap: 12
    }}>
      {steps.map((step, idx) => {
        const status = getStatus(step.id);
        const isActive = currentStage === step.id;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onSelectStage(step.id)}
              style={{
                background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                borderRadius: 6,
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                minWidth: 160
              }}
            >
              {/* Step indicator circle */}
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                background: status === 'completed'
                  ? 'var(--accent-green)'
                  : isActive
                  ? 'var(--accent-blue)'
                  : 'var(--bg-elevated)',
                color: status === 'completed' || isActive ? 'white' : 'var(--text-muted)',
                border: status === 'upcoming' ? '1px solid var(--border)' : 'none',
                flexShrink: 0
              }}>
                {status === 'completed' ? <Check size={14} /> : step.num}
              </div>

              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)'
                }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {step.subtitle}
                </div>
              </div>
            </button>

            {idx < steps.length - 1 && (
              <ChevronRight size={16} color="var(--border-bright)" style={{ flexShrink: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
