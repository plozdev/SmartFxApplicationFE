import React, { useState, useEffect } from 'react';
import { useSmartFXStore } from '@/src/store/useSmartFXStore';
import { smartFXApi } from '@/src/services/api';
import { RotateCcw, Zap, Info, CheckCircle2, FlaskConical, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function DemoPage() {
  const { currencies, setCurrencies } = useSmartFXStore();
  const [resetting, setResetting] = useState(false);
  const [injecting, setInjecting] = useState(false);
  const [from, setFrom] = useState('JPY');
  const [to, setTo] = useState('USD');
  const [rate, setRate] = useState('0.0082');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrencies() {
      const data = await smartFXApi.getCurrencies();
      setCurrencies(data);
    }
    loadCurrencies();
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setSuccessMsg(null);
    try {
      const response = await smartFXApi.resetDemo();
      setSuccessMsg(`✅ ${response.msg}`);
    } catch (error: any) {
      setSuccessMsg(`❌ Error: ${error.message || 'Failed to reset'}`);
    } finally {
      setResetting(false);
    }
  };

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    setInjecting(true);
    setSuccessMsg(null);
    try {
      const numRate = parseFloat(rate);
      const response = await smartFXApi.injectArbitrage(from, to, numRate);
      setSuccessMsg(`✅ ${response.msg}`);
    } catch (error: any) {
      setSuccessMsg(`❌ Error: ${error.message || 'Failed to inject arbitrage'}`);
    } finally {
      setInjecting(false);
    }
  };

  const quickTest = () => {
    setFrom('JPY');
    setTo('USD');
    setRate('2000.0');
  };

  return (
    <div className="grid grid-cols-[1fr_380px] gap-4 p-6 h-full max-w-[1400px] mx-auto overflow-auto">
      {/* Left: Inject Card */}
      <section className="bg-card-bg border border-border-subtle rounded-2xl p-8 flex flex-col shadow-2xl shadow-black/20">
        <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary mb-8">Developer Tools & Demo</h2>
        
        <form onSubmit={handleInject} className="space-y-8 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-text-secondary uppercase tracking-widest ml-1">From Currency</label>
              <select 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-black/40 border border-border-subtle rounded-lg px-4 py-3 text-white font-bold outline-none"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-text-secondary uppercase tracking-widest ml-1">To Currency</label>
              <select 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-black/40 border border-border-subtle rounded-lg px-4 py-3 text-white font-bold outline-none"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-text-secondary uppercase tracking-widest ml-1">Injected Exchange Rate</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.0001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="flex-1 bg-black/40 border border-border-subtle rounded-lg px-4 py-3 text-white font-mono text-xl focus:ring-1 focus:ring-accent-blue outline-none"
              />
              <button 
                type="submit"
                disabled={injecting}
                className="bg-accent-blue text-white px-8 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-accent-blue/10 flex items-center justify-center min-w-[140px]"
              >
                {injecting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Inject Rate'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={quickTest}
              className="bg-white/5 border border-border-subtle text-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Max Arbitrage
            </button>
          </div>
        </form>

        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 bg-accent-green/10 border border-accent-green/30 text-accent-green px-6 py-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Right Column: Guidance & System */}
      <div className="flex flex-col gap-4 overflow-auto">
        <section className="bg-card-bg border border-border-subtle rounded-2xl p-6 shadow-2xl">
          <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary mb-4">System Actions</h2>
          <button 
            disabled={resetting}
            onClick={handleReset}
            className="w-full bg-transparent border border-accent-red text-accent-red px-6 py-4 rounded-xl font-bold hover:bg-accent-red/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={cn("w-5 h-5", resetting && "animate-spin")} />
            Reset Global Rates
          </button>
        </section>

        <section className="bg-white/5 border border-border-subtle rounded-2xl p-6 space-y-4 flex-1">
          <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary">Testing Guide</h2>
          <div className="space-y-6">
            {[
              { title: "Inject", text: "Set a high rate for a pair to simulate a price gap." },
              { title: "Switch", text: "Go to the Exchange tab to trigger detection." },
              { title: "Verify", text: "Check alerts and optimized routing logic." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="font-mono text-accent-blue font-bold opacity-50">{i + 1}</div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{step.title}</div>
                  <div className="text-xs text-text-secondary mt-1 leading-relaxed">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
