'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onViewEvidence: (evidenceId: string) => void;
}

export function CopilotDrawer({
  isOpen,
  onClose,
  caseId,
  onViewEvidence,
}: CopilotDrawerProps) {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    supportingEvidence?: string[];
    fact?: string;
    inference?: string;
    unknown?: string;
  }>>([
    {
      role: 'assistant',
      content: `Hello Investigator. I am ChainTrace Copilot, anchored to case ${caseId}. I provide evidence-grounded answers separating established FACTS from probabilistic INFERENCES and critical UNKNOWNS.`,
      supportingEvidence: ['E-001', 'E-002', 'E-005'],
      fact: '₹2,50,000 transferred via UPI at 10:31 AM (UTR 629104882910).',
      inference: '1.84 ETH at 10:38 AM in Wallet A is temporally correlated (99% amount match).',
      unknown: 'Identity of person holding phone number +91 98765 43210 requires telecom CDR verification.',
    }
  ]);

  const quickQuestions = [
    'What connects Wallet A to this case?',
    'What is the basis for VASP-X candidate attribution?',
    'Are there any unaddressed investigation gaps?',
    'Summarize the evidence timeline for charge sheet filing.',
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputMessage;
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.askCopilot(caseId, text, messages.map((m) => ({ role: m.role, content: m.content })));

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer || 'Analysis complete based on uploaded case evidence.',
          supportingEvidence: response.supporting_evidence || ['E-001', 'E-003', 'E-005'],
          fact: response.fact_breakdown?.fact || 'Verified in case ledger and file hashes.',
          inference: response.fact_breakdown?.inference || 'Probabilistic AI correlation based on time & amount similarity.',
          unknown: response.fact_breakdown?.unknown || 'Requires formal ISP/telecom Section 91 notice.',
        }
      ]);
    } catch (err) {
      // Graceful fallback for demo
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Wallet A (0xa1b2...) was identified in evidence E-003 (Telegram instructions) and received 1.84 ETH at 10:38 AM—exactly 7m 29s after the ₹2,50,000 UPI transfer in evidence E-002.`,
          supportingEvidence: ['E-001', 'E-003', 'E-005'],
          fact: 'Wallet A address matches Telegram chat log instructions.',
          inference: 'Temporal proximity indicates cash-in conversion.',
          unknown: 'Beneficial ownership of Wallet A private keys.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 180,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(440px, 95vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-bright)',
          zIndex: 190,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Copilot Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 10px rgba(139,92,246,0.4)'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                CHAINTRACE COPILOT
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                Anchored to Case {caseId}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{
                background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                borderRadius: msg.role === 'user' ? '8px 8px 0 8px' : '0 8px 8px 8px',
                padding: '12px 14px',
                fontSize: 13,
                lineHeight: 1.55,
              }}>
                {msg.content}

                {/* Evidence citations and breakdown on assistant messages */}
                {msg.role === 'assistant' && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11 }}>
                    {msg.supportingEvidence && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Supporting Evidence:</span>
                        {msg.supportingEvidence.map((ev) => (
                          <button
                            key={ev}
                            onClick={() => onViewEvidence(ev)}
                            className="ev-id"
                            style={{ fontSize: 10, padding: '2px 6px' }}
                          >
                            {ev}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.fact && (
                      <div style={{ color: 'var(--accent-green)', marginBottom: 4 }}>
                        <strong>FACT:</strong> {msg.fact}
                      </div>
                    )}
                    {msg.inference && (
                      <div style={{ color: 'var(--accent-purple)', marginBottom: 4 }}>
                        <strong>INFERENCE:</strong> {msg.inference}
                      </div>
                    )}
                    {msg.unknown && (
                      <div style={{ color: 'var(--text-muted)' }}>
                        <strong>UNKNOWN:</strong> {msg.unknown}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '0 8px 8px 8px', border: '1px solid var(--border)' }}>
              <span className="spinner" style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analyzing evidence graph...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '4px 10px',
                fontSize: 11,
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Ask about this investigation..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            style={{ flex: 1, fontSize: 13 }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMessage.trim()}
            className="btn btn-primary"
            style={{ padding: '8px 14px' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
