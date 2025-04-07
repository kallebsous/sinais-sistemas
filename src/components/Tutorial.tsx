import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';

const tutorialContent = `
# Tutorial de processamento de sinais

## Introdução

1. **Criação de sinais**
   - Entre com uma expressão matemática para criar um sinal
   - Use 't' como variável de tempo
   - Defina o intervalo de tempo e a taxa de amostragem
   - Exemplos:
     - Senoide: \`sin(2*pi*t)\`
     - Onda quadrada: \`sign(sin(2*pi*t))\`
     - Exponencial: \`exp(-t)\`
2. **Operações com sinais**
   - Adicionar sinais: A(t) + B(t)
   - Multiplicar sinais: A(t) * B(t)
   - Convoluir sinais: Combina dois sinais     
    - Correlacionar sinais: Mede a similaridade
3. **Transformações de sinais**
    - Ampliar/Atenuar: Muda a magnitude do sinal
    - Deslocar no tempo: Move o sinal para a esquerda/direita
    - Comprimir/Expandir: Escala o eixo do tempo
4. **Análise**
    - Visão no domínio do tempo: Sinal vs tempo
    - Domínio da frequência: Componentes do sinal
    - Propriedades: Energia, potência, simetria
## Dicas
- Use funções matemáticas padrão: sin, cos, exp, log
- Combine sinais para criar formas de onda complexas
- Salve seu trabalho regularmente
- Exporte gráficos para documentação
- Consulte a documentação para mais detalhes
`;

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Tutorial({ isOpen, onClose }: TutorialProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
              Tutorial
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="prose prose-blue max-h-[70vh] overflow-y-auto">
            <ReactMarkdown>{tutorialContent}</ReactMarkdown>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}