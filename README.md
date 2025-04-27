# Sinais e Sistemas

<p align="center">
  <img src="src/logo.png" alt="Logo do Projeto" width="150" />
</p>

**Sinais e Sistemas** é uma aplicação web interativa voltada para o ensino e exploração de conceitos de sinais e sistemas. Desenvolvida com **React**, **TypeScript** e **Vite**, oferece ferramentas para entrada, manipulação, análise e visualização de sinais, além de recursos educacionais como tutoriais e documentação.

## 🎯 Objetivo do Projeto

Este projeto visa facilitar o aprendizado de sinais e sistemas por meio de uma interface amigável e interativa. Estudantes e entusiastas podem experimentar operações com sinais, visualizar resultados em tempo real e acessar materiais didáticos para aprofundar o conhecimento.

## ✨ Funcionalidades

- **Entrada de Sinais**: Crie e insira sinais personalizados.
- **Análise de Sinais**: Explore propriedades e comportamentos de sinais.
- **Operações com Sinais**: Realize operações como soma, subtração e mais.
- **Transformações**: Aplique transformações em sinais (detalhes no componente `SignalTransformations`).
- **Visualização**: Gráficos interativos para análise visual.
- **Tutoriais e Documentação**: Recursos educacionais integrados.

## 📂 Estrutura do Projeto

```
├── .gitignore              # Arquivos ignorados pelo Git
├── eslint.config.js        # Configuração do ESLint
├── home
│   └── project
│       └── index.html      # Página HTML do projeto
├── index.html              # Página HTML principal
├── package-lock.json       # Lockfile do npm
├── package.json            # Dependências e scripts
├── postcss.config.js       # Configuração do PostCSS
├── src
│   ├── App.tsx             # Componente principal
│   ├── components
│   │   ├── Documentation.tsx  # Documentação educacional
│   │   ├── SignalAnalysis.tsx # Análise de sinais
│   │   ├── SignalInput.tsx   # Entrada de sinais
│   │   ├── SignalOperations.tsx # Operações com sinais
│   │   ├── SignalPlot.tsx    # Visualização de sinais
│   │   ├── SignalTransformations.tsx # Transformações de sinais
│   │   └── Tutorial.tsx      # Tutoriais interativos
│   ├── index.css           # Estilos globais
│   ├── logo.png            # Logo do projeto
│   ├── main.tsx            # Ponto de entrada
│   ├── types.ts            # Tipos TypeScript
│   └── vite-env.d.ts       # Declarações do Vite
├── tailwind.config.js      # Configuração do Tailwind CSS
├── tsconfig.app.json       # Configuração TypeScript (app)
├── tsconfig.json           # Configuração TypeScript (geral)
├── tsconfig.node.json      # Configuração TypeScript (Node)
└── vite.config.ts            # Configuração do Vite
```

## 🚀 Primeiros Passos

### Pré-requisitos

- **Node.js** (v18+)
- **npm** (incluído com Node.js)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/kallebsous/sinais-sistemas.git
   ```

2. Entre no diretório:
   ```bash
   cd sinais-sistemas
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Scripts

- **Desenvolvimento**:
  ```bash
  npm run dev
  ```
  Acesse em `http://localhost:5173`.

- **Build**:
  ```bash
  npm run build
  ```
  Gera arquivos otimizados em `dist`.

- **Preview**:
  ```bash
  npm run preview
  ```
  Visualiza o build localmente.

- **Lint**:
  ```bash
  npm run lint
  ```
  Verifica o código com ESLint.

## 🛠️ Tecnologias

- **React**: Interfaces dinâmicas e reativas.
- **TypeScript**: Código robusto com tipagem.
- **Vite**: Build rápido e moderno.
- **Tailwind CSS**: Estilização prática e responsiva.
- **ESLint**: Qualidade e consistência do código.
- **PostCSS**: Processamento de CSS.

## 🤝 Como Contribuir

1. Faça um **fork** do repositório.
2. Crie uma branch:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Minha feature"
   ```
4. Envie para o remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request**.

Siga as diretrizes de código (ESLint, TypeScript) e descreva suas alterações no PR.

## 📜 Licença

Licenciado sob a [MIT License](LICENSE).

## 📬 Contato

Dúvidas ou sugestões? Abra uma [issue](https://github.com/kallebsous/sinais-sistemas/issues) ou conecte-se pelo GitHub.

---

🌟 **Gostou do projeto? Dê uma estrela no repositório e compartilhe com a comunidade!** 🌟
