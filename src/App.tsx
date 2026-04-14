/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Cpu, 
  ShieldCheck, 
  Settings, 
  FileText, 
  Check, 
  X, 
  AlertTriangle,
  Lock,
} from 'lucide-react';

// --- Components ---

const Panel = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-border rounded-sm p-4 flex flex-col ${className}`}>
    <div className="text-[11px] uppercase tracking-[0.1em] text-navy font-bold mb-3 flex items-center gap-2">
      <div className="w-1 h-3 bg-teal" />
      {title}
    </div>
    {children}
  </div>
);

const AnimatedCounter = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const totalFrames = duration * 60;
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(start + (end - start) * progress);
      
      if (frame <= totalFrames) {
        setCount(currentCount);
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

const PipelineDiagram = () => {
  const nodes = [
    "Dataset", "Features", "Primary Agent", "Buffer", 
    "EthicalTwin", "ERS Engine", "Governance", "Audit Log"
  ];

  return (
    <div className="bg-card border border-border p-3 mb-5 rounded-sm relative">
      <svg width="100%" height="40" viewBox="0 0 1000 40" className="w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7A99"/>
          </marker>
        </defs>
        <path d="M 20 20 H 980" stroke="#E5E9F0" strokeWidth="2" markerEnd="url(#arrow)" />
        
        {nodes.map((node, i) => {
          const x = 40 + (i * (940 / (nodes.length - 1)));
          const isEthical = node === "EthicalTwin";
          return (
            <g key={node}>
              <circle
                cx={x}
                cy="20"
                r={isEthical ? 8 : 6}
                fill={isEthical ? "var(--teal)" : "var(--navy)"}
              />
              {isEthical && (
                <circle cx={x} cy="20" r="3" fill="#fff">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
                </circle>
              )}
              <text
                x={x}
                y="38"
                textAnchor="middle"
                fontSize="8"
                fontFamily="var(--font-sans)"
                fill={isEthical ? "var(--teal)" : "#6B7A99"}
                fontWeight={isEthical ? "bold" : "normal"}
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const ArchitectureCard = ({ title, description, active = false }: { title: string, description: string, active?: boolean }) => {
  return (
    <div 
      className={`border-l-3 p-2 mb-2 transition-all duration-300 ${active ? 'border-teal bg-[#f0fdfb]' : 'border-border bg-[#fcfcfc]'} hover:border-teal hover:bg-[#f0fdfb] hover:translate-x-1`}
    >
      <h4 className="text-[12px] font-bold text-navy">{title}</h4>
      <p className="text-[10px] text-text-sub leading-tight">{description}</p>
    </div>
  );
};

const ERSSimulator = () => {
  const [bias, setBias] = useState(0.20);
  const [parity, setParity] = useState(0.35);
  const [safety, setSafety] = useState(0);

  const ers = useMemo(() => {
    return (0.40 * bias + 0.40 * parity + 0.20 * safety).toFixed(2);
  }, [bias, parity, safety]);

  const ersValue = parseFloat(ers);

  const getStatus = () => {
    if (ersValue < 0.35) return { label: "APPROVE", color: "text-teal border-teal bg-teal/5", icon: Check };
    if (ersValue < 0.60) return { label: "WARN", color: "text-amber border-amber bg-amber/5", icon: AlertTriangle };
    return { label: "BLOCK", color: "text-red-500 border-red-500 bg-red-50", icon: Lock };
  };

  const status = getStatus();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <div className="font-mono text-[12px] bg-navy text-white px-4 py-2 rounded-sm mb-5">
        ERS = 0.40×{bias.toFixed(2)} + 0.40×{parity.toFixed(2)} + 0.20×{safety}
      </div>

      <div className="relative w-44 h-44 mb-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#E5E9F0" strokeWidth="8"
            strokeDasharray="188.5 251.3"
            transform="rotate(135 50 50)"
          />
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="8"
            strokeDasharray="251.3"
            animate={{ strokeDashoffset: 251.3 - (188.5 * ersValue) }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            transform="rotate(135 50 50)"
          />
          <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--navy)">{ers}</text>
          <text x="50" y="68" textAnchor="middle" fontSize="6" fill="var(--text-sub)">CURRENT SCORE</text>
        </svg>
      </div>

      <div class="w-full space-y-3">
        <div className="grid grid-cols-[1fr_100px_30px] items-center gap-3">
          <label className="text-[11px] font-bold">Bias Indicator (B)</label>
          <input 
            type="range" min="0" max="1" step="0.01" value={bias} 
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="h-1 bg-border rounded-sm appearance-none cursor-pointer accent-teal"
          />
          <span className="text-[11px] font-mono text-right">{bias.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-[1fr_100px_30px] items-center gap-3">
          <label className="text-[11px] font-bold">Parity Dev (D)</label>
          <input 
            type="range" min="0" max="1" step="0.01" value={parity} 
            onChange={(e) => setParity(parseFloat(e.target.value))}
            className="h-1 bg-border rounded-sm appearance-none cursor-pointer accent-teal"
          />
          <span className="text-[11px] font-mono text-right">{parity.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-[1fr_100px_30px] items-center gap-3">
          <label className="text-[11px] font-bold">Safety Constraint (S)</label>
          <button 
            onClick={() => setSafety(safety === 0 ? 1 : 0)}
            className={`w-8 h-4 rounded-full transition-colors relative ${safety === 1 ? 'bg-teal' : 'bg-slate-200'}`}
          >
            <motion.div 
              animate={{ x: safety === 1 ? 16 : 2 }}
              className="w-3 h-3 bg-white rounded-full absolute top-0.5"
            />
          </button>
          <span className="text-[11px] font-mono text-right">{safety.toFixed(1)}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={status.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`mt-4 px-6 py-2 rounded-sm border-2 font-extrabold text-[14px] tracking-widest ${status.color}`}
        >
          {status.label === "APPROVE" ? "✅ " : status.label === "WARN" ? "⚠️ " : "🚫 "}
          {status.label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DomainCard = ({ title, before, after }: { title: string, before: number, after: number }) => {
  return (
    <div className="border border-border p-2.5 rounded-sm">
      <h5 className="text-[11px] font-bold text-navy mb-2">{title}</h5>
      <div className="h-2 bg-[#eee] rounded-sm relative overflow-hidden mb-1">
        <div className="absolute h-full bg-[#ccc]" style={{ width: `${before * 100}%` }} />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${after * 100}%` }}
          className="absolute h-full bg-teal"
        />
      </div>
      <div className="flex justify-between text-[9px] text-text-sub font-mono">
        <span>{before.toFixed(2)}</span>
        <span>{after.toFixed(2)}</span>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="w-[1024px] h-[768px] mx-auto overflow-hidden flex flex-col p-6 bg-bg text-text-main font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-end mb-5 border-b-2 border-navy pb-3">
        <div className="logo-area">
          <h1 className="text-[32px] font-extrabold text-navy relative inline-block">
            EthicalTwin
            <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-teal" />
          </h1>
          <p className="text-[14px] text-text-sub mt-1">Real-Time Ethical Oversight for Autonomous AI Decision Systems</p>
        </div>
        <div className="flex gap-5">
          <div className="bg-card border border-border px-4 py-2 rounded-sm flex flex-col min-w-[140px]">
            <span className="font-mono text-[18px] font-bold text-teal"><AnimatedCounter value={91} suffix=".2%" /></span>
            <span className="text-[10px] uppercase tracking-wider text-text-sub">Bias Detection</span>
          </div>
          <div className="bg-card border border-border px-4 py-2 rounded-sm flex flex-col min-w-[140px]">
            <span className="font-mono text-[18px] font-bold text-teal"><AnimatedCounter value={79} suffix=".0%" /></span>
            <span className="text-[10px] uppercase tracking-wider text-text-sub">Fairness Gain</span>
          </div>
          <div className="bg-card border border-border px-4 py-2 rounded-sm flex flex-col min-w-[140px]">
            <span className="font-mono text-[18px] font-bold text-teal"><AnimatedCounter value={12} suffix=".4ms" /></span>
            <span className="text-[10px] uppercase tracking-wider text-text-sub">Latency</span>
          </div>
        </div>
      </header>

      {/* Pipeline Viz */}
      <PipelineDiagram />

      {/* Main Grid */}
      <div className="grid grid-cols-[280px_1fr_300px] gap-4 flex-1 min-h-0">
        
        {/* Left Panel: Architecture & Table */}
        <Panel title="Architecture" className="min-h-0">
          <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
            <ArchitectureCard title="Data Ingestion" description="Real-time stream processing with schema validation." />
            <ArchitectureCard title="Primary Agent (XGBoost)" description="Core decision model optimized for high accuracy." />
            <ArchitectureCard title="Ethical Twin Analyzer" description="Parallel agent simulating counterfactual fairness paths." active />
            <ArchitectureCard title="Governance Controller" description="Policy enforcement layer with ERS intervention." />
            <ArchitectureCard title="Audit Log" description="Immutable ledger for regulatory compliance reporting." />
          </div>
          
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr>
                <th className="text-left p-1.5 border-b border-border text-text-sub">Metric</th>
                <th className="text-left p-1.5 border-b border-border text-text-sub">Baseline</th>
                <th className="text-left p-1.5 border-b border-border text-teal bg-teal/5 font-bold">EthicalTwin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1.5 border-b border-border">Bias Detection</td>
                <td className="p-1.5 border-b border-border">42%</td>
                <td className="p-1.5 border-b border-border bg-teal/5 font-bold">91%</td>
              </tr>
              <tr>
                <td className="p-1.5 border-b border-border">Fairness (DPD)</td>
                <td className="p-1.5 border-b border-border">0.34</td>
                <td className="p-1.5 border-b border-border bg-teal/5 font-bold">0.07</td>
              </tr>
              <tr>
                <td className="p-1.5 border-b border-border">Interception</td>
                <td className="p-1.5 border-b border-border">None</td>
                <td className="p-1.5 border-b border-border bg-teal/5 font-bold">Real-Time</td>
              </tr>
              <tr>
                <td className="p-1.5">F1 Score</td>
                <td className="p-1.5">0.88</td>
                <td className="p-1.5 bg-teal/5 font-bold">0.86</td>
              </tr>
            </tbody>
          </table>
        </Panel>

        {/* Middle Panel: Simulator */}
        <Panel title="ERS Simulator">
          <ERSSimulator />
        </Panel>

        {/* Right Panel: Results & Distribution */}
        <Panel title="Results & Distribution">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <DomainCard title="Employment" before={0.34} after={0.07} />
            <DomainCard title="Consumer Loan" before={0.29} after={0.08} />
            <DomainCard title="Clinical Triage" before={0.21} after={0.09} />
            <DomainCard title="Autonomous" before={0.14} after={0.05} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#F5A623" strokeWidth="12" strokeDasharray="23 100" strokeDashoffset="0"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="65 100" strokeDashoffset="-23"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="#00C9B1" strokeWidth="12" strokeDasharray="12 100" strokeDashoffset="-88"/>
            </svg>
            <div className="text-[10px] space-y-1">
              <div><span className="text-teal">■</span> 12% Approve</div>
              <div><span className="text-amber">■</span> 23% Warn</div>
              <div><span className="text-red-500">■</span> 65% Block</div>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-dashed border-border space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-text-sub">High-Risk Blocked</span>
              <span className="font-bold text-navy">68.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-sub">F1 Stability</span>
              <span className="font-bold text-navy">{">"}0.85</span>
            </div>
          </div>
        </Panel>

      </div>

      {/* Footer */}
      <footer className="mt-4 pt-3 border-t border-border flex justify-between text-[10px] text-text-sub">
        <div className="flex gap-3 font-bold">
          <span>G. Vasistha</span>
          <span>A. Verma</span>
          <span>A. Jain</span>
          <span>M. Kumari</span>
        </div>
        <div className="institution">SRM Institute of Science and Technology • Dept of CSE</div>
        <div className="italic text-navy">EthicalTwin: A Dual-Agent AI Governance Framework for Real-Time Mitigation</div>
      </footer>

    </div>
  );
}
