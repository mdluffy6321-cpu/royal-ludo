import React from 'react';
import { ShieldCheck, BookOpen, Sparkles, HelpCircle, Mail, MessageSquare } from 'lucide-react';

export const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Codex of Royal Ludo</span>
        </div>
        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
          Rules, Fair Play & Compliance
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Everything you need to know about official battle rules, fair play integrity, and platform policies.
        </p>
      </div>

      {/* 1. Official Ludo Rules */}
      <div className="rounded-3xl glass-panel p-6 border border-royal-border/80 shadow-card-glow">
        <h2 className="font-royal text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-royal-gold">📜</span>
          <span>Official Royal Ludo Tournament Rules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-royal-gold">1. Releasing From Base</h3>
            <p>A player must roll a <strong>6</strong> on their turn to release a token from the yard base into the starting cell.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-emerald-400">2. Safe Star Cells (8 Cells)</h3>
            <p>The 4 starting colored cells and the 4 star-marked cells along the track are completely safe. Tokens on these cells cannot be captured.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-red-400">3. Token Capture & Bonus Rolls</h3>
            <p>Landing on an opponent token on any non-safe cell captures it, sending it back to their yard, and awards you an immediate <strong>Bonus Roll</strong>!</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-amber-400">4. Exact Roll Required for Home</h3>
            <p>Tokens in the home column must roll the exact number required to enter the final center Home slot (step 57). Overshooting is invalid.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-purple-400">5. Three Consecutive Sixes Penalty</h3>
            <p>Rolling three 6s in a row incurs a penalty: the third roll is forfeited and turn automatically passes to the next player.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white mb-1 text-sm text-blue-400">6. Turn Timers (15 Seconds)</h3>
            <p>Each turn has a strict 15-second countdown. If time expires, the smart auto-play bot takes over to ensure smooth game flow.</p>
          </div>
        </div>
      </div>

      {/* 2. Responsible Gaming & Legal Compliance */}
      <div className="rounded-3xl glass-panel-gold p-6 border border-royal-gold/40 shadow-card-glow">
        <h2 className="font-royal text-lg font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Non-Monetary Demonstration & Fair Play</span>
        </h2>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            Royal Ludo is a pure skill-based online multiplayer platform created strictly for entertainment, strategic demonstration, and social gameplay.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>No Real-Money Wagering:</strong> All coins used on this platform are non-purchasable virtual demonstration coins.</li>
            <li><strong>No Cash Withdrawals:</strong> Virtual coins have zero fiat currency value and cannot be redeemed, traded, or converted into real money.</li>
            <li><strong>Authoritative Security:</strong> Dice rolls and token movements are authoritatively verified by the server. Clients cannot alter game outcomes.</li>
          </ul>
        </div>
      </div>

      {/* 3. Support & Contact */}
      <div className="rounded-3xl glass-panel p-6 border border-royal-border/80 text-center">
        <h2 className="font-royal text-lg font-bold text-white mb-1">
          24/7 Noble Assistance
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          Encountered a bug or have a suggestion? Our royal support team is always standing by.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:support@royalludo.arena"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 border border-slate-700"
          >
            <Mail className="w-4 h-4 text-royal-gold" />
            <span>support@royalludo.arena</span>
          </a>
          <button
            onClick={() => alert('Support ticket system initialized. Our team will contact you!')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

    </div>
  );
};

