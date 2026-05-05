import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No history yet</h3>
        <p className="text-slate-500">Analyze your first meal to see it here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Analysis History</h2>
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center gap-4 cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={item.imageUrl} alt={item.data.foodName} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                {item.data.foodName}
              </h3>
              <p className="text-sm text-slate-500 flex items-center mt-1">
                <span className="font-medium text-slate-700 mr-2">{item.data.calories} kcal</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.data.healthEvaluation === 'Good' ? 'bg-green-100 text-green-700' :
                item.data.healthEvaluation === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.data.healthEvaluation}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
