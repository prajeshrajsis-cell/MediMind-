
import React, { useState } from 'react';
import { FlaskConical, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Camera } from 'lucide-react';
import { geminiService } from '../services/gemini';

interface LabAnalyzerProps {
  title?: string;
  subtitle?: string;
  mode?: 'lab' | 'rash';
}

const LabAnalyzer: React.FC<LabAnalyzerProps> = ({ 
  title = "Smart Lab Analyzer", 
  subtitle = "Upload a photo of your blood test or lab report for a simplified explanation.",
  mode = 'lab'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setAnalysis(null);
    }
  };

  const analyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    try {
      const base64Data = preview.split(',')[1];
      const prompt = mode === 'lab' 
        ? "Analyze this medical lab report. Identify any values outside normal ranges, explain what they mean, and suggest non-emergency lifestyle questions for a doctor."
        : "Analyze this image of a skin concern/rash. Identify potential causes based on visual indicators, suggest urgency level, and mention standard non-prescription care while emphasizing professional consultation.";
      
      const result = await geminiService.analyzeImage(
        { inlineData: { data: base64Data, mimeType: file?.type || 'image/png' } },
        prompt
      );
      setAnalysis(result || "Could not analyze the image.");
    } catch (err) {
      alert("Error analyzing image. Please try a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className={`inline-flex p-3 rounded-2xl mb-4 ${mode === 'lab' ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
          {mode === 'lab' ? <FlaskConical size={32} /> : <Camera size={32} />}
        </div>
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
              preview ? 'border-teal-200 dark:border-teal-500/30 bg-teal-50/10' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-500/50'
            }`}
          >
            {preview ? (
              <div className="w-full space-y-4">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-2xl shadow-md" />
                <button 
                  onClick={() => {setFile(null); setPreview(null); setAnalysis(null);}}
                  className="w-full py-2 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-bold mb-1">Click to upload {mode === 'lab' ? 'report' : 'photo'}</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Supports PNG, JPG (Max 5MB)</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <button 
            disabled={!preview || isAnalyzing}
            onClick={analyze}
            className={`w-full py-5 text-white rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 ${mode === 'lab' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
          >
            {isAnalyzing ? <><Loader2 className="animate-spin" /> Analyzing...</> : 'Run AI Analysis'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm min-h-[400px]">
          {analysis ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="flex items-center gap-2 font-bold text-xl mb-4 dark:text-white">
                <CheckCircle2 size={24} className="text-emerald-500" /> Analysis Result
              </h3>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                {analysis}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <FileText size={64} className="mb-4 text-slate-300 dark:text-slate-700" />
              <p className="text-slate-500 dark:text-slate-400">Your analysis will appear here after scanning.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 dark:bg-blue-500/5 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/20 flex gap-4">
        <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0" size={24} />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-bold mb-1">How it works:</p>
          <p>Our Vision AI uses specialized medical datasets to identify visual patterns in medical images and reports. It translates complex findings into clear information you can discuss with health professionals.</p>
        </div>
      </div>
    </div>
  );
};

export default LabAnalyzer;
