// Calls a locally running Ollama instance (default http://localhost:11434).
// Requires: `ollama serve` running, and a model pulled e.g. `ollama pull llama3.1:8b`.

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

async function chatCompletion({ systemPrompt, messages }) {
  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: ollamaMessages,
      stream: false,
      options: { temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data?.message?.content?.trim() || '';
}

module.exports = { chatCompletion };
