import React, { useState, useEffect } from 'react';
import { useSmartFXStore } from '@/src/store/useSmartFXStore';
import { smartFXApi } from '@/src/services/api';
import { ArrowRightLeft, AlertCircle, TrendingUp, ArrowRight, Loader2, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function ExchangePage() {
  const { 
    currencies, setCurrencies, lastResult, setLastResult, 
    isLoading, setIsLoading, error, setError, 
    arbitrageDetected, setArbitrageDetected 
  } = useSmartFXStore();

  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState<string>('1000.00');
  const [arbitrageCycle, setArbitrageCycle] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const data = await smartFXApi.getCurrencies();
        setCurrencies(data);
      } catch (err) {
        setError('Failed to load currencies');
      }
    }
    loadCurrencies();
  }, []);

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Invalid amount');
      return;
    }

    setIsLoading(true);
    setError(null);
    setArbitrageDetected(null);
    setArbitrageCycle(null);
    
    try {
      const result = await smartFXApi.exchange(from, to, numAmount);
      setLastResult(result);
      setArbitrageCycle(null);
    } catch (err: any) {
      console.log('Exchange catch error:', err);
      if (err.type === 'ArbitrageFoundException') {
        console.log('Detected Arbitrage:', err.message, err.cycle);
        setArbitrageDetected(err.message);
        setArbitrageCycle(err.cycle);
        // Don't call setLastResult here - it resets arbitrageDetected!
      } else {
        console.log('Other error:', err.message);
        setError(err.message || 'Operation failed');
        setLastResult(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[380px_1fr] grid-rows-[1fr_180px] gap-4 p-6 h-full max-w-[1400px] mx-auto">
      {/* Left: Swap Card */}
      <section className="bg-card-bg border border-border-subtle rounded-2xl p-6 flex flex-col row-span-1 shadow-2xl shadow-black/20">
        <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary mb-6">Currency Swap</h2>
        
        <form onSubmit={handleExchange} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-text-secondary ml-1">SEND AMOUNT</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-black/40 border border-border-subtle rounded-lg px-4 py-3 text-white font-medium focus:ring-1 focus:ring-accent-green outline-none"
              />
              <select 
                value={from} 
                onChange={(e) => setFrom(e.target.value)}
                className="w-24 bg-black/40 border border-border-subtle rounded-lg px-2 py-3 text-white font-bold outline-none"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center text-text-secondary py-1">
            <ArrowRightLeft className="w-5 h-5 rotate-90" />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-text-secondary ml-1">RECEIVE CURRENCY</label>
            <select 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-black/40 border border-border-subtle rounded-lg px-4 py-3 text-white font-bold outline-none"
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent-green text-white rounded-lg py-4 font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-accent-green/10 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Execute Smart Exchange'}
          </button>
        </form>

        <div className="mt-auto pt-8">
          <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {['USD / JPY', 'EUR / GBP'].map(pair => (
              <button 
                key={pair}
                onClick={() => {
                  const [f, t] = pair.split(' / ');
                  setFrom(f);
                  setTo(t);
                }}
                className="bg-transparent border border-border-subtle text-text-primary px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors"
              >
                {pair}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Right Top: Result & Path */}
      <section className="bg-card-bg border border-border-subtle rounded-2xl p-6 flex flex-col gap-8 shadow-2xl shadow-black/20 overflow-auto">
        <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary">Optimal Conversion Route</h2>
        
        {(() => {
          console.log('RENDER: lastResult=', !!lastResult, 'arbitrage=', !!arbitrageDetected);
          
          if (lastResult) {
            console.log('RENDER: case 1 - lastResult');
            return (
              <div className="flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                <div className="text-[12px] text-text-secondary mb-2">You Receive</div>
                <div className="text-3xl font-bold font-mono text-accent-green">
                  {lastResult.finalAmount.toLocaleString()} <span className="text-base uppercase ml-1 opacity-80">{lastResult.to}</span>
                </div>
              </div>
              <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                <div className="text-[12px] text-text-secondary mb-2">Effective Rate</div>
                <div className="text-3xl font-bold font-mono">
                  {lastResult.effectiveRate.toFixed(5)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[12px] font-bold text-text-secondary uppercase tracking-widest">Routing Path</label>
              <div className="flex items-center gap-4">
                {lastResult.path.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm z-10",
                      i === 0 || i === lastResult.path.length - 1
                        ? "bg-accent-blue text-white"
                        : "bg-card-bg border border-border-subtle text-text-primary"
                    )}>
                      {node}
                    </div>
                    {i < lastResult.path.length - 1 && (
                      <div className="flex-1 h-[2px] bg-border-subtle relative min-w-[30px]">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-border-subtle w-2 h-2" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {arbitrageDetected && (
              <div className="bg-accent-red/10 border border-accent-red rounded-xl p-5 flex gap-4 mt-auto">
                <AlertCircle className="w-5 h-5 text-accent-red shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm mb-2">Arbitrage Detected!</div>
                  <div className="text-xs text-text-secondary leading-relaxed mb-3">
                    {arbitrageDetected}
                  </div>
                  {arbitrageCycle && (
                    <div className="text-xs font-mono text-accent-red">
                      Cycle Path: {arbitrageCycle}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
          }
          
          if (arbitrageDetected) {
            console.log('RENDER: case 2 - arbitrage');
            return (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="bg-accent-red/10 border border-accent-red rounded-2xl p-8 w-full">
                  <div className="flex gap-4">
                    <AlertCircle className="w-8 h-8 text-accent-red shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-2 text-accent-red">Arbitrage Opportunity Detected!</div>
                      <div className="text-sm text-text-secondary mb-4">
                        {arbitrageDetected}
                      </div>
                      {arbitrageCycle && (
                        <div className="mt-4 p-4 bg-black/40 rounded-lg">
                          <div className="text-xs text-text-secondary mb-2">Profitable Cycle Path:</div>
                          <div className="text-lg font-bold font-mono text-accent-red">
                            {arbitrageCycle}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          console.log('RENDER: case 3 - empty');
          return (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <div className="bg-white/5 p-6 rounded-full mb-4">
                  <TrendingUp className="w-12 h-12" />
              </div>
              <p className="text-sm font-medium">Configure exchange parameters and execute to visualize optimal routes.</p>
            </div>
          );
        })()}
      </section>

      {/* Bottom Left: Activity */}
      <section className="bg-card-bg border border-border-subtle rounded-2xl p-6 shadow-2xl shadow-black/20">
        <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary mb-4">Recent Activity</h2>
        <div className="font-mono text-[12px] space-y-3">
            {[
                { pair: 'USD → JPY', status: 'SUCCESS' },
                { pair: 'GBP → EUR', status: 'SUCCESS' },
                { pair: 'EUR → USD', status: 'SUCCESS' },
            ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5 opacity-80">
                    <span>{activity.pair}</span>
                    <span className="text-accent-green font-bold text-[10px] tracking-widest">{activity.status}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Bottom Right: Quick Status */}
      <section className="bg-card-bg border border-border-subtle rounded-2xl p-6 shadow-2xl shadow-black/20 flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-[13px] uppercase tracking-[0.1em] font-bold text-text-secondary">Market Pulse</h2>
            <p className="text-xs text-text-secondary">Latency optimized pathing active.</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Live Detection</span>
         </div>
      </section>

      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-accent-red text-white font-bold py-3 px-6 rounded-lg shadow-2xl flex items-center gap-2"
            >
                <AlertCircle className="w-4 h-4" />
                {error}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

