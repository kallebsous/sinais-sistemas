import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, CheckCircle2 } from 'lucide-react';
import type { Signal, SignalTransformation } from '../types';

interface SignalTransformationsProps {
  signals: Signal[];
  onAddSignal: (signal: Signal) => void;
}

export function SignalTransformations({ signals, onAddSignal }: SignalTransformationsProps) {
  const [signalId, setSignalId] = useState('');
  const [transformation, setTransformation] = useState<SignalTransformation>('amplify');
  const [factor, setFactor] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const performTransformation = (e: React.FormEvent) => {
    e.preventDefault();

    const sinal = signals.find(s => s.id === signalId);
    if (!sinal) return;

    let novaExpressao = '';
    let nomeTransformacao = '';

    switch (transformation) {
      case 'amplify':
        novaExpressao = `${factor} * (${sinal.expression})`;
        nomeTransformacao = `${factor}× Amplificado`;
        break;
      case 'attenuate':
        novaExpressao = `(${sinal.expression}) / ${factor}`;
        nomeTransformacao = `${factor}× Atenuado`;
        break;
      case 'shift':
        novaExpressao = `(${sinal.expression}) onde t = t - ${factor}`;
        nomeTransformacao = `Deslocado em ${factor}s`;
        break;
      case 'compress':
        novaExpressao = `(${sinal.expression}) onde t = ${factor} * t`;
        nomeTransformacao = `${factor}× Comprimido`;
        break;
      case 'expand':
        novaExpressao = `(${sinal.expression}) onde t = t / ${factor}`;
        nomeTransformacao = `${factor}× Expandido`;
        break;
    }

    const novoSinal: Signal = {
      id: crypto.randomUUID(),
      name: `${sinal.name} (${nomeTransformacao})`,
      expression: novaExpressao,
      samplingRate: sinal.samplingRate,
      startTime: sinal.startTime,
      endTime: sinal.endTime
    };

    onAddSignal(novoSinal);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
      <div className="flex items-center mb-4">
        <Wand2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transformações de Sinais</h2>
      </div>

      <form onSubmit={performTransformation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sinal</label>
          <select
            value={signalId}
            onChange={(e) => setSignalId(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transformação</label>
          <select
            value={transformation}
            onChange={(e) => setTransformation(e.target.value as SignalTransformation)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
          >
            <option value="amplify">Amplificar</option>
            <option value="attenuate">Atenuar</option>
            <option value="shift">Deslocamento no Tempo</option>
            <option value="compress">Compressão Temporal</option>
            <option value="expand">Expansão Temporal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fator</label>
          <input
            type="number"
            value={factor}
            onChange={(e) => setFactor(Number(e.target.value))}
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-2 py-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Aplicar Transformação
        </button>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Transformação aplicada com sucesso!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
