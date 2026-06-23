import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert, Activity, DollarSign } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import api from '../api/axios';

const StatCard = ({ title, value, change, icon: Icon, type = "default" }) => {
  const isPositive = change >= 0;
  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          <div className={`mt-2 flex items-center text-sm ${type === 'danger' ? 'text-danger' : 'text-success'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${!isPositive && 'rotate-180'}`} />
            <span>{Math.abs(change)}% vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlassCard>
  );
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/transactions/history')
        ]);

        if (analyticsRes.data.success && historyRes.data.success) {
          setAnalytics(analyticsRes.data.analytics);

          // Process history for the 7-day chart
          const transactions = historyRes.data.transactions;
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
          });

          const processedChartData = last7Days.map(dateStr => {
            const dayTxns = transactions.filter(t => t.createdAt.startsWith(dateStr));
            const volume = dayTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
            const riskSum = dayTxns.reduce((sum, t) => sum + (t.finalRiskScore || 0), 0);
            const avgRisk = dayTxns.length ? (riskSum / dayTxns.length) : 0;
            const shortName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
            return { name: shortName, volume, risk: avgRisk };
          });

          setChartData(processedChartData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading live dashboard...</div>;
  }

  const fraudPreventedAmount = analytics?.suspiciousTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Transactions" value={analytics?.totalTransactions || 0} change={0} icon={DollarSign} />
        <StatCard title="High Risk Flags" value={analytics?.highRiskTransactions || 0} change={0} icon={AlertTriangle} type="danger" />
        <StatCard title="Avg Risk Score" value={analytics?.averageRiskScore || 0} change={0} icon={Activity} />
        <StatCard title="Fraud Prevented" value={`$${fraudPreventedAmount.toLocaleString()}`} change={0} icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold mb-4">Risk Velocity (7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#00E5FF" fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 overflow-hidden flex flex-col h-[350px]">
          <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin">
            {analytics?.suspiciousTransactions?.length === 0 ? (
              <p className="text-gray-400 text-sm">No high-risk transactions detected.</p>
            ) : (
              analytics?.suspiciousTransactions?.slice(0, 10).map((txn, i) => (
                <div key={txn._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${txn.finalRiskScore >= 80 ? 'bg-danger animate-pulse' : 'bg-warning'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {txn.finalRiskScore >= 80 ? 'Critical Threat Blocked' : 'Suspicious Activity'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {txn._id.slice(-6).toUpperCase()} • ${txn.amount}
                    </p>
                  </div>
                  <div className={`text-xs font-bold ${txn.finalRiskScore >= 80 ? 'text-danger' : 'text-warning'}`}>
                    {txn.finalRiskScore}% Risk
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
