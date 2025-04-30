import { useState, useCallback } from 'react';
import type { Signal } from '../types';

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const addSignal = useCallback((signal: Signal) => {
    setSignals(prev => [...prev, signal]);
    if (!selectedSignal) {
      setSelectedSignal(signal);
    }
  }, [selectedSignal]);

  const removeSignal = useCallback((id: string) => {
    setSignals(prev => prev.filter(signal => signal.id !== id));
    if (selectedSignal?.id === id) {
      setSelectedSignal(signals[0] || null);
    }
  }, [selectedSignal, signals]);

  const updateSignal = useCallback((id: string, updates: Partial<Signal>) => {
    setSignals(prev => prev.map(signal => 
      signal.id === id ? { ...signal, ...updates } : signal
    ));
  }, []);

  const clearSignals = useCallback(() => {
    setSignals([]);
    setSelectedSignal(null);
  }, []);

  return {
    signals,
    selectedSignal,
    setSelectedSignal,
    addSignal,
    removeSignal,
    updateSignal,
    clearSignals
  };
} 