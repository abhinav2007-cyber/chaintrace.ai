'use client';

import React from 'react';
import { ArrowUpDown, HelpCircle, FileText, CheckCircle2, AlertCircle, HelpCircle as QuestionIcon } from 'lucide-react';

interface CorrelationsViewProps {
  correlations: any[];
  onOpenWhy: () => void;
  onViewEvidence: (evidenceId: string) => void;
}

export function CorrelationsView({
  correlations,
  onOpenWhy,
  onViewEvidence,
}: CorrelationsViewProps) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          CROSS-DOMAIN EVIDENCE CORRELATIONS
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Explainable probabilistic linkages connecting traditional fiat banking records to on-chain cryptocurrency transactions.
        </p>
      </div>

      {/* Primary Highlight Card: Correlation #01 */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 10,
        padding: '24px',
        marginBottom: 24,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--accent-purple)' }}>
              CORRELATION #01
            </span>
            <span className="badge badge-high">HIGH CONFIDENCE</span>
          </div>
          <span className="badge badge-inference">AI INFERENCE</span>
        </div>

        {/* The Two Halves: Bank vs Crypto */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 16,
          background: 'var(--bg-input)',
          padding: '18px',
          borderRadius: 8,
          marginBottom: 18
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              FIAT BANK PAYMENT
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-green)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              ₹2,50,000
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              UPI Ref: 629104882910 • 10:31 AM IST
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Source: bank_statement.csv (E-002)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-purple)' }}>
            <ArrowUpDown size={22} />
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              CRYPTO MOVEMENT
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              ~₹2,48,700 <span style={{ fontSize: 13, fontWeight: 500 }}>(1.84 ETH)</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              Wallet A (0xa1b2...) • 10:38 AM IST
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Source: wallet.txt (E-005)
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{
          display: 'flex',
          gap: 24,
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          borderRadius: 6,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Time Difference: </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              7 min 29 sec
            </span>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Amount Similarity: </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              99.4%
            </span>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Entity Linkage: </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
              Wallet address in chat instructions
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button
            onClick={onOpenWhy}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}
          >
            <HelpCircle size={14} />
            <span>[ WHY? ]</span>
          </button>

          <button
            onClick={() => onViewEvidence('E-002')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FileText size={14} />
            <span>[ VIEW EVIDENCE E-002 ]</span>
          </button>
        </div>

        {/* Underneath: The rigorous FACT vs INFERENCE vs UNKNOWN table */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}>
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
              ✓ FACT
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2 }}>
              Bank payment occurred at 10:31 AM via verified UTR ledger.
            </div>
          </div>

          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
              ✓ FACT
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2 }}>
              Crypto transaction occurred on Ethereum block at 10:38 AM.
            </div>
          </div>

          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              ● INFERENCE
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2 }}>
              High temporal and amount similarity indicates probable cash-out conversion.
            </div>
          </div>

          <div style={{ background: 'rgba(71,85,105,0.1)', border: '1px solid var(--border)', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ? UNKNOWN
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              No independent KYC evidence proving merchant sold crypto directly to victim.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
