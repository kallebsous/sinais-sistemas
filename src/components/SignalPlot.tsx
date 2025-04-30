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
  const MAX_POINTS = 10000; // Limite máximo de pontos para sinais contínuos
  const MIN_STEP = 0.001; // Passo mínimo para evitar loops longos
  const MAX_DISCRETE_POINTS = 100; // Limite para sinais discretos sem points fornecidos

  const COLORS = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  ];

  const generatePoints = (signal: Signal) => {
    const { type, expression, points, startTime, endTime, samplingRate } = signal;
    let t: number[];
    let y: number[];

    if (type === 'continuous') {
      const numPoints = Math.min(
        Math.floor((endTime - startTime) * samplingRate),
        MAX_POINTS
      );
      if (numPoints <= 0) return { t: [], y: [] };
      const dt = (endTime - startTime) / numPoints;
      t = Array.from({ length: numPoints }, (_, i) => startTime + i * dt);
      y = t.map(time => {
        try {
          return evaluate(expression, { t: time });
        } catch {
          return 0;
        }
      });
    } else {
      if (points && points.length > 0) {
        t = points.slice(0, MAX_POINTS);
      } else {
        // Distribuir pontos uniformemente no intervalo para sinais discretos
        const totalPoints = Math.floor((endTime - startTime) * samplingRate) + 1;
        const numPoints = Math.min(totalPoints, MAX_DISCRETE_POINTS);
        if (numPoints <= 0) return { t: [], y: [] };
        const step = (endTime - startTime) / (numPoints - 1);
        t = Array.from({ length: numPoints }, (_, i) => startTime + i * step);
      }
      y = t.map(time => {
        try {
          return evaluate(expression, { t: time });
        } catch {
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
      // Usar scattergl para contínuos, scatter para discretos (melhor compatibilidade no mobile)
      const plotType = signal.type === 'continuous' ? 'scattergl' : 'scatter';
      const color = COLORS[index % COLORS.length];
      return {
        x: t,
        y: y,
        type: plotType,
        mode: mode,
        name: signal.name,
        line: signal.type === 'continuous' ? {
          color: color,
          width: 2,
        } : undefined,
        opacity: signal.type === 'continuous' ? 0.8 : 0.9,
        ...(signal.type === 'discrete' && {
          marker: {
            size: 10,
            color: color,
            line: {
              width: 1,
              color: 'rgba(0, 0, 0, 0.5)',
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
      font: { size: 18 },
    },
    paper_bgcolor: darkMode ? '#1f2937' : '#ffffff',
    plot_bgcolor: darkMode ? '#374151' : '#ffffff',
    font: { color: darkMode ? '#ffffff' : '#000000' },
    xaxis: {
      title: { text: 'Tempo (s)', font: { size: 14 } },
      showgrid: true,
      gridcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      zerolinecolor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      color: darkMode ? '#ffffff' : '#000000',
    },
    yaxis: {
      title: { text: 'Amplitude', font: { size: 14 } },
      showgrid: true,
      gridcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
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
      font: { size: 12 },
    },
    margin: { t: 60, b: 60, l: 60, r: 60 },
    hovermode: 'closest',
    dragmode: 'pan',
  };

  return (
    <Plot
      data={getData()}
      layout={layout}
      useResizeHandler={true}
      className="w-full min-h-[300px]"
      config={{
        responsive: true,
        displayModeBar: false,
        scrollZoom: true,
      }}
    />
  );
}
