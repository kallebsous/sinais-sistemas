import React from 'react';
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';
import type { Signal } from '../types';
import type { Data, Layout } from 'plotly.js';

interface SignalPlotProps {
  signals: Signal[];
  darkMode?: boolean;
}

export function SignalPlot({ signals, darkMode = false }: SignalPlotProps) {
  const MAX_POINTS = 10000; // Limite máximo de pontos
  const MIN_STEP = 0.001; // Passo mínimo para evitar loops longos
  const MAX_DISCRETE_POINTS = 100; // Limite específico para sinais discretos sem points fornecidos

  // Paleta de cores para os sinais
  const COLORS = [
    '#1f77b4', // Azul
    '#ff7f0e', // Laranja
    '#2ca02c', // Verde
    '#d62728', // Vermelho
    '#9467bd', // Roxo
    '#8c564b', // Marrom
    '#e377c2', // Rosa
    '#7f7f7f', // Cinza
    '#bcbd22', // Amarelo-verde
    '#17becf', // Ciano
  ];

  const generatePoints = (signal: Signal) => {
    const { type, expression, points, startTime, endTime, samplingRate } = signal;

    let t: number[];
    let y: number[];

    console.log(`Gerando pontos para sinal: ${signal.name}, type: ${type}`); // Debug

    if (type === 'continuous') {
      // Sinais contínuos: gerar pontos de amostragem com alta densidade
      const numPoints = Math.min(
        Math.floor((endTime - startTime) * samplingRate),
        MAX_POINTS
      );
      if (numPoints <= 0) {
        console.warn('Nenhum ponto gerado: intervalo inválido ou samplingRate inválido');
        return { t: [], y: [] };
      }
      const dt = (endTime - startTime) / numPoints;
      t = Array.from({ length: numPoints }, (_, i) => startTime + i * dt);
      y = t.map(time => {
        try {
          return evaluate(expression, { t: time });
        } catch (error) {
          console.error(`Error evaluating expression: ${expression}`, error);
          return 0;
        }
      });
    } else {
      // Sinais discretos
      if (points && points.length > 0) {
        // Usar os pontos fornecidos, limitando ao máximo
        t = points.slice(0, MAX_POINTS);
      } else {
        // Gerar pontos com base em startTime, endTime e samplingRate, mas com limite menor
        const step = Math.max(1 / samplingRate, MIN_STEP);
        t = [];
        let time = startTime;
        let count = 0;

        while (time <= endTime && count < MAX_DISCRETE_POINTS) {
          t.push(time);
          time += step;
          count++;
        }

        if (count >= MAX_DISCRETE_POINTS) {
          console.warn(`Limite de ${MAX_DISCRETE_POINTS} pontos atingido para o sinal discreto`);
        }
      }
      y = t.map(time => {
        try {
          return evaluate(expression, { t: time });
        } catch (error) {
          console.error(`Error evaluating expression: ${expression}`, error);
          return 0;
        }
      });
    }

    return { t, y };
  };

  const getData = (): Data[] => {
    return signals.map((signal, index) => {
      const { t, y } = generatePoints(signal);
      const mode = signal.type === 'continuous' ? 'lines' : 'markers';
      // Atribuir uma cor baseada no índice do sinal
      const color = COLORS[index % COLORS.length];
      console.log(`Plotando sinal: ${signal.name}, mode: ${mode}, color: ${color}`); // Debug
      return {
        x: t,
        y: y,
        type: 'scattergl',
        mode: mode,
        name: signal.name,
        line: signal.type === 'continuous' ? {
          color: color,
          width: 2, // Linha mais espessa para sinais contínuos
        } : undefined,
        opacity: signal.type === 'continuous' ? 0.8 : 0.9, // Transparência para evitar sobreposição
        ...(signal.type === 'discrete' && {
          marker: {
            size: 10, // Tamanho maior para marcadores
            color: color,
            line: {
              width: 1, // Borda nos marcadores
              color: 'rgba(0, 0, 0, 0.5)', // Borda preta com transparência
            },
          },
        }),
      } as Data;
    });
  };

  const layout: Partial<Layout> = {
    title: {
      text: 'Domínio do Tempo',
      x: 0.5,
      xanchor: 'center',
      font: {
        size: 18,
      },
    },
    paper_bgcolor: darkMode ? '#1f2937' : '#ffffff',
    plot_bgcolor: darkMode ? '#374151' : '#ffffff',
    font: {
      color: darkMode ? '#ffffff' : '#000000',
    },
    xaxis: {
      title: {
        text: 'Tempo (s)',
        font: {
          size: 14,
        },
      },
      showgrid: true,
      gridcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Grade mais visível
      zerolinecolor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      color: darkMode ? '#ffffff' : '#000000',
    },
    yaxis: {
      title: {
        text: 'Amplitude',
        font: {
          size: 14,
        },
      },
      showgrid: true,
      gridcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Grade mais visível
      zerolinecolor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      color: darkMode ? '#ffffff' : '#000000',
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
      bgcolor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      bordercolor: darkMode ? '#4b5563' : '#e5e7eb',
      font: {
        size: 12,
      },
    },
    margin: {
      t: 60,
      b: 60,
      l: 60,
      r: 60,
    },
  };

  return (
    <Plot
      data={getData()}
      layout={layout}
      useResizeHandler={true}
      className="w-full h-[500px]"
    />
  );
}