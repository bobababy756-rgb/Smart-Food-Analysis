import React from 'react';
import { ViewState } from '../types';
import { Leaf, Activity, History } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => setView('HOME')}
          className="flex items-center space-x-2 group"
        >
          <div className="bg-brand-100 p-2 rounded-lg group-hover:bg-brand-200 transition-colors">
            <Leaf className="w-6 h-6 text-brand-600" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
            NutriScan AI
          </span>
        </button>

        <nav className="flex items-center space-x-1 sm:space-x-4">
          <button
            onClick={() => setView('HOME')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'HOME' 
                ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setView('HISTORY')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'HISTORY' 
                ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
