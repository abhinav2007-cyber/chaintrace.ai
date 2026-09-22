'use client';

import React from 'react';
import { GitFork, Clock, ArrowUpDown, Network } from 'lucide-react';
import { GraphView } from './GraphView';
import { TimelineView } from './TimelineView';
import { CorrelationsView } from './CorrelationsView';
import { CampaignView } from './CampaignView';

interface AnalysisViewProps {
  activeTab: 'graph' | 'timeline' | 'correlations' | 'campaign';
  onTabChange: (tab: 'graph' | 'timeline' | 'correlations' | 'campaign') => void;
  onSelectNode: (node: any) => void;
  selectedNodeId?: string | null;
  onOpenWhy: () => void;
  onViewEvidence: (evidenceId: string) => void;
  timelineEvents: any[];
  correlations: any[];
}

export function AnalysisView({
  activeTab,
  onTabChange,
  onSelectNode,
  selectedNodeId,
  onOpenWhy,
  onViewEvidence,
  timelineEvents,
  correlations,
}: AnalysisViewProps) {
  const tabs = [
    { id: 'graph', label: 'GRAPH', icon: GitFork, desc: 'Visual fund flow & evidence fusion' },
    { id: 'timeline', label: 'TIMELINE', icon: Clock, desc: 'Chronological event stream' },
    { id: 'correlations', label: 'CORRELATIONS', icon: ArrowUpDown, desc: 'Bank to crypto temporal linkage' },
    { id: 'campaign', label: 'CAMPAIGN', icon: Network, desc: 'Shared cross-case infrastructure' },
  ];

  return (
    <div>
      {/* 4 Analysis Mode Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        paddingBottom: 16,
        marginBottom: 20,
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render selected analysis tab */}
      {activeTab === 'graph' && (
        <GraphView
          onSelectNode={onSelectNode}
          selectedNodeId={selectedNodeId}
        />
      )}

      {activeTab === 'timeline' && (
        <TimelineView
          timelineEvents={timelineEvents}
          onSelectEvidence={onViewEvidence}
        />
      )}

      {activeTab === 'correlations' && (
        <CorrelationsView
          correlations={correlations}
          onOpenWhy={onOpenWhy}
          onViewEvidence={onViewEvidence}
        />
      )}

      {activeTab === 'campaign' && (
        <CampaignView />
      )}
    </div>
  );
}
