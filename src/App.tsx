/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ExchangePage } from './pages/ExchangePage';
import { DemoPage } from './pages/DemoPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'exchange' | 'demo'>('exchange');

  return (
    <div className="h-screen bg-bg flex flex-col font-sans selection:bg-accent-green selection:text-white overflow-hidden">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'exchange' ? (
            <motion.div
              key="exchange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ExchangePage />
            </motion.div>
          ) : (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <DemoPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}


