'use client';

import React, { useState } from 'react';
import { FileText, Send, Share2, AlertTriangle, ShieldCheck, Download, Copy, Printer, Check, Eye } from 'lucide-react';

interface ActionsViewProps {
  caseId: string;
  bundle: any;
  onOpenReportModal: () => void;
  onOpenVaspPacketModal: () => void;
}

export function ActionsView({
  caseId,
  bundle,
  onOpenReportModal,
  onOpenVaspPacketModal,
}: ActionsViewProps) {
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [summaryPreview, setSummaryPreview] = useState<boolean>(false);

  const handleCopySummary = () => {
    const text = `CHAINTRACE FORENSIC BRIEFING [SYNTHETIC DEMO]
Case ID: ${caseId}
Title: ${bundle?.case?.title || 'Investment Scam'}
Total Loss: ₹2,50,000 (UPI UTR: 629104882910)
Temporal Linkage: ₹2.50L fiat UPI at 10:31 AM correlated with 1.84 ETH at 10:38 AM (Wallet A)
Fund Flow Path: Wallet A -> Wallet B -> Bridge Contract -> Wallet C -> VASP-X
Candidate Attribution: VASP-X (92% prototype heuristic)
Human Review Required: Yes. All attribution requires formal Sahyog inquiry notice.`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          INVESTIGATIVE ACTIONS & LEGAL PACKETS
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Convert fused digital evidence and AI findings into official reports, Sahyog-ready exchange packets, and prosecutorial summaries.
        </p>
      </div>

      {/* 3 Action Cards */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {/* Card 1: Investigation Report */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(59,130,246,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)',
              marginBottom: 16
            }}>
              <FileText size={22} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              INVESTIGATION REPORT
            </h3>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              Generate complete evidence-backed forensic dossier with SHA-256 custody seals, timeline, and Section 65B Indian Evidence Act certificate.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={onOpenReportModal}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Eye size={15} />
              <span>[ Generate Report ]</span>
            </button>
          </div>
        </div>

        {/* Card 2: VASP Request */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '3px solid var(--accent-red)' }}>
          <div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red)',
              marginBottom: 16
            }}>
              <Send size={22} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                VASP REQUEST PACKET
              </h3>
              <span className="badge badge-high" style={{ fontSize: 9 }}>SAHYOG READY</span>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              Prepare formal information request for review. Formats wallet hashes, transaction proofs, and targeted preservation questions for exchange legal officers.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={onOpenVaspPacketModal}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                border: 'none'
              }}
            >
              <Send size={15} />
              <span>[ Prepare Packet ]</span>
            </button>
          </div>
        </div>

        {/* Card 3: Share Case Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(16,185,129,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-green)',
              marginBottom: 16
            }}>
              <Share2 size={22} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              SHARE CASE SUMMARY
            </h3>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              Create an encrypted, review-ready case brief for supervisory officers, prosecutors, or coordinating cyber cells.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleCopySummary}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {copiedSummary ? <Check size={15} color="var(--accent-green)" /> : <Copy size={15} />}
              <span>{copiedSummary ? 'Copied Briefing!' : '[ Copy Summary ]'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Human Review Reminder */}
      <div style={{
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 8,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }}>
        <AlertTriangle size={24} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--accent-amber)' }}>MANDATORY PROCEDURAL PROTOCOL:</strong> All AI-generated packets and conclusions are probabilistic assistive drafts. No automated production orders or legal notices are sent directly to external parties without signed investigator authorization.
        </div>
      </div>
    </div>
  );
}
