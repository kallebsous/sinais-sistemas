import React, { useState } from 'react';
import { SignalInput } from './components/SignalInput';
import { SignalPlot } from './components/SignalPlot';
import { SignalAnalysis } from './components/SignalAnalysis';
import { SignalOperations } from './components/SignalOperations';
import { SignalTransformations } from './components/SignalTransformations';
import { Tutorial } from './components/Tutorial';
import { Documentation } from './components/Documentation';
import { 
  RadioTower as Waveform, 
  Activity, 
  Save, 
  Download, 
  Trash2,
  HelpCircle,
  Book,
  Upload,
  Image,
  Sun,
  Moon
} from 'lucide-react';
import html2canvas from 'html2canvas';
import type { Signal, PlotType } from './types';
import { useTheme } from './contexts/ThemeContext';
import { useNotification } from './contexts/NotificationContext';

function App() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { addNotification } = useNotification();

  const handleAddSignal = (signal: Signal) => {
    setSignals(prev => [...prev, signal]);
    if (!selectedSignal) {
      setSelectedSignal(signal);
    }
    addNotification(`Sinal "${signal.name}" adicionado com sucesso`, 'success');
  };

  const handleRemoveSignal = (id: string) => {
    const signalToRemove = signals.find(s => s.id === id);
    setSignals(prev => prev.filter(signal => signal.id !== id));
    if (selectedSignal?.id === id) {
      setSelectedSignal(signals[0] || null);
    }
    if (signalToRemove) {
      addNotification(`Sinal "${signalToRemove.name}" removido`, 'info');
    }
  };

  const handleSaveSignals = () => {
    const data = JSON.stringify(signals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sinais.json';
    a.click();
    URL.revokeObjectURL(url);
    
    addNotification('Sinais salvos com sucesso', 'success');
  };

  const handleLoadSignals = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedSignals = JSON.parse(e.target?.result as string);
        setSignals(loadedSignals);
        if (loadedSignals.length > 0) {
          setSelectedSignal(loadedSignals[0]);
        }
        addNotification(`${loadedSignals.length} sinais carregados com sucesso`, 'success');
      } catch (error) {
        console.error('Erro ao carregar sinais:', error);
        addNotification('Erro ao carregar arquivo de sinais. Verifique o formato do arquivo.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExportPlot = async () => {
    const plotElement = document.querySelector('.js-plotly-plot');
    if (!plotElement) return;

    try {
      const canvas = await html2canvas(plotElement as HTMLElement);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'grafico-sinal.png';
      a.click();
      addNotification('Gráfico exportado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao exportar gráfico:', error);
      addNotification('Erro ao exportar gráfico. Tente novamente.', 'error');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Waveform className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Análise de Sinais</h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Tutorial
              </button>
              <button
                onClick={() => setShowDocs(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Book className="w-4 h-4 mr-1" />
                Documentação
              </button>
              <label className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                <Upload className="w-4 h-4 mr-1" />
                Carregar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleLoadSignals}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSaveSignals}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </button>
              {signals.length > 0 && (
                <button
                  onClick={handleExportPlot}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Image className="w-4 h-4 mr-1" />
                  Exportar Gráfico
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SignalInput onAddSignal={handleAddSignal} />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Lista de Sinais</h2>
              <div className="space-y-2">
                {signals.map(signal => (
                  <div
                    key={signal.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <button
                      onClick={() => setSelectedSignal(signal)}
                      className={`flex-1 text-left ${
                        selectedSignal?.id === signal.id ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {signal.name}
                    </button>
                    <button
                      onClick={() => handleRemoveSignal(signal.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <SignalOperations signals={signals} onAddSignal={handleAddSignal} />
            <SignalTransformations signals={signals} onAddSignal={handleAddSignal} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Visualização do Sinal</h2>
               
              </div>

              {signals.length > 0 ? (
                <SignalPlot signals={signals} darkMode={darkMode} />
              ) : (
                <div className="flex items-center justify-center h-[500px] bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <Activity className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Adicione sinais para visualizá-los aqui
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedSignal && (
              <SignalAnalysis signal={selectedSignal} />
            )}
          </div>
        </div>
      </main>

      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <Documentation isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
}

export default App;
