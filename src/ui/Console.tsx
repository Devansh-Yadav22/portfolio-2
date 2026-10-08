import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../scene/audio';
import { projects } from '../content/projects';
import { links } from '../content/links';

interface ConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export function Console({ isOpen, onClose, onNavigate }: ConsoleProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<LogEntry[]>([
    {
      type: 'system',
      text: 'Console initialized. Type "help" for a list of available commands.',
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Append to cmd history
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    const newLogs: LogEntry[] = [{ type: 'input', text: `$ ${cmd}` }];

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newLogs.push({
        type: 'output',
        text: `Available commands:
  help              - Show this help menu
  about             - Navigate to background & identity
  projects          - List all engineered projects
  projects --honey  - Fly camera to flagship Honey Chain
  skills            - Summary of technical capabilities
  contact           - Display communication channels
  hash              - Compute real SHA-256 of "Devansh Yadav" via Web Crypto
  sound on|off      - Toggle ambient pentatonic hex resonance
  clear             - Clear console history
  exit              - Close console`,
      });
    } else if (lower === 'about') {
      newLogs.push({
        type: 'output',
        text: 'Navigating to About section: B.Tech CSE student (2024–present), full-stack developer & blockchain builder.',
      });
      onNavigate('about');
      onClose();
    } else if (lower === 'projects') {
      const summaryList = projects
        .map((p) => `  * ${p.title} (${p.year}) - ${p.subtitle}`)
        .join('\n');
      newLogs.push({
        type: 'output',
        text: `Engineered Projects:\n${summaryList}\n\nTip: Use "projects --honey" to fly to the flagship.`,
      });
      onNavigate('work');
    } else if (lower === 'projects --honey') {
      newLogs.push({
        type: 'output',
        text: 'Targeting flagship region: Honey Chain (Hyperledger Fabric 2.5.x)...',
      });
      onNavigate('project-honey-chain');
      onClose();
    } else if (lower === 'skills') {
      newLogs.push({
        type: 'output',
        text: `Core Technical Stacks:
  Languages : Java, JavaScript, TypeScript, Python, SQL, HTML, CSS
  Frontend  : React, Next.js, Vite, Tailwind CSS
  Backend   : Node.js, Express.js, Spring Boot, JDBC
  Blockchain: Hyperledger Fabric 2.5.x, Fabric CA, Docker
  AI / Data : Machine Learning, LDA, NLP, Gemini API`,
      });
      onNavigate('skills');
    } else if (lower === 'contact') {
      const entries: string[] = [];
      if (links.email) entries.push(`  Email: ${links.email}`);
      if (links.github) entries.push(`  GitHub: ${links.github}`);
      if (links.linkedin) entries.push(`  LinkedIn: ${links.linkedin}`);
      if (links.instagram) entries.push(`  Instagram: ${links.instagram}`);
      newLogs.push({
        type: 'output',
        text: entries.length > 0 ? entries.join('\n') : 'Available for engineering roles and collaboration. See footer for channels.',
      });
      onNavigate('closing');
    } else if (lower === 'hash') {
      try {
        const msgUint8 = new TextEncoder().encode('Devansh Yadav');
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        newLogs.push({
          type: 'output',
          text: `SHA-256("Devansh Yadav"):
${hashHex}

Ledger Note: The hex lattice in this portfolio is an interactive nod to an immutable ledger block structure.`,
        });
      } catch {
        newLogs.push({
          type: 'error',
          text: 'SubtleCrypto unavailable in current browser environment.',
        });
      }
    } else if (lower === 'sound on') {
      audioManager.setSound(true);
      newLogs.push({
        type: 'output',
        text: 'Ambient pentatonic synthesis enabled. Hover active hexes to hear resonance.',
      });
    } else if (lower === 'sound off') {
      audioManager.setSound(false);
      newLogs.push({
        type: 'output',
        text: 'Ambient synthesis disabled.',
      });
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'exit') {
      onClose();
      return;
    } else {
      newLogs.push({
        type: 'error',
        text: `Unknown command "${cmd}". Type "help" to see available commands.`,
      });
    }

    setHistory((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command console"
    >
      <div className="relative w-full max-w-2xl bg-ink-2 border border-line p-6 font-mono text-xs sm:text-sm text-bone shadow-2xl panel-card">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4 text-mute">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-honey" />
            <span className="text-bone">devansh@lattice: ~</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-honey text-mute focus-visible:outline-honey px-1"
            aria-label="Close console"
          >
            [ ESC ]
          </button>
        </div>

        {/* Output Area */}
        <div className="h-72 overflow-y-auto space-y-2.5 pr-2">
          {history.map((log, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap leading-relaxed ${
                log.type === 'input'
                  ? 'text-honey font-medium'
                  : log.type === 'error'
                  ? 'text-[#E06C75]'
                  : log.type === 'system'
                  ? 'text-mute italic'
                  : 'text-bone/90'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
          <span className="text-honey font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="console-input flex-1 bg-transparent border-none outline-none text-bone font-mono text-xs sm:text-sm"
            placeholder="Type a command (try 'help' or 'hash')..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
