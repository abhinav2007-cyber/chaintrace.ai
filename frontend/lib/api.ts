const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

export const api = {
  // Cases
  getCases: () => fetchApi<any[]>('/api/cases'),
  getCase: (id: string) => fetchApi<any>(`/api/cases/${id}`),
  getCaseBundle: (id: string) => fetchApi<any>(`/api/cases/${id}/bundle`),
  createCase: (data: { title: string; description: string; blockchain: string; wallet_address?: string }) =>
    fetchApi<any>('/api/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loadDemoCase: () =>
    fetchApi<{ case_id: string; loaded: boolean; message: string }>('/api/cases/demo/load', {
      method: 'POST',
    }),
  buildInvestigation: (id: string) =>
    fetchApi<any>(`/api/cases/${id}/build`, {
      method: 'POST',
    }),
  getGraph: (id: string) => fetchApi<any>(`/api/cases/${id}/graph`),
  getTimeline: (id: string) => fetchApi<any[]>(`/api/cases/${id}/timeline`),
  getReport: (id: string) => fetchApi<any>(`/api/cases/${id}/report`),
  getVaspPacket: (id: string) => fetchApi<any>(`/api/cases/${id}/vasp-packet`),

  // Evidence
  uploadEvidenceText: (caseId: string, filename: string, content: string, source: string) => {
    const formData = new FormData();
    const blob = new Blob([content], { type: 'text/plain' });
    formData.append('file', blob, filename);
    formData.append('case_id', caseId);
    formData.append('source', source);

    return fetch(`${API_BASE}/api/evidence/upload`, {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },

  // Copilot
  askCopilot: (caseId: string, message: string, history: Array<{ role: string; content: string }> = []) =>
    fetchApi<any>('/api/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, message, conversation_history: history }),
    }),

  // Campaigns
  getCampaigns: () => fetchApi<any>('/api/campaigns'),
};
