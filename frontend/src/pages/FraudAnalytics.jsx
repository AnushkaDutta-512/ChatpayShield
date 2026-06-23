import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import api from '../api/axios';

const FraudAnalytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [anomalyData, setAnomalyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          const txns = res.data.analytics.suspiciousTransactions || [];
          
          if (txns.length === 0) {
            setCategoryData([{ name: 'No High Risk Data', count: 0 }]);
            setAnomalyData([
              { subject: 'Velocity', A: 0, fullMark: 100 },
              { subject: 'Location', A: 0, fullMark: 100 },
              { subject: 'Device', A: 0, fullMark: 100 },
              { subject: 'Time', A: 0, fullMark: 100 },
              { subject: 'Amount', A: 0, fullMark: 100 },
            ]);
          } else {
            // Group by actual fraud reasons from database
            const categories = {};
            txns.forEach(t => {
              const reason = t.fraudReasons?.[0] || t.riskReasons?.[0] || 'Unclassified Threat';
              // Truncate long reasons for the chart
              const shortReason = reason.length > 25 ? reason.substring(0, 25) + '...' : reason;
              categories[shortReason] = (categories[shortReason] || 0) + 1;
            });
            const catData = Object.keys(categories).map(key => ({ name: key, count: categories[key] }));
            setCategoryData(catData.sort((a, b) => b.count - a.count)); // Sort highest first

            // Map anomaly reasons to radar subjects
            const radarMap = {
              'Velocity': 10,
              'Location': 10,
              'Device': 10,
              'Time': 10,
              'Amount': 10,
              'Network': 10
            };
            
            txns.forEach(t => {
              const reasons = (t.anomalyReasons || []).concat(t.fraudReasons || []).concat(t.riskReasons || []);
              reasons.forEach(r => {
                  const lower = r.toLowerCase();
                  if (lower.includes('veloc') || lower.includes('limit')) radarMap['Velocity'] += 30;
                  else if (lower.includes('locat') || lower.includes('ip') || lower.includes('vpn')) radarMap['Location'] += 30;
                  else if (lower.includes('device') || lower.includes('spoof')) radarMap['Device'] += 30;
                  else if (lower.includes('time') || lower.includes('hour')) radarMap['Time'] += 30;
                  else if (lower.includes('amount') || lower.includes('large')) radarMap['Amount'] += 30;
                  else radarMap['Network'] += 15; // fallback
              });
            });
            
            const radarData = Object.keys(radarMap).map(key => ({
              subject: key,
              A: Math.min(100, radarMap[key]),
              fullMark: 100
            }));
            setAnomalyData(radarData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading authentic analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Fraud Analytics Deep Dive</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-6">Fraud Categories Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" width={120} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff10', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-6">Behavioral Anomaly Radar</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={anomalyData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff20" tick={false} />
                <Radar name="Anomalies" dataKey="A" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff10', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default FraudAnalytics;
