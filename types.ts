// Import React to fix the 'Cannot find namespace React' error for React.ReactNode
import React from 'react';

export interface HealthMetric {
  date: string;
  value: number;
  type: 'BP_SYS' | 'BP_DIA' | 'SUGAR' | 'TEMP' | 'WEIGHT' | 'SLEEP';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'Consult' | 'Track' | 'Learn' | 'Specialized';
}

export enum AppRoute {
  LANDING = 'landing',
  LOGIN = 'login',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot-password',
  DASHBOARD = 'dashboard',
  SYMPTOM_CHECKER = 'symptoms',
  HEALTH_TRACKER = 'track',
  AI_CHAT = 'chat',
  LAB_ANALYZER = 'lab',
  MED_INFO = 'meds',
  EMERGENCY = 'emergency',
  DISEASE_EDU = 'edu',
  MENTAL_HEALTH = 'mental',
  RECORDS = 'records',
  INTERACTIONS = 'interactions',
  LIFESTYLE = 'lifestyle',
  FIRST_AID = 'first_aid',
  NUTRITION = 'nutrition',
  DOCTOR_MODE = 'doctor',
  PROFILE = 'profile',
  VOICE_CONSULT = 'voice',
  IMAGE_ANALYSIS = 'image',
  VAX_TRACKER = 'vax',
  BOOKING = 'booking',
  CHRONIC_CARE = 'chronic',
  FAMILY_CARE = 'peds_elder',
  WOMENS_HEALTH = 'women',
  HEALTH_INSIGHTS = 'insights',
  FITNESS_COACH = 'fitness',
  PRIVACY_VAULT = 'privacy',
  MULTILINGUAL = 'multilingual'
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  parts: { text: string; inlineData?: any }[];
}

export interface SymptomAnalysis {
  urgency: 'Emergency' | 'High' | 'Medium' | 'Low';
  urgencyExplanation: string;
  potentialConditions: {
    name: string;
    likelihood: 'Possible' | 'Likely' | 'Uncommon';
    description: string;
  }[];
  recommendedActions: string[];
  disclaimer: string;
}

export interface MedicineInteraction {
  substance: string;
  severity: 'High' | 'Moderate' | 'Low';
  type: string;
  effect: string;
  advice: string;
}

export interface MedicineInfo {
  name: string;
  uses: string[];
  sideEffects: string[];
  warnings: string[];
  interactions: MedicineInteraction[];
}

export type RecordCategory = 'Diagnosis' | 'Treatment' | 'Allergy' | 'Immunization' | 'Document';

export interface MedicalRecord {
  id: string;
  userId: string;
  category: RecordCategory;
  title: string;
  date: string;
  description?: string;
  provider?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
