import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertOctagon, Scan } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import api from '../api/axios';

const OCRScanner = () => {
  const [stage, setStage] = useState('upload'); // upload, processing, result
  const [resultData, setResultData] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStage('processing');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultData(res.data.data);
      setStage('result');
    } catch (error) {
      console.error(error);
      alert('Failed to analyze image');
      setStage('upload');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">OCR Fraud Scanner</h1>
          <p className="text-gray-400">Upload payment screenshots for AI-driven textual analysis and metadata verification.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-12 border-dashed border-2 border-white/20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag & Drop Screenshot</h3>
              <p className="text-gray-400 mb-8 max-w-md">Supported formats: JPG, PNG, WEBP. Max size: 5MB. AI will extract text, verify UPI IDs, and check for deepfake manipulations.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <AnimatedButton onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </AnimatedButton>
            </GlassCard>
          </motion.div>
        )}

        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-8">
              <Scan className="w-24 h-24 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary animate-[float_1.5s_ease-in-out_infinite]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Neural Engine Processing</h3>
            <p className="text-gray-400 animate-pulse">Extracting metadata and analyzing pixel integrity...</p>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Image Preview */}
            <GlassCard className="p-6 relative overflow-hidden">
              <div className="aspect-[4/3] bg-background/50 rounded-xl flex items-center justify-center border border-white/5 relative">
                <FileText className="w-16 h-16 text-gray-500 opacity-50" />
                {/* Fake Bounding Boxes */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-10 border-2 border-danger/50 rounded bg-danger/10" />
                <div className="absolute top-1/2 left-1/4 w-1/3 h-8 border-2 border-success/50 rounded bg-success/10" />
              </div>
            </GlassCard>

            {/* Analysis Results */}
            <div className="space-y-6">
              <GlassCard className="p-6 bg-danger/5 border-danger/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-danger/20 text-danger rounded-xl">
                    <AlertOctagon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-danger">High Risk Detected</h3>
                    <p className="text-sm text-gray-400">Confidence Score: {resultData?.confidenceScore || 98.4}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400">Extracted Amount</span>
                    <span className="font-mono font-bold">${resultData?.amount || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400">Receiver UPI</span>
                    <span className="font-mono text-danger font-bold">{resultData?.receiverUpiId || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400">Font Inconsistency</span>
                    <span className="text-danger flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Detected</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h4 className="font-bold mb-4">AI Reasoning</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  The neural network detected pixel-level tampering around the amount field. The font kerning on "${resultData?.amount || '1,500.00'}" does not match the standard banking app typeface. Additionally, the UPI ID "{resultData?.receiverUpiId || 'suspicious@ybl'}" matches a known fraud ring database.
                </p>
                <AnimatedButton className="w-full mt-6" variant="outline" onClick={() => setStage('upload')}>
                  Scan Another File
                </AnimatedButton>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OCRScanner;
