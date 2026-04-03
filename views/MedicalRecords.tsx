
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Upload, Calendar, User, 
  Stethoscope, Syringe, AlertCircle, Filter, Search,
  X, Check, ChevronRight, Download, Info
} from 'lucide-react';
import { MedicalRecord, RecordCategory, User as UserType } from '../types';
import { recordsService } from '../services/records';
import { authService } from '../services/auth';

const MedicalRecords: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<RecordCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    category: 'Diagnosis',
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    provider: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const userRecords = recordsService.getRecords(currentUser.id);
      setRecords(userRecords);
    }
  }, []);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRecord.title || !newRecord.category) return;

    const record = recordsService.addRecord({
      userId: user.id,
      category: newRecord.category as RecordCategory,
      title: newRecord.title,
      date: newRecord.date || new Date().toISOString().split('T')[0],
      description: newRecord.description,
      provider: newRecord.provider
    });

    setRecords([...records, record]);
    setIsAdding(false);
    setNewRecord({
      category: 'Diagnosis',
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      provider: ''
    });
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      recordsService.deleteRecord(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // In a real app, we'd upload to a server. 
    // Here we'll simulate it by creating a local object URL
    const reader = new FileReader();
    reader.onload = () => {
      const record = recordsService.addRecord({
        userId: user.id,
        category: 'Document',
        title: file.name,
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file) // Note: this is temporary for the session
      });
      setRecords([...records, record]);
    };
    reader.readAsDataURL(file);
  };

  const filteredRecords = records.filter(r => {
    const matchesFilter = filter === 'All' || r.category === filter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (r.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: RecordCategory) => {
    switch (category) {
      case 'Diagnosis': return <Stethoscope size={18} className="text-blue-500" />;
      case 'Treatment': return <FileText size={18} className="text-emerald-500" />;
      case 'Allergy': return <AlertCircle size={18} className="text-rose-500" />;
      case 'Immunization': return <Syringe size={18} className="text-violet-500" />;
      case 'Document': return <FileText size={18} className="text-slate-500" />;
      default: return <FileText size={18} />;
    }
  };

  const categories: (RecordCategory | 'All')[] = ['All', 'Diagnosis', 'Treatment', 'Allergy', 'Immunization', 'Document'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Medical Vault</h1>
          <p className="text-slate-500 font-medium">Securely manage your health history and clinical documents.</p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Upload size={18} />
            Upload Document
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" />
          </label>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={18} />
            Add Record
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === cat 
                ? 'bg-slate-900 dark:bg-violet-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
            <div key={record.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    record.category === 'Diagnosis' ? 'bg-blue-50 dark:bg-blue-500/10' :
                    record.category === 'Treatment' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                    record.category === 'Allergy' ? 'bg-rose-50 dark:bg-rose-500/10' :
                    record.category === 'Immunization' ? 'bg-violet-50 dark:bg-violet-500/10' : 'bg-slate-50 dark:bg-slate-800'
                  }`}>
                    {getCategoryIcon(record.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{record.category}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{record.title}</h3>
                    {record.provider && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                        <User size={14} />
                        {record.provider}
                      </p>
                    )}
                    {record.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{record.description}</p>
                    )}
                    {record.fileUrl && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                          <FileText size={14} />
                          {record.fileName}
                        </div>
                        <a 
                          href={record.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-xs font-bold flex items-center gap-1"
                        >
                          <Download size={14} />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] py-20 text-center">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No records found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">Start building your medical history by adding your first record or document.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-8 py-3 rounded-2xl font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              Add Your First Record
            </button>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight dark:text-white">Add Medical Record</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors dark:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-slate-700 dark:text-white"
                    value={newRecord.category}
                    onChange={(e) => setNewRecord({...newRecord, category: e.target.value as RecordCategory})}
                  >
                    <option value="Diagnosis">Diagnosis</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Immunization">Immunization</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-slate-700 dark:text-white"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Title / Condition</label>
                <input 
                  type="text" 
                  placeholder="e.g. Seasonal Allergies, Knee Surgery"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold dark:text-white"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Healthcare Provider (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Smith, General Hospital"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold dark:text-white"
                  value={newRecord.provider}
                  onChange={(e) => setNewRecord({...newRecord, provider: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Notes / Description</label>
                <textarea 
                  placeholder="Add any relevant details..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium min-h-[100px] dark:text-white"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="mt-20 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <AlertCircle size={32} className="text-violet-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2">Privacy & Security Notice</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Your medical records are stored locally on your device and are never shared with third parties without your explicit consent. MediMind uses end-to-end encryption for all health data synchronization.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
          Security Settings
        </button>
      </div>
    </div>
  );
};

export default MedicalRecords;
