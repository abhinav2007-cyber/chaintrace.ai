'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Upload, CheckCircle2, Sparkles, ShieldCheck, Database, FileText } from 'lucide-react';
import { api } from '../lib/api';

interface NewCaseWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (caseId: string) => void;
}

export function NewCaseWizard({ isOpen, onClose, onCaseCreated }: NewCaseWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [caseId, setCaseId] = useState<string>('CYBER-2026-0847');
  const [caseType, setCaseType] = useState<string>('Financial / Crypto Investment Fraud');
  const [title, setTitle] = useState<string>('Investment Scam — fastgains-trading.com');
  const [description, setDescription] = useState<string>('Victim transferred ₹2,50,000 via UPI after being lured by guaranteed 400% crypto returns. Subsequent multi-hop blockchain transfer tracked.');
  const [walletAddress, setWalletAddress] = useState<string>('0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0');
  const [blockchain, setBlockchain] = useState<string>('Ethereum');

  // Step 2 evidence files selected
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    'complaint.txt',
    'bank_statement.csv',
    'chat.txt',
    'wallet.txt',
  ]);

  // Step 3 animation progress
  const [progressPercent, setProgressPercent] = useState<number>(10);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);

  const processingSteps = [
    'Reading victim complaint narrative',
    'Extracting entities (phone, domain, amounts, hashes)',
    'Processing bank UPI statements & UTR ledgers',
    'Processing WhatsApp chat dialogue & instructions',
    'Identifying Ethereum & BSC wallet clusters',
    'Hashing all evidence files with SHA-256 cryptographic seals',
    'Building unified fusion graph & temporal correlations',
  ];

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 15;
          setCurrentActionIndex(Math.min(processingSteps.length - 1, Math.floor((next / 100) * processingSteps.length)));
          return next;
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    setStep(3);
    try {
      // Create case or load demo
      await api.loadDemoCase();
    } catch (e) {
      console.log('Demo already loaded or created', e);
    }
  };

  const handleFinish = () => {
    onCaseCreated(caseId);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 220,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(620px, 95vw)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-bright)',
          borderRadius: 10,
          zIndex: 230,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Wizard Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              NEW INVESTIGATION WORKSPACE • STEP {step} OF 3
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {step === 1 && 'Case Details & Blockchain Anchor'}
              {step === 2 && 'Add Investigation Evidence'}
              {step === 3 && 'AI Evidence Extraction & Fusion'}
            </h3>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Step 1: Case Details */}
        {step === 1 && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Case Identification Number
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                style={{ width: '100%', marginTop: 4, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Investigation Type
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              >
                <option>Financial / Crypto Investment Fraud</option>
                <option>Ransomware / Extortion Fund Flow</option>
                <option>Phishing / Fake Exchange Impersonation</option>
                <option>Darknet Marketplace Cash-Out</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Investigation Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Initial Target Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  style={{ width: '100%', marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Blockchain
                </label>
                <select
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <option>Ethereum</option>
                  <option>Binance Smart Chain</option>
                  <option>Polygon</option>
                  <option>Tron</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>Continue to Add Evidence</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Evidence */}
        {step === 2 && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="upload-zone" style={{ padding: '24px' }}>
              <Upload size={32} color="var(--accent-blue)" style={{ margin: '0 auto 8px' }} />
              <div className="upload-label">
                Drop complaint, chats, bank statements, or wallet files here
              </div>
              <div className="upload-hint">
                Supports .TXT, .CSV, .PDF, .PNG with instant Section 65B SHA-256 seal
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                READY EVIDENCE BUNDLE (DEMO FILES SELECTED)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'complaint.txt', desc: 'Victim written report with phone & website details' },
                  { name: 'bank_statement.csv', desc: 'ICICI Bank statement showing ₹2,50,000 UPI debit' },
                  { name: 'chat.txt', desc: 'WhatsApp conversation with Telegram payment address' },
                  { name: 'wallet.txt', desc: 'Ethereum & BSC transaction ledger with bridge transfer' },
                ].map((file) => (
                  <div
                    key={file.name}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle2 size={16} color="var(--accent-green)" />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          {file.desc}
                        </div>
                      </div>
                    </div>

                    <span className="badge badge-fact">FACT</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                ← Back
              </button>
              <button
                onClick={handleStartAnalysis}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', border: 'none' }}
              >
                <Sparkles size={16} />
                <span>Analyze Evidence with AI →</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Fast AI Processing Screen */}
        {step === 3 && (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(59,130,246,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)',
              margin: '0 auto 16px',
            }}>
              <Sparkles size={24} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              ANALYZING CASE EVIDENCE
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, marginBottom: 24 }}>
              Fusing off-chain communications with on-chain transactional flows...
            </p>

            {/* Checklist */}
            <div style={{ maxWidth: 440, margin: '0 auto 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {processingSteps.map((stepText, idx) => {
                const isCompleted = idx <= currentActionIndex;
                return (
                  <div
                    key={stepText}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 12,
                      color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                      transition: 'color 0.2s'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} color="var(--accent-green)" />
                    ) : (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--border)', display: 'inline-block' }} />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div style={{ maxWidth: 440, margin: '0 auto 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 6 }}>
                <span>Extraction & Graph Fusion</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="confidence-track" style={{ height: 6 }}>
                <div className="confidence-fill" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={progressPercent < 100}
              className="btn btn-primary btn-lg"
              style={{
                opacity: progressPercent < 100 ? 0.5 : 1,
                cursor: progressPercent < 100 ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{progressPercent < 100 ? 'Processing Evidence...' : 'Enter Case Workspace →'}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
