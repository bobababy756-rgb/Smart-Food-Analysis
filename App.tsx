import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HistoryList } from './components/HistoryList';
import { ViewState, NutritionAnalysis, HistoryItem } from './types';
import { analyzeFoodImage } from './services/geminiService';

const HISTORY_KEY = 'nutriscan_history';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<NutritionAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleAnalyze = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix for API
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
      });

      const mimeType = file.type;
      const data = await analyzeFoodImage(base64, mimeType);
      
      setCurrentAnalysis(data);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUrl: URL.createObjectURL(file), // For session display. Note: blob URLs don't persist well across reload without re-creating. For a real persistent app, we'd store the base64 thumbnail or upload to cloud. For this demo, we store base64 thumbnail in localstorage if small enough, or accept session-only images. 
        // To make history work better in this SPA demo, let's store the full data URL for the thumbnail in history (caution with size limit).
        data
      };

      // Re-read for data URL to save in history (full string)
      const fullDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
      });
      newHistoryItem.imageUrl = fullDataUrl;

      setHistory(prev => [newHistoryItem, ...prev]);
      setCurrentView('RESULTS');
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentAnalysis(item.data);
    setCurrentView('RESULTS');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        {currentView === 'HOME' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="text-center space-y-4 mt-8">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                Smart Food Analysis <br/>
                <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload a photo of your meal and get instant nutritional breakdowns, calorie counts, and personalized health insights.
              </p>
            </div>

            <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
              <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold text-xl">1</div>
                <h3 className="font-bold text-slate-900 mb-2">Snap a Photo</h3>
                <p className="text-slate-500 text-sm">Take a picture of your breakfast, lunch, or dinner.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold text-xl">2</div>
                <h3 className="font-bold text-slate-900 mb-2">AI Analysis</h3>
                <p className="text-slate-500 text-sm">Our Gemini AI identifies ingredients and calculates nutrients.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold text-xl">3</div>
                <h3 className="font-bold text-slate-900 mb-2">Get Insights</h3>
                <p className="text-slate-500 text-sm">View macros, calories, and health ratings instantly.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'RESULTS' && currentAnalysis && (
          <div className="space-y-6">
            <button 
              onClick={() => setCurrentView('HOME')}
              className="text-slate-500 hover:text-brand-600 flex items-center text-sm font-medium transition-colors"
            >
              ← Analyze another photo
            </button>
            <ResultsDashboard data={currentAnalysis} />
          </div>
        )}

        {currentView === 'HISTORY' && (
          <HistoryList 
            history={history} 
            onSelect={handleSelectHistory} 
            onDelete={handleDeleteHistory}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} NutriScan AI. Not medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
