
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Plus, Filter, Save, Trash2 } from 'lucide-react';

const MOCK_DATA = [
  { date: 'Mon', value: 72 },
  { date: 'Tue', value: 75 },
  { date: 'Wed', value: 68 },
  { date: 'Thu', value: 70 },
  { date: 'Fri', value: 74 },
  { date: 'Sat', value: 80 },
  { date: 'Sun', value: 71 },
];

const HealthTracker: React.FC = () => {
  const [metric, setMetric] = useState('Heart Rate');
  const [newValue, setNewValue] = useState('');
  const [records, setRecords] = useState(MOCK_DATA);

  const handleAdd = () => {
    if (!newValue) return;
    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      value: parseInt(newValue)
    };
    setRecords([...records, newEntry]);
    setNewValue('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Controls */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-blue-600" /> Track New Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Metric Type</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                >
                  <option>Heart Rate (bpm)</option>
                  <option>Blood Sugar (mg/dL)</option>
                  <option>Weight (kg)</option>
                  <option>Sleep (hrs)</option>
                  <option>Temperature (°C)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Measured Value</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Enter value..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAdd}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Record
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4">Historical Logs</h3>
            <div className="space-y-3">
              {records.slice().reverse().map((rec, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{rec.value} <span className="text-xs font-normal text-slate-500">bpm</span></div>
                    <div className="text-xs text-slate-400">{rec.date}</div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">{metric} Trends</h2>
                <p className="text-slate-500">Showing data for the last 7 measurements.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-bold border border-slate-100 rounded-lg hover:bg-slate-50">1W</button>
                <button className="px-4 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg">1M</button>
                <button className="px-4 py-2 text-xs font-bold border border-slate-100 rounded-lg hover:bg-slate-50">6M</button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={records}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Average</div>
                <div className="text-xl font-bold">73.2</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Highest</div>
                <div className="text-xl font-bold">80.0</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Status</div>
                <div className="text-xl font-bold text-emerald-600 italic">Normal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
