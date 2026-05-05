import React from 'react';
import { NutritionAnalysis, HealthRating } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Info, Droplet, Zap, Utensils } from 'lucide-react';

interface ResultsDashboardProps {
  data: NutritionAnalysis;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data }) => {
  const macroData = [
    { name: 'Protein', value: data.protein, color: '#22c55e' }, // brand-500
    { name: 'Fat', value: data.fat, color: '#eab308' },     // yellow-500
    { name: 'Carbs', value: data.carbs, color: '#3b82f6' },   // blue-500
    { name: 'Sugar', value: data.sugar, color: '#ef4444' },   // red-500
  ];

  const getHealthColor = (rating: HealthRating) => {
    switch(rating) {
      case HealthRating.GOOD: return 'bg-green-100 text-green-800 border-green-200';
      case HealthRating.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case HealthRating.HIGH_RISK: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getHealthIcon = (rating: HealthRating) => {
    switch(rating) {
      case HealthRating.GOOD: return <CheckCircle className="w-5 h-5 mr-2" />;
      case HealthRating.MEDIUM: return <Info className="w-5 h-5 mr-2" />;
      case HealthRating.HIGH_RISK: return <AlertTriangle className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{data.foodName}</h2>
          <p className="text-slate-500 flex items-center">
            <Zap className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
            <span className="font-semibold text-slate-900 mr-1">{data.calories}</span> kcal per serving
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl border flex items-center font-medium ${getHealthColor(data.healthEvaluation)}`}>
          {getHealthIcon(data.healthEvaluation)}
          {data.healthEvaluation} Health Rating
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Macro Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-brand-600" />
              Macronutrient Breakdown
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-900 mb-4">Caloric Contribution (Approx)</h3>
             <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Right Column: Details & Summary */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              AI Summary
            </h3>
            <p className="text-brand-50 leading-relaxed text-sm">
              {data.summary}
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Nutrients</h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-600">Sugar</span>
                  <span className="font-medium text-slate-900">{data.sugar}g</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-600">Fiber/Carbs</span>
                  <span className="font-medium text-slate-900">{data.carbs}g</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-600">Protein</span>
                  <span className="font-medium text-slate-900">{data.protein}g</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-600">Total Fat</span>
                  <span className="font-medium text-slate-900">{data.fat}g</span>
                </div>
             </div>
          </div>

          {/* Vitamins */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
               <Droplet className="w-5 h-5 mr-2 text-blue-500" />
               Micronutrients
             </h3>
             <div className="flex flex-wrap gap-2">
               {data.vitaminsAndMinerals.map((vit, idx) => (
                 <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                   {vit}
                 </span>
               ))}
               {data.vitaminsAndMinerals.length === 0 && <span className="text-sm text-slate-400">No major micronutrients detected.</span>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
