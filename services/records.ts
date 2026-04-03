
import { MedicalRecord, RecordCategory } from '../types';

const RECORDS_KEY = 'medimind_medical_records';

export const recordsService = {
  getRecords: (userId: string): MedicalRecord[] => {
    const records = localStorage.getItem(RECORDS_KEY);
    if (!records) return [];
    const allRecords: MedicalRecord[] = JSON.parse(records);
    return allRecords.filter(r => r.userId === userId);
  },

  addRecord: (record: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    const records = localStorage.getItem(RECORDS_KEY);
    const allRecords: MedicalRecord[] = records ? JSON.parse(records) : [];
    
    const newRecord: MedicalRecord = {
      ...record,
      id: 'rec-' + Math.random().toString(36).substring(7),
    };

    localStorage.setItem(RECORDS_KEY, JSON.stringify([...allRecords, newRecord]));
    return newRecord;
  },

  deleteRecord: (id: string): void => {
    const records = localStorage.getItem(RECORDS_KEY);
    if (!records) return;
    const allRecords: MedicalRecord[] = JSON.parse(records);
    const filteredRecords = allRecords.filter(r => r.id !== id);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(filteredRecords));
  },

  updateRecord: (record: MedicalRecord): void => {
    const records = localStorage.getItem(RECORDS_KEY);
    if (!records) return;
    const allRecords: MedicalRecord[] = JSON.parse(records);
    const updatedRecords = allRecords.map(r => r.id === record.id ? record : r);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updatedRecords));
  }
};
