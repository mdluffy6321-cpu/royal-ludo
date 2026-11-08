import React from 'react';
import { ShieldCheck, BookOpen, Sparkles, HelpCircle, Mail, MessageSquare } from 'lucide-react';

export const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Codex</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
          Rules, Fair Play & Compliance
        </h1>
        <p className="text-xs text-[#6E6962] mt-0.5">
          Everything you need to know about official battle rules, fair play integrity, and platform policies.
        </p>
      </div>

      {/* 1. Official Ludo Rules */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 sm:p-8">
        <h2 className="text-lg font-black text-[#000000] mb-4 flex items-center gap-2">
          <span>Official Tournament Rules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6E6962]">
          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">1. Releasing From Base</h3>
            <p>A player must roll a <strong>6</strong> on their turn to release a token from the yard base into the starting cell.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">2. Safe Star Cells (8 Cells)</h3>
            <p>The 4 starting colored cells and the 4 star-marked cells along the track are completely safe. Tokens on these cells cannot be captured.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">3. Token Capture & Bonus Rolls</h3>
            <p>Landing on an opponent token on any non-safe cell captures it, sending it back to their yard, and awards you an immediate <strong>Bonus Roll</strong>!</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">4. Exact Roll Required for Home</h3>
            <p>Tokens in the home column must roll the exact number required to enter the final center Home slot (step 57). Overshooting is invalid.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">5. Three Consecutive Sixes Penalty</h3>
            <p>Rolling three 6s in a row incurs a penalty: the third roll is forfeited and turn automatically passes to the next player.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB]">
            <h3 className="font-bold text-[#000000] mb-1 text-sm">6. Turn Timers (15 Seconds)</h3>
            <p>Each turn has a strict 15-second countdown. If time expires, the smart auto-play bot takes over to ensure smooth game flow.</p>
          </div>
        </div>
      </div>

      {/* 2. Responsible Gaming & Legal Compliance */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 sm:p-8">
        <h2 className="text-lg font-black text-[#000000] mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Non-Monetary Demonstration & Fair Play</span>
        </h2>
        <div className="text-xs text-[#6E6962] space-y-2 leading-relaxed">
          <p>
            Royal Ludo is a pure skill-based online multiplayer platform created strictly for entertainment, strategic demonstration, and social gameplay.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#6E6962]">
            <li><strong>No Real-Money Wagering:</strong> All coins used on this platform are non-purchasable virtual demonstration coins.</li>
            <li><strong>No Cash Withdrawals:</strong> Virtual coins have zero fiat currency value and cannot be redeemed, traded, or converted into real money.</li>
            <li><strong>Authoritative Security:</strong> Dice rolls and token movements are authoritatively verified by the server. Clients cannot alter game outcomes.</li>
          </ul>
        </div>
      </div>

      {/* 3. Support & Contact */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 sm:p-8 text-center">
        <h2 className="text-lg font-black text-[#000000] mb-1">
          Player Assistance
        </h2>
        <p className="text-xs text-[#6E6962] max-w-md mx-auto mb-4">
          Encountered an issue or have a suggestion? Our support team is always standing by.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:support@royalludo.arena"
            className="px-5 py-2.5 rounded-full bg-[#F7F4ED] hover:border-[#000000] text-xs font-bold text-[#000000] flex items-center gap-2 border border-[#DDD6CB] transition-all"
          >
            <Mail className="w-4 h-4 text-[#000000]" />
            <span>support@royalludo.arena</span>
          </a>
          <button
            onClick={() => alert('Support ticket system initialized. Our team will contact you!')}
            className="px-5 py-2.5 rounded-full bg-[#000000] text-xs font-bold text-[#F7F4ED] flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

    </div>
  );
};
