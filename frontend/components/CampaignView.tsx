'use client';

import React from 'react';
import { Network, ArrowRight, Share2, Layers, ShieldAlert, AlertTriangle } from 'lucide-react';

interface CampaignViewProps {
  onOpenCase?: (caseId: string) => void;
}

export function CampaignView({ onOpenCase }: CampaignViewProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            MULTI-CASE CAMPAIGN DETECTION
          </h3>
          <span className="badge badge-demo">SYNTHETIC LINKAGE</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Cross-investigation entity overlap detecting shared syndicate infrastructure without asserting unverified legal conspiracy.
        </p>
      </div>

      {/* Cluster Visual diagram */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '30px 20px',
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 20 }}>
          POTENTIAL SHARED INFRASTRUCTURE MAP
        </div>

        {/* Root Case */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.15)', border: '2px solid var(--accent-blue)', borderRadius: 8, padding: '10px 24px', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
          <span>CURRENT CASE: CYBER-2026-0847</span>
        </div>

        {/* Connecting Lines */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 140, margin: '14px 0 10px' }}>
          <div style={{ width: 2, height: 26, background: 'var(--accent-cyan)' }} />
          <div style={{ width: 2, height: 26, background: 'var(--accent-purple)' }} />
          <div style={{ width: 2, height: 26, background: 'var(--accent-amber)' }} />
        </div>

        {/* Overlapping Entity Nodes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-cyan)', borderRadius: 6, padding: '8px 16px', fontSize: 12, color: 'var(--text-primary)' }}>
            <div style={{ fontSize: 9, color: 'var(--accent-cyan)', fontWeight: 700 }}>PHONE ENTITY</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>+91 98765 43210</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-purple)', borderRadius: 6, padding: '8px 16px', fontSize: 12, color: 'var(--text-primary)' }}>
            <div style={{ fontSize: 9, color: 'var(--accent-purple)', fontWeight: 700 }}>WEBSITE DOMAIN</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>fastgains-trading.com</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-amber)', borderRadius: 6, padding: '8px 16px', fontSize: 12, color: 'var(--text-primary)' }}>
            <div style={{ fontSize: 9, color: 'var(--accent-amber)', fontWeight: 700 }}>WALLET CLUSTER</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>0xa1b2... (Wallet A)</div>
          </div>
        </div>

        {/* Downward Lines */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 140, margin: '6px 0 14px' }}>
          <div style={{ width: 2, height: 24, background: 'var(--border-bright)' }} />
          <div style={{ width: 2, height: 24, background: 'var(--border-bright)' }} />
          <div style={{ width: 2, height: 24, background: 'var(--border-bright)' }} />
        </div>

        {/* Connected Cases */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
            CASE CYBER-2026-0731
          </div>

          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
            CASE CYBER-2026-0789
          </div>

          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
            CASE CYBER-2026-0801
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">SHARED INFRASTRUCTURE INVENTORY</span>
          <span className="badge badge-inference">POTENTIAL COMMON ACTOR</span>
        </div>

        <table className="ct-table">
          <thead>
            <tr>
              <th>Shared Entity</th>
              <th>Type</th>
              <th>Matched Cases</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">+91 98765 43210</td>
              <td>Phone / WhatsApp</td>
              <td>2 Active Cases (0847, 0731)</td>
              <td><span className="badge badge-high">High Overlap</span></td>
            </tr>
            <tr>
              <td className="mono">fastgains-trading.com</td>
              <td>Domain / Hosting</td>
              <td>2 Active Cases (0847, 0789)</td>
              <td><span className="badge badge-high">Identical Phish</span></td>
            </tr>
            <tr>
              <td className="mono">0xa1b2c3d4...a9b0</td>
              <td>Ethereum Deposit Wallet</td>
              <td>2 Active Cases (0847, 0801)</td>
              <td><span className="badge badge-high">Common Collector</span></td>
            </tr>
            <tr>
              <td>Rapid Layering Pattern</td>
              <td>Behavioral Heuristic</td>
              <td>3 Cases</td>
              <td><span className="badge badge-medium">Same Modus</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
