import { useState, useCallback } from 'react';
import type { Signal } from '../types';

interface HistoryState {
  past: Signal[][];
  present: Signal[];
  future: Signal[][];
}

export function useHistory(initialPresent: Signal[] = []) {
  const [state, setState] = useState<HistoryState>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setState(currentState => {
      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setState(currentState => {
      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const updateState = useCallback((newPresent: Signal[]) => {
    setState(currentState => ({
      past: [...currentState.past, currentState.present],
      present: newPresent,
      future: [],
    }));
  }, []);

  return {
    state: state.present,
    setState: updateState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
} 