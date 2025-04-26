import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import type { Signal, SignalOperation } from '../types';

interface SignalOperationsProps {
  signals: Signal[];
  onAddSignal: (signal: Signal) => void;
}

export function SignalOperations({ signals, onAddSignal }: SignalOperationsProps) {
  const [signal1Id, setSignal1Id] = useState('');
  const [signal2Id, setSignal2Id] = useState('');
  const [operation, setOperation] = useState<SignalOperation>('add');

  const performOperation = (e: React.FormEvent) => {
    e.preventDefault();

    const sinal1 = signals.find(s => s.id === signal1Id);
    const sinal2 = signals.find(s => s.id === signal2Id);

    if (!sinal1 || !sinal2) return;

    const simboloOperacao = {
      add: '+',
      subtract: '-',
      multiply: '*',
      divide: '/',
      convolve: 'convoluído com',
      correlate: 'correlacionado com',
    }[operation];

    const novaExpressao =
      operation === 'convolve' || operation === 'correlate'
        ? `(${sinal1.expression}) * (${sinal2.expression})`
        : `(${sinal1.expression}) ${{
            add: '+',
            subtract: '-',
            multiply: '*',
            divide: '/',
          }[operation]} (${sinal2.expression})`;

    const nomeNovoSinal =
      operation === 'convolve' || operation === 'correlate'
        ? `${sinal1.name} ${simboloOperacao} ${sinal2.name}`
        : `${sinal1.name} ${simboloOperacao} ${sinal2.name}`;

    // Determinar o tipo do novo sinal
    const newSignalType: 'continuous' | 'discrete' =
      sinal1.type === 'continuous' || sinal2.type === 'continuous' ? 'continuous' : 'discrete';

    const novoSinal: Signal = {
      id: crypto.randomUUID(),
      name: nomeNovoSinal,
      expression: novaExpressao,
      type: newSignalType, // Adicionando a propriedade type
      samplingRate: Math.max(sinal1.samplingRate, sinal2.samplingRate),
      startTime: Math.min(sinal1.startTime, sinal2.startTime),
      endTime: Math.max(sinal1.endTime, sinal2.endTime),
    };

    onAddSignal(novoSinal);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Operações com Sinais</h2>
      </div>

      <form onSubmit={performOperation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primeiro Sinal</label>
          <select
            value={signal1Id}
            onChange={(e) => setSignal1Id(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            required
          >
            <option value="">Selecione um sinal</option>
            {signals.map(signal => (
              <option key={signal.id} value={signal.id}>{signal.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Operação</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as SignalOperation)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
          >
            <option value="add">Somar (+)</option>
            <option value="subtract">Subtrair (-)</option>
            <option value="multiply">Multiplicar (*)</option>
            <option value="divide">Dividir (/)</option>
            <option value="convolve">Convoluir</option>
            <option value="correlate">Correlacionar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Segundo Sinal</label>
          <select
            value={signal2Id}
            onChange={(e) => setSignal2Id(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            required
          >
            <option value="">Selecione um sinal</option>
            {signals.map(signal => (
              <option key={signal.id} value={signal.id}>{signal.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Realizar Operação
        </button>
      </form>
    </div>
  );
}