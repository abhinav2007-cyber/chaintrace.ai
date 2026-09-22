'use client';

import React from 'react';
import { FileText, Download, Eye, ShieldCheck } from 'lucide-react';

interface ReportsListViewProps {
  cases: any[];
  onOpenReport: (caseId: string) => void;
}

export function ReportsListView({ cases, onOpenReport }: ReportsListViewProps) {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          FORMAL FORENSIC REPORTS & CERTIFICATES
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Section 65B Indian Evidence Act compliant dossiers sealed with SHA-256 chain of custody verification.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: 'rgba(59,130,246,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)'
              }}>
                <FileText size={18} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    DOSSIER-{c.id}
                  </span>
                  <span className="badge badge-fact">CERTIFIED SEC 65B</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {c.title}
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenReport(c.id)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Eye size={14} />
              <span>Inspect & Export</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
