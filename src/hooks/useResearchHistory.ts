import { useState, useCallback, useEffect } from 'react';
import type { AgentStep } from '@/lib/research-agents';

export interface ResearchEntry {
  id: string;
  topic: string;
  steps: AgentStep[];
  completedAt: string;
}

const STORAGE_KEY = 'research-history';

function loadHistory(): ResearchEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useResearchHistory() {
  const [history, setHistory] = useState<ResearchEntry[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const saveEntry = useCallback((topic: string, steps: AgentStep[]) => {
    const entry: ResearchEntry = {
      id: crypto.randomUUID(),
      topic,
      steps,
      completedAt: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, saveEntry, deleteEntry, clearHistory };
}
