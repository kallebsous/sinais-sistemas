import React from 'react';
import { Book } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';

const documentationContent = `
# Documentação de Processamento de Sinais
## Funções Matemáticas	

### Funções Básicas
- \`sin(x)\`, \`cos(x)\`, \`tan(x)\`: Funções trigonométricas
- \`exp(x)\`: Função exponencial
- \`log(x)\`: Logaritmo natural
- \`sqrt(x)\`: Raiz quadrada
- \`abs(x)\`: Valor absoluto
- \`sign(x)\`: Função sinal (-1, 0 ou 1)

### Constantes
- \`pi\`: π (3.14159...)
- \`e\`: Número de Euler (2.71828...)

### Operações de Sinal
- Adição: \`A(t) + B(t)\`
- Multiplicação: \`A(t) * B(t)\`
- Divisão: \`A(t) / B(t)\`
- Potência: \`A(t)^2\`

### Sinais Comuns
1. Onda Senoidal
   \`\`\`
   sin(2*pi*f*t)
   f = frequência em Hz
   \`\`\`
2. Onda Quadrada
   \`\`\`
   sign(sin(2*pi*f*t))  
3. Exponencial Decaimento
   \`\`\`
   exp(-alpha*t)
   alpha = taxa de decaimento
   \`\`\`
4. Pulso Gaussiano
   \`\`\`
   exp(-(t-t0)^2/(2*sigma^2)) 

### Métodos de Análise
  ## Domínio do Tempo
- Visualização de forma de onda
- Detecção de picos
- Cruzamentos zero
### Domínio da Frequência
- Análise de espectro
- Componentes de frequência
- Largura de banda  

### Propriedades do Sinal
- Energia: Integral do sinal ao quadrado
- Potência: Energia média por unidade de tempo
- Simetria: Características par/ímpar
- Periodicidade: Padrões repetitivos

`;

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Documentation({ isOpen, onClose }: DocumentationProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center">
              <Book className="w-6 h-6 text-blue-600 mr-2" />
              Documentação
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
            <ReactMarkdown>{documentationContent}</ReactMarkdown>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}