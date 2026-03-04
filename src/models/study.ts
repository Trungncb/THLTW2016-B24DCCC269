import { useState, useCallback, useEffect } from 'react';

export interface Subject {
  id: number;
  name: string;
}

export interface Session {
  id: number;
  subjectId: number;
  date: string; // ISO
  duration: number; // minutes
  content: string;
  note?: string;
}

export interface Goal {
  id: number;
  subjectId?: number; // undefined means total goal
  month: string; // YYYY-MM
  targetMinutes: number;
}

const SUBJECT_KEY = 'study_subjects';
const SESSION_KEY = 'study_sessions';
const GOAL_KEY = 'study_goals';

export const useStudy = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const s = localStorage.getItem(SUBJECT_KEY);
    if (s) setSubjects(JSON.parse(s));
  }, []);
  useEffect(() => {
    const s = localStorage.getItem(SESSION_KEY);
    if (s) setSessions(JSON.parse(s));
  }, []);
  useEffect(() => {
    const s = localStorage.getItem(GOAL_KEY);
    if (s) setGoals(JSON.parse(s));
  }, []);

  useEffect(() => {
    localStorage.setItem(SUBJECT_KEY, JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goals));
  }, [goals]);

  const addSubject = useCallback((name: string) => {
    const newSubject: Subject = { id: Date.now(), name };
    setSubjects([...subjects, newSubject]);
    return newSubject;
  }, [subjects]);

  const updateSubject = useCallback((id: number, name: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, name } : s));
  }, [subjects]);

  const deleteSubject = useCallback((id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setSessions(sessions.filter(sess => sess.subjectId !== id));
    setGoals(goals.filter(g => g.subjectId !== id));
  }, [subjects, sessions, goals]);

  const addSession = useCallback((session: Omit<Session, 'id'>) => {
    const newSess: Session = { ...session, id: Date.now() };
    setSessions([...sessions, newSess]);
    return newSess;
  }, [sessions]);

  const updateSession = useCallback((id: number, updates: Partial<Session>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [sessions]);

  const deleteSession = useCallback((id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
  }, [sessions]);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goal, id: Date.now() };
    setGoals([...goals, newGoal]);
    return newGoal;
  }, [goals]);

  const updateGoal = useCallback((id: number, updates: Partial<Goal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [goals]);

  const deleteGoal = useCallback((id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  }, [goals]);

  return {
    subjects,
    sessions,
    goals,
    addSubject,
    updateSubject,
    deleteSubject,
    addSession,
    updateSession,
    deleteSession,
    addGoal,
    updateGoal,
    deleteGoal,
  };
};
