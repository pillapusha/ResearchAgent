import { useState, useCallback } from 'react';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const HISTORY_KEY = 'smart-query-history';
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-query`;

function loadHistory(): ChatMessage[][] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSmartQuery() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastSessions, setPastSessions] = useState<ChatMessage[][]>(loadHistory);

  const saveSession = useCallback(() => {
    if (messages.length > 0) {
      const updated = [[...messages], ...pastSessions].slice(0, 50);
      setPastSessions(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    }
  }, [messages, pastSessions]);

  const clearChat = useCallback(() => {
    if (messages.length > 0) saveSession();
    setMessages([]);
    setError(null);
  }, [messages, saveSession]);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error('No response body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (!assistantSoFar) {
        upsertAssistant('I received your query but could not generate a response. Please try again.');
      }
    } catch (e: any) {
      const errMsg = e?.message || 'An error occurred';
      setError(errMsg);
      if (!assistantSoFar) {
        setMessages([...updatedMessages, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, isLoading, error, sendMessage, clearChat, pastSessions };
}
