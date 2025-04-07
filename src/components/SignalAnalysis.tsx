import React from 'react';
import { evaluate } from 'mathjs';
import type { Signal, SignalProperties } from '../types';

interface SignalAnalysisProps {
  signal: Signal;
}

export function SignalAnalysis({ signal }: SignalAnalysisProps) {
  const analyzeSignal = (): SignalProperties => {
    const { startTime, endTime, samplingRate, expression } = signal;
    const numPoints = Math.floor((endTime - startTime) * samplingRate);
    const dt = (endTime - startTime) / numPoints;

    const points = Array.from({ length: numPoints }, (_, i) => {
      const t = startTime + i * dt;
      try {
        return evaluate(expression, { t });
      } catch {
        return 0;
      }
    });

    // Energia
    const energy = points.reduce((sum, point) => sum + point * point, 0) * dt;

    // Potência média
    const power = energy / (endTime - startTime);

    // Periodicidade (checagem simples)
    const isPeriodic = points.slice(0, Math.floor(points.length / 2))
      .every((point, i) => Math.abs(point - points[i + Math.floor(points.length / 2)]) < 0.01);

    // Simetria
    const isEven = points.every((point, i) =>
      Math.abs(point - points[points.length - 1 - i]) < 0.01
    );

    const isOdd = points.every((point, i) =>
      Math.abs(point + points[points.length - 1 - i]) < 0.01
    );

    return {
      isPeriodic,
      isEven,
      isOdd,
      energy,
      power,
    };
  };

  const propriedades = analyzeSignal();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Análise do Sinal: {signal.name}
      </h3>

      <div className="grid grid-cols-2 gap-4 text-gray-900 dark:text-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Periodicidade</p>
          <p className="text-lg">{propriedades.isPeriodic ? 'Periódico' : 'Aperiódico'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Simetria</p>
          <p className="text-lg">
            {propriedades.isEven
              ? 'Par'
              : propriedades.isOdd
              ? 'Ímpar'
              : 'Nenhuma'}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Energia</p>
          <p className="text-lg">{propriedades.energy.toFixed(4)} J</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Potência</p>
          <p className="text-lg">{propriedades.power.toFixed(4)} W</p>
        </div>
      </div>
    </div>
  );
}
