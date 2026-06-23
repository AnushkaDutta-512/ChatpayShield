import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Crosshair, Radar, AlertTriangle, Zap } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import api from '../api/axios';

const AICommandCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeNodes, setActiveNodes] = useState([]);
  const [stats, setStats] = useState({ totalNodes: 0, activeThreats: 0 });

  useEffect(() => {
    const fetchLiveThreats = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          const data = res.data.analytics;
          
          // Map real suspicious transactions to alerts format
          const realAlerts = data.suspiciousTransactions.map(txn => ({
            id: txn._id,
            type: txn.riskReasons?.[0] || 'High Risk Activity',
            location: 'Unknown IP Endpoint', // Backend doesn't store location yet
            ip: txn.receiverUpiId || 'Hidden',
            risk: txn.finalRiskScore || 90,
            timestamp: new Date(txn.createdAt).toLocaleTimeString(),
          }));

          setAlerts(realAlerts);
          setStats({
            totalNodes: data.totalTransactions,
            activeThreats: data.suspiciousTransactionCount
          });
        }
      } catch (error) {
        console.error("Failed to fetch live threats", error);
      }
    };

    fetchLiveThreats();
    
    // Poll every 10 seconds for new authentic data
    const pollInterval = setInterval(fetchLiveThreats, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  // Visual simulation for the holographic map radar
  useEffect(() => {
    if (stats.activeThreats === 0) return;
    
    const nodeInterval = setInterval(() => {
      setActiveNodes(prev => {
        const newNodes = [...prev, { x: Math.random() * 100, y: Math.random() * 100, id: Date.now() }];
        return newNodes.slice(-Math.min(stats.activeThreats, 8)); // Cap visual nodes at 8 max
      });
    }, 2000);
    return () => clearInterval(nodeInterval);
  }, [stats.activeThreats]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radar className="w-8 h-8 text-primary animate-pulse" />
            Global SOC Command Center
          </h1>
          <p className="text-primary font-mono text-sm mt-1 animate-pulse">SYSTEM_STATE: ARMED | NEURAL_NET: ACTIVE</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-danger/10 border border-danger/50 text-danger rounded-lg flex items-center gap-2 font-mono text-sm">
            <div className={`w-2 h-2 rounded-full bg-danger ${stats.activeThreats > 0 ? 'animate-ping' : ''}`} /> 
            Threat Level: {stats.activeThreats > 0 ? 'ELEVATED' : 'NOMINAL'}
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/50 text-primary rounded-lg flex items-center gap-2 font-mono text-sm">
            <Zap className="w-4 h-4" /> AI Active Defense: ON
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Live Stream */}
        <GlassCard className="col-span-1 p-0 flex flex-col overflow-hidden border-primary/20">
          <div className="p-4 border-b border-primary/20 bg-primary/5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-bold font-mono tracking-wider">LIVE_THREAT_STREAM</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <div className="text-gray-400 font-mono text-sm p-4 text-center border border-white/5 rounded-lg border-dashed">
                  NO ACTIVE THREATS DETECTED.
                </div>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 border border-danger/30 bg-danger/10 rounded-lg relative overflow-hidden group cursor-crosshair"
                  >
                    <div className="absolute inset-0 bg-danger/5 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <span className="text-danger font-bold text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> {alert.type}
                      </span>
                      <span className="text-gray-400 font-mono text-xs">{alert.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono relative z-10">
                      <div className="text-gray-400 col-span-2">TARGET_UPI: <span className="text-white">{alert.ip}</span></div>
                      <div className="text-gray-400 col-span-2">
                        RISK_SCORE: <span className="text-danger font-bold">{alert.risk}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Right Column: Holographic Map */}
        <GlassCard className="col-span-1 lg:col-span-2 p-0 relative overflow-hidden bg-[#050B14] flex flex-col">
          {/* Overlay Grids & HUD */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E5FF10_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute top-4 left-4 z-10 font-mono text-xs text-primary/70 space-y-1">
            <div>TARGET: GLOBAL_NETWORK</div>
            <div>SCANNING_FREQ: LIVE_POLL</div>
            {stats.activeThreats > 0 ? (
              <div className="animate-pulse text-danger">ENGAGING_COUNTERMEASURES...</div>
            ) : (
              <div className="text-success">NETWORK_SECURE</div>
            )}
          </div>
          <div className="absolute bottom-4 right-4 z-10">
            <Crosshair className="w-12 h-12 text-primary/30 animate-[spin_4s_linear_infinite]" />
          </div>

          <div className="flex-1 relative flex items-center justify-center p-8">
            {/* World Map Background Simulation */}
            <div className="w-full max-w-2xl aspect-[2/1] border border-primary/20 rounded-[50%] bg-surface/50 relative overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)]">
              {/* Radar Sweep */}
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(0,229,255,0.4)_360deg)] animate-[spin_3s_linear_infinite] rounded-full origin-center" />
              
              {/* Grid Lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-primary/20" />
                <div className="h-full w-[1px] bg-primary/20 absolute" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
              <div className="absolute top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />

              {/* Active Threat Nodes */}
              <AnimatePresence>
                {activeNodes.map(node => (
                  <motion.div
                    key={node.id}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute w-4 h-4 rounded-full border-2 border-danger"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div className="w-full h-full bg-danger rounded-full animate-pulse" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Bottom Stats */}
          <div className="p-4 bg-background/80 border-t border-primary/20 grid grid-cols-3 gap-4 backdrop-blur-md relative z-10">
            <div>
              <div className="text-primary font-mono text-xs mb-1">TOTAL_TRANSACTIONS</div>
              <div className="text-2xl font-bold font-mono">{stats.totalNodes.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-danger font-mono text-xs mb-1">ACTIVE_THREATS</div>
              <div className="text-2xl font-bold font-mono text-danger">{stats.activeThreats.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-primary font-mono text-xs mb-1">AI_CONFIDENCE_MATRIX</div>
              <div className="w-full h-2 bg-surface rounded-full mt-2 overflow-hidden border border-white/10">
                <div className="h-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '99.9%' }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AICommandCenter;
