import React, { useState, useEffect } from 'react';
import { PlusCircle, Lightbulb } from 'lucide-react';
import type { Signal } from '../types';

interface SignalInputProps {
  onAddSignal: (signal: Signal) => void;
}

const exampleSignals = [
  {
    name: 'Onda Senoidal',
    expression: 'sin(2*pi*t)',
    description: 'Onda senoidal básica com frequência 1 Hz',
  },
  {
    name: 'Onda Quadrada',
    expression: 'sign(sin(2*pi*t))',
    description: 'Onda quadrada com frequência 1 Hz',
  },
  {
    name: 'Pulso Gaussiano',
    expression: 'exp(-(t)^2/(2*0.1^2))',
    description: 'Pulso gaussiano centrado em t=0',
  },
  {
    name: 'Onda Cossenoidal',
    expression: 'cos(2*pi*t)',
    description: 'Onda cossenoidal básica com frequência 1 Hz',
  },
  {
    name: 'Função Degrau', 
    expression: 't >= 0 ? 1 : 0',
    description: 'Função degrau unitário em t=0',
  },
  {
    name: 'Função Rampa',
    expression: 't >= 0 ? t : 0',
    description: 'Função rampa que cresce linearmente para t ≥ 0',
  },
];

export function SignalInput({ onAddSignal }: SignalInputProps) {
  const [name, setName] = useState('');
  const [expression, setExpression] = useState('');
  const [samplingRate, setSamplingRate] = useState(1000);
  const [timeRange, setTimeRange] = useState({ start: -10, end: 10 });
  const [signalType, setSignalType] = useState<'continuous' | 'discrete'>('continuous');
  const [pointsInput, setPointsInput] = useState('');

  // Ajustar samplingRate automaticamente com base no tipo de sinal
  useEffect(() => {
    if (signalType === 'discrete') {
      setSamplingRate(10);
    } else {
      setSamplingRate(1000);
    }
  }, [signalType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signal: Signal = {
      id: crypto.randomUUID(),
      name,
      expression,
      samplingRate,
      startTime: timeRange.start,
      endTime: timeRange.end,
      type: signalType,
      ...(signalType === 'discrete' && pointsInput && { points: pointsInput.split(',').map(Number) }),
    };
    onAddSignal(signal);
    setName('');
    setExpression('');
    setPointsInput('');
  };

  const handleAddExample = (example: typeof exampleSignals[0]) => {
    onAddSignal({
      id: crypto.randomUUID(),
      name: example.name,
      expression: example.expression,
      samplingRate,
      startTime: timeRange.start,
      endTime: timeRange.end,
      type: signalType,
      ...(signalType === 'discrete' && pointsInput && { points: pointsInput.split(',').map(Number) }),
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adicionar Novo Sinal</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Sinal</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            placeholder="ex: Onda Senoidal"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expressão Matemática</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            placeholder="ex: sin(2*pi*t)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sinal</label>
          <select
            value={signalType}
            onChange={(e) => setSignalType(e.target.value as 'continuous' | 'discrete')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
          >
            <option value="continuous">Contínuo</option>
            <option value="discrete">Discreto</option>
          </select>
        </div>

        {signalType === 'discrete' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pontos de Amostragem (opcional, separados por vírgula)
            </label>
            <input
              type="text"
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
              placeholder="ex: -1, -0.5, 0, 0.5, 1"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Deixe em branco para gerar pontos automaticamente com base na taxa de amostragem.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Inicial</label>
            <input
              type="number"
              value={timeRange.start}
              onChange={(e) => setTimeRange(prev => ({ ...prev, start: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Final</label>
            <input
              type="number"
              value={timeRange.end}
              onChange={(e) => setTimeRange(prev => ({ ...prev, end: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Taxa de Amostragem (Hz)
            {signalType === 'discrete' && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (Ajustada para 10 Hz para melhor visualização)
              </span>
            )}
          </label>
          <input
            type="number"
            value={samplingRate}
            onChange={(e) => setSamplingRate(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Adicionar Sinal
        </button>
      </form>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sinais de Exemplo</h3>
        </div>
        <div className="space-y-2">
          {exampleSignals.map((example, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{example.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{example.description}</p>
                  <code className="text-sm text-blue-600 dark:text-blue-400">{example.expression}</code>
                </div>
                <button
                  onClick={() => handleAddExample(example)}
                  className="ml-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
