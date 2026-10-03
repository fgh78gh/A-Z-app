import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const FinancialAssistantView: React.FC = () => {
  const {
    assistantMessages,
    sendAssistantMessage,
    isAssistantThinking,
    user,
    formatCurrency,
    totalNetWorth,
    currentSavingsRate,
    emergencyFund,
  } = useFinance();

  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages, isAssistantThinking]);

  const promptChips = [
    'How can I save an extra $400 this month?',
    'Analyze my subscription waste',
    'Should I pay off debt or invest in 401(k)?',
    'Simulate buying a $1,200 laptop right now',
    'What is my emergency fund health?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isAssistantThinking) return;
    sendAssistantMessage(text.trim());
    setInputPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Banner Context Pill */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>SmartMoney AI Wealth Architect</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini Reasoning Online
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Live context: Net Worth {formatCurrency(totalNetWorth)} · Savings Rate {currentSavingsRate}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Runway: {(emergencyFund.currentBalance / emergencyFund.monthlyEssentialBurn).toFixed(1)} mo</span>
          <span>·</span>
          <span>Net Inflow: {formatCurrency(user.monthlyNetSalary)}/mo</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        {assistantMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-emerald-500 text-slate-950 font-bold text-xs'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-slate-100 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Simple Markdown-like line rendering */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return (
                        <div key={idx} className="font-bold text-sm text-white pt-1">
                          {line.replace('### ', '')}
                        </div>
                      );
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return (
                        <div key={idx} className="pl-2 border-l border-emerald-500/40 text-slate-200">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={idx} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-400">
                          {line.replace('- ', '')}
                        </div>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                <div className="text-[10px] text-slate-500 font-mono mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isAssistantThinking && (
          <div className="flex items-center gap-3 text-xs text-indigo-400 p-2 font-mono">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Analyzing capital flow models & calculating optimal rebalancing...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {promptChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask your financial assistant anything (e.g. simulate a purchase, plan a savings target)..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAssistantThinking}
          className="w-full px-3 py-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isAssistantThinking}
          className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-lg transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
