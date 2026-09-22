'use client';

import React, { useState } from 'react';
import { Plus, Search, ArrowRight, ShieldCheck, FileText, Database } from 'lucide-react';

interface CasesListViewProps {
  cases: any[];
  onOpenCase: (caseId: string) => void;
  onNewCase: () => void;
}

export function CasesListView({ cases, onOpenCase, onNewCase }: CasesListViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = cases.filter((c) =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.blockchain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            ACTIVE INVESTIGATIONS REPOSITORY
          </h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Manage and track all ongoing crypto scam and multi-hop investigations.
          </div>
        </div>

        <button onClick={onNewCase} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} />
          <span>+ New Investigation</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by case ID, title, blockchain, or wallet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', fontSize: 13 }}
        />
      </div>

      {/* Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onOpenCase(c.id)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(59,130,246,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: 12
              }}>
                {c.blockchain ? c.blockchain.substring(0, 3).toUpperCase() : 'ETH'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {c.id}
                  </span>
                  <span className="badge badge-fact">ANALYSIS READY</span>
                  <span className="badge badge-demo">DEMO DATA</span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {c.title}
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {c.evidence_count || 4} Evidence Items • {c.entity_count || 14} Entities • Created: {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600 }}>
              <span>Enter Workspace</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
