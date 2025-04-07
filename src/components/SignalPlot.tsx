import React from 'react';
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';
import type { Signal, PlotType } from '../types';

interface SignalPlotProps {
  signals: Signal[];
  plotType: PlotType;
  darkMode?: boolean;
}

export function SignalPlot({ signals, plotType, darkMode = false }: SignalPlotProps) {
  const generatePoints = (signal: Signal) => {
    const { startTime, endTime, samplingRate, expression } = signal;
    const numPoints = Math.floor((endTime - startTime) * samplingRate);
    const dt = (endTime - startTime) / numPoints;
    
    const t = Array.from({ length: numPoints }, (_, i) => startTime + i * dt);
    const y = t.map(time => {
      try {
        return evaluate(expression, { t: time });
      } catch (error) {
        console.error(`Error evaluating expression: ${expression}`, error);
        return 0;
      }
    });

    return { t, y };
  };

  const generateFrequencySpectrum = (signal: Signal) => {
    const { y } = generatePoints(signal);
    const N = y.length;
    const fft = new Array(N).fill(0).map((_, i) => {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * i * n) / N;
        real += y[n] * Math.cos(angle);
        imag -= y[n] * Math.sin(angle);
      }
      return Math.sqrt(real * real + imag * imag) / N;
    });
    
    const frequencies = new Array(N).fill(0)
      .map((_, i) => (i * signal.samplingRate) / N);
    
    return { frequencies, magnitude: fft };
  };

  const getData = () => {
    if (plotType === 'frequency') {
      return signals.map(signal => {
        const { frequencies, magnitude } = generateFrequencySpectrum(signal);
        return {
          x: frequencies,
          y: magnitude,
          type: 'scatter',
          mode: 'lines',
          name: signal.name,
        };
      });
    }

    return signals.map(signal => {
      const { t, y } = generatePoints(signal);
      return {
        x: t,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: signal.name,
      };
    });
  };

  const layout = {
    title: plotType === 'frequency' ? 'Espectro de Frequência' : 'Domínio do Tempo',
    paper_bgcolor: darkMode ? '#1f2937' : '#ffffff',
    plot_bgcolor: darkMode ? '#374151' : '#ffffff',
    font: {
      color: darkMode ? '#ffffff' : '#000000',
    },
    xaxis: {
      title: plotType === 'frequency' ? 'Frequência (Hz)' : 'Tempo (s)',
      showgrid: true,
      gridcolor: darkMode ? '#4b5563' : '#e5e7eb',
      color: darkMode ? '#ffffff' : '#000000',
    },
    yaxis: {
      title: plotType === 'frequency' ? 'Magnitude' : 'Amplitude',
      showgrid: true,
      gridcolor: darkMode ? '#4b5563' : '#e5e7eb',
      color: darkMode ? '#ffffff' : '#000000',
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
      bgcolor: darkMode ? '#1f2937' : '#ffffff',
      bordercolor: darkMode ? '#4b5563' : '#e5e7eb',
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