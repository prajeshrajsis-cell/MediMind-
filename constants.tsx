
import React from 'react';
import { 
  Stethoscope, Pill, AlertTriangle, BookOpen, Activity, 
  Brain, FileText, FlaskConical, ShieldCheck, Syringe, 
  Leaf, Calendar, MessageSquare, Mic, Camera, LineChart, 
  Clock, Baby, UserPlus, Heart, Apple, Dumbbell, Globe, 
  Lock, Briefcase 
} from 'lucide-react';
import { Feature } from './types';

export const FEATURES: Feature[] = [
  { id: 'symptoms', title: 'Symptom Checker', description: 'Analyze your symptoms with advanced AI reasoning.', icon: <Stethoscope size={24} />, category: 'Consult' },
  { id: 'meds', title: 'Medicine Database', description: 'Search usage, side effects, and warnings.', icon: <Pill size={24} />, category: 'Learn' },
  { id: 'emergency', title: 'Emergency Alert', description: 'Immediate triage for critical symptoms.', icon: <AlertTriangle size={24} />, category: 'Consult' },
  { id: 'edu', title: 'Disease Library', description: 'Simple explanations for complex conditions.', icon: <BookOpen size={24} />, category: 'Learn' },
  { id: 'track', title: 'Health Tracker', description: 'Log BP, sugar, weight, and sleep patterns.', icon: <Activity size={24} />, category: 'Track' },
  { id: 'mental', title: 'Mental Wellness', description: 'Compassionate AI support for your mind.', icon: <Brain size={24} />, category: 'Specialized' },
  { id: 'records', title: 'Medical Vault', description: 'Secure storage for your medical records.', icon: <FileText size={24} />, category: 'Track' },
  { id: 'lab', title: 'Lab Analyzer', description: 'Interpret blood reports and lab results.', icon: <FlaskConical size={24} />, category: 'Consult' },
  { id: 'interactions', title: 'Drug Checker', description: 'Check potential medicine interactions.', icon: <ShieldCheck size={24} />, category: 'Learn' },
  { id: 'vax', title: 'Vax Tracker', description: 'Manage your immunization history.', icon: <Syringe size={24} />, category: 'Track' },
  { id: 'lifestyle', title: 'Lifestyle Tips', description: 'Personalized prevention and wellness advice.', icon: <Leaf size={24} />, category: 'Learn' },
  { id: 'booking', title: 'Appointments', description: 'Sync with your local healthcare providers.', icon: <Calendar size={24} />, category: 'Consult' },
  { id: 'chat', title: 'AI Assistant', description: '24/7 personalized medical chat support.', icon: <MessageSquare size={24} />, category: 'Consult' },
  { id: 'voice', title: 'Voice Consultation', description: 'Hands-free interactive health support.', icon: <Mic size={24} />, category: 'Consult' },
  { id: 'image', title: 'Rash Analysis', description: 'Scan skin concerns via image recognition.', icon: <Camera size={24} />, category: 'Consult' },
  { id: 'insights', title: 'Health Insights', description: 'Deep trends based on your tracked data.', icon: <LineChart size={24} />, category: 'Track' },
  { id: 'chronic', title: 'Chronic Care', description: 'Tools for long-term disease management.', icon: <Clock size={24} />, category: 'Specialized' },
  { id: 'peds_elder', title: 'Family Care', description: 'Guides for pediatric and elderly care.', icon: <Baby size={24} />, category: 'Specialized' },
  { id: 'women', title: 'Women\'s Health', description: 'Dedicated wellness tools for women.', icon: <Heart size={24} />, category: 'Specialized' },
  { id: 'first_aid', title: 'First Aid', description: 'Step-by-step emergency first aid guides.', icon: <UserPlus size={24} />, category: 'Learn' },
  { id: 'nutrition', title: 'Nutritionist', description: 'AI-generated diet and meal planners.', icon: <Apple size={24} />, category: 'Track' },
  { id: 'fitness', title: 'Fitness Coach', description: 'Health-conscious movement recommendations.', icon: <Dumbbell size={24} />, category: 'Track' },
  { id: 'multilingual', title: 'Multi-Language', description: 'Support in over 50+ world languages.', icon: <Globe size={24} />, category: 'Learn' },
  { id: 'privacy', title: 'Data Privacy', description: 'Military-grade encryption for your data.', icon: <Lock size={24} />, category: 'Track' },
  { id: 'doctor', title: 'Professional Mode', description: 'Advanced tools for medical practitioners.', icon: <Briefcase size={24} />, category: 'Specialized' },
];

export const SYSTEM_INSTRUCTION = `You are MediMind AI, a world-class professional medical assistant.
Your goal is to provide accurate, helpful, and empathetic medical information.
CRITICAL: You are NOT a doctor. Always include a disclaimer that users should consult a professional.
If symptoms suggest a life-threatening emergency (chest pain, stroke symptoms, severe bleeding), IMMEDIATELY advise calling emergency services (911/112).
Use simple language but remain scientifically accurate. 
For symptom checking: Ask clarifying questions one at a time.
For medicine info: Provide dosage context, side effects, and major contraindications.
For lab reports: Explain what markers mean and typical ranges.`;
