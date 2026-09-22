'use client';

import React, { useState } from 'react';
import { X, Send, Download, Copy, AlertTriangle, Check, ShieldCheck, Edit3 } from 'lucide-react';

interface VaspPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  vaspPacket: any;
}

export function VaspPacketModal({
  isOpen,
  onClose,
  caseId,
  vaspPacket,
}: VaspPacketModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedNotes, setEditedNotes] = useState<string>('Urgent preservation request. Account suspected in cyber fraud syndicate.');

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = JSON.stringify(vaspPacket, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(vaspPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VASP_REQUEST_${caseId}.json`;
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
          width: 'min(640px, 95vw)',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
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
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SAHYOG-READY LEGAL DISPATCH DRAFT
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              VASP INFORMATION REQUEST PACKET
            </h3>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Packet Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, fontSize: 13 }}>
          {/* Packet Info Grid */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px', marginBottom: 20 }}>
            <div className="packet-field" style={{ padding: '6px 0' }}>
              <div className="packet-label">CASE IDENTIFIER:</div>
              <div className="packet-value mono" style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                {caseId}
              </div>
            </div>

            <div className="packet-field" style={{ padding: '6px 0' }}>
              <div className="packet-label">VASP CANDIDATE:</div>
              <div className="packet-value" style={{ fontWeight: 700, color: 'var(--accent-red)' }}>
                VASP-X (Attribution Confidence: 92%)
              </div>
            </div>

            <div className="packet-field" style={{ padding: '6px 0' }}>
              <div className="packet-label">RELEVANT WALLET:</div>
              <div className="packet-value mono" style={{ fontSize: 11, wordBreak: 'break-all' }}>
                0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2
              </div>
            </div>

            <div className="packet-field" style={{ padding: '6px 0' }}>
              <div className="packet-label">RELEVANT DATE / WINDOW:</div>
              <div className="packet-value">
                2026-09-15 (10:30 AM – 12:00 PM IST)
              </div>
            </div>

            <div className="packet-field" style={{ padding: '6px 0' }}>
              <div className="packet-label">SUPPORTING EVIDENCE:</div>
              <div className="packet-value" style={{ display: 'flex', gap: 6 }}>
                <span className="ev-id">E-005</span>
                <span className="ev-id">E-008</span>
                <span className="ev-id">E-011</span>
              </div>
            </div>
          </div>

          {/* Requested Information Checklist */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              REQUESTED INFORMATION (UNDER SEC 91 CrPC / LEA DIRECTIVE)
            </div>

            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: 12,
              color: 'var(--text-secondary)'
            }}>
              <div>1. Complete KYC, identity documents, phone number, and email of account holder.</div>
              <div>2. Complete ledger transaction history for deposit address for specified 7-day window.</div>
              <div>3. Full login IP logs, device identifiers, and withdrawal destinations.</div>
              <div>4. Immediate administrative freeze / preservation under Section 91 CrPC.</div>
            </div>
          </div>

          {/* Additional Investigator Notes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                INVESTIGATOR NOTES
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Edit3 size={12} />
                <span>{isEditing ? 'Save Notes' : 'Edit Notes'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                rows={3}
                style={{ width: '100%', fontSize: 12, resize: 'vertical' }}
              />
            ) : (
              <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 6, fontSize: 12, color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                {editedNotes}
              </div>
            )}
          </div>

          {/* Mandatory Human Review Warning */}
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 6,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <AlertTriangle size={20} color="var(--accent-red)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--accent-red)' }}>⚠ HUMAN REVIEW REQUIRED:</strong> This packet has been generated using AI-assisted analysis and must be reviewed and countersigned by an authorized Cyber Inspector before submission to exchange nodal officers.
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <button onClick={handleCopy} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied JSON!' : 'Copy Packet JSON'}</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownload} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />
              <span>Download File</span>
            </button>
            <button onClick={onClose} className="btn btn-primary btn-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
