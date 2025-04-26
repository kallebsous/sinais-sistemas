import React from 'react';
import { evaluate } from 'mathjs';
import type { Signal, SignalProperties } from '../types';

interface SignalAnalysisProps {
  signal: Signal;
}

export function SignalAnalysis({ signal }: SignalAnalysisProps) {
  const analyzeSignal = (): SignalProperties => {
    const { type, expression, points, startTime, endTime, samplingRate } = signal;

    let tValues: number[];
    let signalValues: number[];

    // Geração dos pontos de análise com base no tipo de sinal
    if (type === 'continuous') {
      // Sinais contínuos: gerar pontos de amostragem
      const numPoints = Math.floor((endTime - startTime) * samplingRate);
      if (numPoints <= 0 || !Number.isFinite(numPoints)) {
        return {
          isPeriodic: false,
          isEven: false,
          isOdd: false,
          energy: 0,
          power: 0,
          signalType: 'neither',
        };
      }
      const dt = (endTime - startTime) / numPoints;
      tValues = Array.from({ length: numPoints }, (_, i) => startTime + i * dt);
      signalValues = tValues.map((t) => {
        try {
          return evaluate(expression, { t });
        } catch {
          return 0;
        }
      });
    } else {
      // Sinais discretos
      if (points && points.length > 0) {
        // Usar os pontos fornecidos, se disponíveis
        tValues = points;
      } else {
        // Gerar pontos com base em startTime, endTime e samplingRate
        const step = 1 / samplingRate;
        tValues = [];
        for (let t = startTime; t <= endTime; t += step) {
          tValues.push(t);
        }
      }
      if (tValues.length === 0) {
        return {
          isPeriodic: false,
          isEven: false,
          isOdd: false,
          energy: 0,
          power: 0,
          signalType: 'neither',
        };
      }
      signalValues = tValues.map((t) => {
        try {
          return evaluate(expression, { t });
        } catch {
          return 0;
        }
      });
    }

    // Cálculo de energia e potência
    let energy: number;
    let power: number;
    if (type === 'continuous') {
      // Sinais contínuos: aproximação da integral
      const dt = tValues[1] - tValues[0]; // Intervalo entre pontos
      energy = signalValues.reduce((sum, val) => sum + val * val * dt, 0);
      power = energy / (endTime - startTime);
    } else {
      // Sinais discretos: somatório dos valores ao quadrado
      energy = signalValues.reduce((sum, val) => sum + val * val, 0);
      power = energy / tValues.length; // Potência média
    }

    // Checagem de periodicidade
    const isPeriodic = signalValues
      .slice(0, Math.floor(signalValues.length / 2))
      .every((val, i) => Math.abs(val - signalValues[i + Math.floor(signalValues.length / 2)]) < 0.01);

    // Checagem de simetria
    const isEven = signalValues.every((val, i) =>
      Math.abs(val - signalValues[signalValues.length - 1 - i]) < 0.01
    );
    const isOdd = signalValues.every((val, i) =>
      Math.abs(val + signalValues[signalValues.length - 1 - i]) < 0.01
    );

    // Classificação: Sinal de energia ou de potência
    let signalType: 'energy' | 'power' | 'neither';
    const ENERGY_THRESHOLD = 1e6; // Limiar para considerar energia finita
    // Primeiro, verificar se é periódico (sinais periódicos são de potência)
    if (isPeriodic && isFinite(power) && power > 0 && power < 1e6) {
      signalType = 'power';
    } else if (isFinite(energy) && energy > 0 && energy < ENERGY_THRESHOLD) {
      // Só classificar como sinal de energia se NÃO for periódico
      signalType = 'energy';
    } else {
      signalType = 'neither';
    }

    return {
      isPeriodic,
      isEven,
      isOdd,
      energy,
      power,
      signalType,
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

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Classificação</p>
          <p className="text-lg">
            {propriedades.signalType === 'energy'
              ? 'Sinal de Energia'
              : propriedades.signalType === 'power'
              ? 'Sinal de Potência'
              : 'Nem de energia, nem de potência'}
          </p>
        </div>
      </div>
    </div>
  );
}