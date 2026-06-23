import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, ArrowUpRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import api from '../api/axios';

const TransactionIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions/history');
        if (res.data.success) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getRiskLevel = (score) => {
    if (score >= 80) return { label: 'CRITICAL', color: 'text-danger bg-danger/10 border-danger/20' };
    if (score >= 50) return { label: 'HIGH', color: 'text-warning bg-warning/10 border-warning/20' };
    if (score >= 20) return { label: 'MEDIUM', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
    return { label: 'LOW', color: 'text-success bg-success/10 border-success/20' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction Intelligence</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time monitoring of all network transfers.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-background/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search TXN ID, UPI, Amount..."
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/30 text-gray-400 text-sm border-b border-white/5">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Receiver UPI</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Risk Score</th>
                <th className="p-4 font-medium">Confidence</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-400">Loading intelligence data...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-400">No transactions found.</td></tr>
              ) : transactions.map((txn, i) => {
                const risk = getRiskLevel(txn.riskScore || 10);
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={txn._id} 
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-mono text-gray-300">{txn._id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-gray-400">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{txn.receiverUpiId || 'Unknown'}</td>
                    <td className="p-4 font-medium">${txn.amount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-bold border ${risk.color}`}>
                          {risk.label}
                        </div>
                        <span className="text-gray-400">{txn.riskScore || 10}/100</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="w-full max-w-[100px] bg-surface rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${txn.confidenceScore || 90}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">{txn.confidenceScore || 90}%</span>
                    </td>
                    <td className="p-4">
                      <Link to={`/transactions/${txn._id}`} className="p-2 bg-surface hover:bg-primary/20 hover:text-primary rounded-lg transition-colors inline-block border border-white/5 hover:border-primary/30">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 bg-background/50 flex justify-between items-center text-sm text-gray-400">
          <span>Showing {transactions.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-surface border border-white/10 rounded hover:bg-white/5 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded">1</button>
            <button className="px-3 py-1 bg-surface border border-white/10 rounded hover:bg-white/5">Next</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default TransactionIntelligence;
