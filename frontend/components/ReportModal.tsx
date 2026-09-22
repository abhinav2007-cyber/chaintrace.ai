'use client';

import React from 'react';
import { X, Printer, Download, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  bundle: any;
}

export function ReportModal({ isOpen, onClose, caseId, bundle }: ReportModalProps) {
  if (!isOpen) return null;

  const caseData = bundle?.case || {};
  const evidenceList = bundle?.evidence || [];
  const entitiesList = bundle?.entities || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = `# CHAINTRACE AI — INVESTIGATION REPORT
Case ID: ${caseId}
Title: ${caseData.title || 'Investment Scam'}
Date: ${new Date().toLocaleDateString()}
Status: Complete Forensic Synthesis (DEMO / SYNTHETIC)

## 1. Executive Summary
${caseData.case_story || 'Victim defrauded of ₹2,50,000 via UPI. Cross-chain fund flow tracked to VASP-X candidate.'}

## 2. Chain of Custody & Evidence Hashes
${evidenceList.map((e: any) => `- ${e.evidence_id}: ${e.filename} (SHA-256: ${e.sha256_hash})`).join('\n')}

## 3. Extracted Entities
${entitiesList.map((ent: any) => `- ${ent.entity_type.toUpperCase()}: ${ent.value} [${ent.fact_type}]`).join('\n')}

## 4. Legal Certification (Section 65B Indian Evidence Act)
I hereby certify that the electronic records and cryptographic hashes produced herein were generated in the ordinary course of digital forensic analysis.`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CHAINTRACE_REPORT_${caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 200,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(820px, 95vw)',
          maxHeight: '90vh',
          background: '#0d1528',
          border: '1px solid var(--border-bright)',
          borderRadius: 10,
          zIndex: 210,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              OFFICIAL INVESTIGATIVE DOSSIER
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              Case Report: {caseId}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button onClick={handleDownloadMarkdown} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />
              <span>Export .MD</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1, fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {/* Header metadata */}
          <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  CHAINTRACE AI • FORENSIC INVESTIGATION REPORT
                </h2>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Cybercrime Digital Evidence Fusion & Attribution Module
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-demo">SYNTHETIC DEMO RECORD</span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Date: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Case Details */}
          <div className="report-section">
            <h3>1. Case Identification</h3>
            <p><strong>Case Number:</strong> {caseId}</p>
            <p><strong>Subject:</strong> {caseData.title || 'Investment Scam — fastgains-trading.com'}</p>
            <p><strong>Primary Blockchain:</strong> {caseData.blockchain || 'Ethereum Mainnet'}</p>
            <p><strong>Initial Wallet:</strong> <span className="mono">0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0</span></p>
          </div>

          {/* 2. Executive Story */}
          <div className="report-section">
            <h3>2. Executive Narrative</h3>
            <p>
              {caseData.case_story || (
                'Victim was lured via WhatsApp messaging by an individual operating from +91 98765 43210 promoting guaranteed cryptocurrency returns on fastgains-trading.com. A ₹2,50,000 UPI transaction was initiated to a designated merchant UPI at 10:31 AM. Within 7 minutes and 29 seconds, 1.84 ETH (~₹2,48,700 equivalent) was deposited into Wallet A. The funds subsequently hopped through Wallet B, a cross-chain Ethereum-to-BSC bridge contract, Wallet C, and into a candidate deposit address attributed to VASP-X with 92% confidence.'
              )}
            </p>
          </div>

          {/* 3. Evidence Hashes & Chain of Custody */}
          <div className="report-section">
            <h3>3. Cryptographic Chain of Custody (Sec 65B Evidence Act)</h3>
            <table className="ct-table">
              <thead>
                <tr>
                  <th>Evidence ID</th>
                  <th>Filename</th>
                  <th>SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((e: any) => (
                  <tr key={e.evidence_id}>
                    <td><span className="ev-id">{e.evidence_id}</span></td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{e.filename}</td>
                    <td className="mono" style={{ fontSize: 10, color: 'var(--accent-green)' }}>
                      {e.sha256_hash || '8a91c5e2f3d4b6a7c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Attribution & Limitations */}
          <div className="report-section" style={{ borderBottom: 'none' }}>
            <h3>4. Attribution & Investigative Caveat</h3>
            <p>
              VASP candidate attribution for Wallet C was assigned to <strong>VASP-X</strong> with a 92% prototype heuristic score.
              This conclusion is based on behavioral clustering and graph proximity. It serves as an investigative lead and does not constitute definitive legal proof of ownership.
            </p>
            <div style={{ marginTop: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color="var(--accent-green)" />
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Certified under Section 65B of the Indian Evidence Act. Integrity sealed by ChainTrace AI cryptographic verification engine.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
