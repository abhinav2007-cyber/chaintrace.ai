'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Stepper } from '../components/Stepper';
import { DashboardView } from '../components/DashboardView';
import { CaseOverviewView } from '../components/CaseOverviewView';
import { EvidenceView } from '../components/EvidenceView';
import { EvidenceDrawer } from '../components/EvidenceDrawer';
import { AnalysisView } from '../components/AnalysisView';
import { NodeInvestigationPanel } from '../components/NodeInvestigationPanel';
import { WhyPanel } from '../components/WhyPanel';
import { FindingsView } from '../components/FindingsView';
import { GapDrawer } from '../components/GapDrawer';
import { ActionsView } from '../components/ActionsView';
import { VaspPacketModal } from '../components/VaspPacketModal';
import { ReportModal } from '../components/ReportModal';
import { CopilotDrawer } from '../components/CopilotDrawer';
import { NewCaseWizard } from '../components/NewCaseWizard';
import { MobileNav } from '../components/MobileNav';
import { CasesListView } from '../components/CasesListView';
import { ReportsListView } from '../components/ReportsListView';
import { api } from '../lib/api';

export default function Home() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeCaseId, setActiveCaseId] = useState<string | null>('CYBER-2026-0847');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'graph' | 'timeline' | 'correlations' | 'campaign'>('graph');

  // Data state
  const [cases, setCases] = useState<any[]>([]);
  const [bundle, setBundle] = useState<any>(null);
  const [loadingDemo, setLoadingDemo] = useState<boolean>(false);
  const [loadingBundle, setLoadingBundle] = useState<boolean>(false);

  // Drawers & Modals state
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<any | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [whyPanelOpen, setWhyPanelOpen] = useState<boolean>(false);
  const [selectedGap, setSelectedGap] = useState<any | null>(null);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [newCaseWizardOpen, setNewCaseWizardOpen] = useState<boolean>(false);
  const [vaspPacketModalOpen, setVaspPacketModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Load cases list & demo case on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const fetchedCases = await api.getCases();
      if (fetchedCases && fetchedCases.length > 0) {
        setCases(fetchedCases);
        if (activeCaseId) {
          loadCaseBundle(activeCaseId);
        }
      } else {
        // Auto load demo dataset if DB is fresh
        handleLoadDemo();
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      // Fallback demo load
      handleLoadDemo();
    }
  };

  const loadCaseBundle = async (caseId: string) => {
    setLoadingBundle(true);
    try {
      const b = await api.getCaseBundle(caseId);
      setBundle(b);
      setActiveCaseId(caseId);
    } catch (err) {
      console.error('Error loading bundle:', err);
    } finally {
      setLoadingBundle(false);
    }
  };

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      const res = await api.loadDemoCase();
      const demoId = res.case_id || 'CYBER-2026-0847';
      setActiveCaseId(demoId);
      const fetchedCases = await api.getCases();
      setCases(fetchedCases);
      await loadCaseBundle(demoId);
    } catch (err) {
      console.error('Error loading demo:', err);
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    loadCaseBundle(caseId);
    setCurrentView('case_overview');
  };

  const handleEvidenceClickFromAnywhere = (evidenceId: string) => {
    const found = bundle?.evidence?.find((e: any) => e.evidence_id === evidenceId);
    if (found) {
      setSelectedEvidenceItem(found);
    } else {
      setSelectedEvidenceItem({
        evidence_id: evidenceId,
        filename: `${evidenceId.toLowerCase()}_source.txt`,
        sha256_hash: '8a91c5e2f3d4b6a7c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        source_type: 'Digital Custody Vault',
      });
    }
  };

  const isCaseSubStage = ['evidence', 'analysis', 'findings', 'actions', 'case_overview'].includes(currentView);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeCaseId={activeCaseId}
        activeCaseTitle={bundle?.case?.title}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header Bar */}
        <Header
          currentView={currentView}
          activeCaseId={activeCaseId}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCopilot={() => setCopilotOpen(true)}
        />

        <div className="page-container">
          {/* Horizontal Investigation Stepper inside active cases */}
          {isCaseSubStage && activeCaseId && currentView !== 'case_overview' && (
            <Stepper
              currentStage={currentView}
              onSelectStage={(stage) => setCurrentView(stage)}
              stats={{
                evidenceCount: bundle?.evidence?.length,
                entitiesCount: bundle?.entities?.length,
                gapsCount: bundle?.gaps?.length,
                vaspCount: bundle?.vasp?.length,
              }}
            />
          )}

          {/* VIEW SWITCHER */}
          {currentView === 'dashboard' && (
            <DashboardView
              cases={cases}
              onOpenCase={handleOpenCase}
              onNewCase={() => setNewCaseWizardOpen(true)}
              onLoadDemo={handleLoadDemo}
              loadingDemo={loadingDemo}
            />
          )}

          {currentView === 'cases_list' && (
            <CasesListView
              cases={cases}
              onOpenCase={handleOpenCase}
              onNewCase={() => setNewCaseWizardOpen(true)}
            />
          )}

          {currentView === 'case_overview' && (
            <CaseOverviewView
              bundle={bundle}
              onBackToCases={() => setCurrentView('dashboard')}
              onNavigateStage={(stage) => setCurrentView(stage)}
              onSelectAnalysisTab={(tab) => {
                setActiveAnalysisTab(tab as any);
                setCurrentView('analysis');
              }}
              onOpenCopilot={() => setCopilotOpen(true)}
            />
          )}

          {currentView === 'evidence' && (
            <EvidenceView
              evidenceList={bundle?.evidence || []}
              entitiesList={bundle?.entities || []}
              onSelectEvidence={(item) => setSelectedEvidenceItem(item)}
              onAddEvidenceClick={() => setNewCaseWizardOpen(true)}
            />
          )}

          {currentView === 'analysis' && (
            <AnalysisView
              activeTab={activeAnalysisTab}
              onTabChange={(tab) => setActiveAnalysisTab(tab)}
              onSelectNode={(node) => setSelectedNode(node)}
              selectedNodeId={selectedNode?.id}
              onOpenWhy={() => setWhyPanelOpen(true)}
              onViewEvidence={handleEvidenceClickFromAnywhere}
              timelineEvents={bundle?.timeline || []}
              correlations={bundle?.correlations || []}
            />
          )}

          {currentView === 'findings' && (
            <FindingsView
              risks={bundle?.risks || []}
              vasp={bundle?.vasp || []}
              gaps={bundle?.gaps || []}
              onOpenWhy={() => setWhyPanelOpen(true)}
              onSelectGap={(gap) => setSelectedGap(gap)}
            />
          )}

          {currentView === 'actions' && (
            <ActionsView
              caseId={activeCaseId || 'CYBER-2026-0847'}
              bundle={bundle}
              onOpenReportModal={() => setReportModalOpen(true)}
              onOpenVaspPacketModal={() => setVaspPacketModalOpen(true)}
            />
          )}

          {currentView === 'campaigns' && (
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
              <AnalysisView
                activeTab="campaign"
                onTabChange={() => {}}
                onSelectNode={() => {}}
                onOpenWhy={() => {}}
                onViewEvidence={handleEvidenceClickFromAnywhere}
                timelineEvents={[]}
                correlations={[]}
              />
            </div>
          )}

          {currentView === 'reports' && (
            <ReportsListView
              cases={cases}
              onOpenReport={(cId) => {
                setActiveCaseId(cId);
                loadCaseBundle(cId);
                setReportModalOpen(true);
              }}
            />
          )}
        </div>

        {/* Global Footer Disclaimer */}
        <footer className="disclaimer">
          <strong>iQOO Hackathon 2026 Submission:</strong> All blockchain records, VASP attribution candidates, and phone/chat data shown are synthetic prototypes generated for forensic demonstration. AI outputs provide probabilistic investigative assistance and require human procedural verification under Section 65B of the Indian Evidence Act.
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentStage={currentView}
        onSelectStage={(stage) => setCurrentView(stage)}
        activeCaseId={activeCaseId}
      />

      {/* DRAWERS & MODALS */}
      {/* Evidence Drawer */}
      <EvidenceDrawer
        evidence={selectedEvidenceItem}
        entities={bundle?.entities || []}
        onClose={() => setSelectedEvidenceItem(null)}
      />

      {/* Graph Node Investigation Panel */}
      <NodeInvestigationPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onOpenWhy={() => setWhyPanelOpen(true)}
        onViewEvidence={handleEvidenceClickFromAnywhere}
      />

      {/* Explainable AI "Why?" Panel */}
      <WhyPanel
        isOpen={whyPanelOpen}
        onClose={() => setWhyPanelOpen(false)}
        sourceNode={selectedNode?.label || 'Wallet C'}
        targetNode="VASP-X"
        onViewEvidence={handleEvidenceClickFromAnywhere}
      />

      {/* Actionable Gap Inspector Drawer */}
      <GapDrawer
        gap={selectedGap}
        onClose={() => setSelectedGap(null)}
        onNavigateToEvidence={() => setCurrentView('evidence')}
      />

      {/* Floating AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        caseId={activeCaseId || 'CYBER-2026-0847'}
        onViewEvidence={handleEvidenceClickFromAnywhere}
      />

      {/* New Case Guided Wizard Modal */}
      <NewCaseWizard
        isOpen={newCaseWizardOpen}
        onClose={() => setNewCaseWizardOpen(false)}
        onCaseCreated={(newId) => {
          setActiveCaseId(newId);
          loadCaseBundle(newId);
          setCurrentView('case_overview');
        }}
      />

      {/* VASP Request Packet Modal */}
      <VaspPacketModal
        isOpen={vaspPacketModalOpen}
        onClose={() => setVaspPacketModalOpen(false)}
        caseId={activeCaseId || 'CYBER-2026-0847'}
        vaspPacket={bundle?.vasp?.[0]}
      />

      {/* Full Forensic Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        caseId={activeCaseId || 'CYBER-2026-0847'}
        bundle={bundle}
      />
    </div>
  );
}
