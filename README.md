# Sistema de Gerenciamento de Demandas

Aplicação React com scroll infinito para visualização de demandas.

## Tecnologias utilizadas

- React 18.2.0
- TypeScript
- Material UI
- React Virtuoso (para scroll infinito)
- Tailwind CSS
- Vite

## Funcionalidades

- Tabela de demandas com scroll infinito
- Carregamento progressivo de dados
- Indicadores visuais de progresso
- Interface responsiva e moderna

## Requisitos

- Node.js 14+
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## API Endpoints

A aplicação consome dados do seguinte endpoint:

```
GET http://localhost:3000/demands?cursor=&limit=10
```

## Estrutura do Projeto

```
smi-frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── hooks/           # Custom hooks
│   ├── services/        # Serviços de API
│   ├── types/           # Definições de tipos TypeScript
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
├── public/              # Arquivos estáticos
└── ... arquivos de configuração
```