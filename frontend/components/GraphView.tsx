'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Filter, Info, ShieldCheck, ArrowRight, CornerDownRight } from 'lucide-react';

interface GraphViewProps {
  onSelectNode: (node: any) => void;
  selectedNodeId?: string | null;
}

export function GraphView({ onSelectNode, selectedNodeId }: GraphViewProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'onchain' | 'offchain'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Nodes in our unified fusion graph
  const nodes = [
    // Off-chain evidence nodes
    {
      id: 'phone-1',
      label: '+91 98765 43210',
      type: 'phone',
      category: 'offchain',
      factType: 'FACT',
      evidenceId: 'E-001',
      subtitle: 'WhatsApp Scam Contact',
      x: 60,
      y: 70,
    },
    {
      id: 'website-1',
      label: 'fastgains-trading.com',
      type: 'domain',
      category: 'offchain',
      factType: 'FACT',
      evidenceId: 'E-001',
      subtitle: 'Fraudulent Investment Web',
      x: 60,
      y: 190,
    },
    {
      id: 'chat-1',
      label: 'Chat Session #492',
      type: 'chat',
      category: 'offchain',
      factType: 'FACT',
      evidenceId: 'E-003',
      subtitle: 'Victim inducement dialogue',
      x: 60,
      y: 310,
    },

    // Victim & Banking
    {
      id: 'victim-1',
      label: 'Victim Account',
      type: 'victim',
      category: 'banking',
      factType: 'FACT',
      evidenceId: 'E-001',
      subtitle: 'ICICI Bank Acct',
      x: 320,
      y: 60,
    },
    {
      id: 'bank-pay-1',
      label: 'UPI: ₹2,50,000',
      type: 'bank_payment',
      category: 'banking',
      factType: 'FACT',
      evidenceId: 'E-002',
      subtitle: 'UTR: 629104882910 (10:31 AM)',
      x: 320,
      y: 180,
    },

    // Blockchain Fund Flow Chain
    {
      id: 'wallet-a',
      label: 'Wallet A',
      type: 'wallet',
      category: 'onchain',
      factType: 'INFERENCE',
      address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      evidenceId: 'E-005',
      subtitle: 'First Hop • Ethereum (10:38 AM)',
      x: 320,
      y: 310,
    },
    {
      id: 'wallet-b',
      label: 'Wallet B',
      type: 'wallet',
      category: 'onchain',
      factType: 'FACT',
      address: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
      evidenceId: 'E-006',
      subtitle: 'Intermediary Wallet (10:45 AM)',
      x: 320,
      y: 440,
    },
    {
      id: 'bridge-1',
      label: 'Bridge Contract',
      type: 'bridge',
      category: 'onchain',
      factType: 'FACT',
      address: '0x3849...b8c2 (Ethereum ↔ BSC)',
      evidenceId: 'E-007',
      subtitle: 'Cross-Chain Transfer (11:02 AM)',
      x: 580,
      y: 440,
    },
    {
      id: 'wallet-c',
      label: 'Wallet C',
      type: 'wallet',
      category: 'onchain',
      factType: 'FACT',
      address: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
      evidenceId: 'E-008',
      subtitle: 'BSC Destination Wallet (11:19 AM)',
      x: 580,
      y: 310,
    },
    {
      id: 'vasp-1',
      label: 'VASP-X (Candidate)',
      type: 'vasp',
      category: 'vasp',
      factType: 'INFERENCE',
      confidence: 92,
      evidenceId: 'E-011',
      subtitle: 'Candidate Attribution: 92%',
      x: 580,
      y: 150,
    },
  ];

  const filteredNodes = nodes.filter((n) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'onchain') return n.category === 'onchain' || n.category === 'vasp';
    if (filterMode === 'offchain') return n.category === 'offchain' || n.category === 'banking';
    return true;
  });

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'victim': return '#38bdf8';
      case 'bank_payment': return '#10b981';
      case 'wallet': return '#818cf8';
      case 'bridge': return '#f59e0b';
      case 'vasp': return '#ef4444';
      case 'phone': return '#06b6d4';
      case 'domain': return '#ec4899';
      case 'chat': return '#8b5cf6';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px 8px 0 0',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            FUSION GRAPH
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setFilterMode('all')}
              className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              All Entities (Unified)
            </button>
            <button
              onClick={() => setFilterMode('onchain')}
              className={`btn btn-sm ${filterMode === 'onchain' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              On-Chain Fund Flow
            </button>
            <button
              onClick={() => setFilterMode('offchain')}
              className={`btn btn-sm ${filterMode === 'offchain' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              Off-Chain Evidence
            </button>
          </div>
        </div>

        {/* Legend & Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)' }}></span> Fact
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)' }}></span> Inference
            </span>
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px' }}
              title="Reset View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div style={{
        width: '100%',
        height: 560,
        background: 'radial-gradient(ellipse at 50% 50%, #0d1528 0%, #080d1a 100%)',
        border: '1px solid var(--border)',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        position: 'relative',
        overflow: 'auto',
      }}>
        <svg
          width="860"
          height="540"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            transition: 'transform 0.15s ease',
            display: 'block',
          }}
        >
          <defs>
            {/* Arrowhead marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b5cf6" />
            </marker>
            <marker id="arrow-dashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* BACKGROUND GRID */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* FLOW EDGES */}
          {/* Victim -> Bank */}
          <line x1="420" y1="100" x2="420" y2="175" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
          {/* Bank -> Wallet A (Temporal correlation link) */}
          <line x1="420" y1="225" x2="420" y2="305" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="5,4" markerEnd="url(#arrow-purple)" />
          <text x="428" y="270" fill="#a78bfa" fontSize="10" fontFamily="var(--font-mono)">
            Δ 7m 29s (₹2,50k)
          </text>

          {/* Wallet A -> Wallet B */}
          <line x1="420" y1="355" x2="420" y2="435" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="428" y="400" fill="#93c5fd" fontSize="10" fontFamily="var(--font-mono)">
            Hop 1
          </text>

          {/* Wallet B -> Bridge */}
          <line x1="510" y1="465" x2="575" y2="465" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="525" y="455" fill="#fcd34d" fontSize="10" fontFamily="var(--font-mono)">
            Bridge
          </text>

          {/* Bridge -> Wallet C */}
          <line x1="680" y1="435" x2="680" y2="355" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="688" y="400" fill="#93c5fd" fontSize="10" fontFamily="var(--font-mono)">
            BSC Hop
          </text>

          {/* Wallet C -> VASP-X */}
          <line x1="680" y1="305" x2="680" y2="195" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4,4" markerEnd="url(#arrow)" />
          <text x="688" y="250" fill="#f87171" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold">
            92% Candidate
          </text>

          {/* Off-chain Evidence Linkages to Wallet A */}
          <path d="M 210 90 C 260 90, 270 330, 315 330" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrow-dashed)" />
          <path d="M 210 210 C 260 210, 270 330, 315 330" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrow-dashed)" />
          <path d="M 210 330 C 260 330, 280 330, 315 330" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrow-dashed)" />

          {/* Off-chain cluster banner label */}
          <text x="60" y="40" fill="var(--text-muted)" fontSize="11" fontWeight="bold" letterSpacing="1">
            OFF-CHAIN EVIDENCE CLUSTER
          </text>
          <text x="320" y="40" fill="var(--text-muted)" fontSize="11" fontWeight="bold" letterSpacing="1">
            PRIMARY INVESTIGATION PATH
          </text>
          <text x="580" y="40" fill="var(--text-muted)" fontSize="11" fontWeight="bold" letterSpacing="1">
            CROSS-CHAIN & VASP CLUSTER
          </text>

          {/* NODES */}
          {filteredNodes.map((n) => {
            const isSelected = selectedNodeId === n.id;
            const nodeColor = getNodeColor(n.type);

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onClick={() => onSelectNode(n)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Box */}
                <rect
                  width="180"
                  height="50"
                  rx="8"
                  fill="#0f1a30"
                  stroke={isSelected ? '#ffffff' : nodeColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 10px rgba(59,130,246,0.6))' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />

                {/* Left color bar */}
                <rect
                  width="6"
                  height="50"
                  rx="3"
                  fill={nodeColor}
                />

                {/* Type & Fact Badge */}
                <text x="14" y="16" fill={nodeColor} fontSize="9" fontWeight="bold" letterSpacing="0.5">
                  {n.type.toUpperCase()} • {n.factType}
                </text>

                {/* Node Label */}
                <text x="14" y="32" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
                  {n.label.length > 20 ? `${n.label.substring(0, 18)}...` : n.label}
                </text>

                {/* Subtitle */}
                <text x="14" y="44" fill="#64748b" fontSize="9">
                  {n.subtitle}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating helper hint */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          background: 'rgba(8,13,26,0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 11,
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <Info size={13} color="var(--accent-blue)" />
          <span>Click any node to view forensic details and explainability (Why this connection?).</span>
        </div>
      </div>
    </div>
  );
}
