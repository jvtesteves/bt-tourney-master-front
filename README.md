# BT Tourney Master - Frontend

Este é o frontend da aplicação de gestão de torneios de Beach Tennis, construído com **Vue 3**, **Vite** e **TypeScript**.

## 📋 Visão Geral do Projeto

A aplicação fornece uma plataforma completa com áreas distintas para **Organizadores** e **Jogadores**, permitindo:

- Criação e gestão de torneios
- Inscrição de jogadores
- Acompanhamento do progresso dos torneios

O estado da aplicação é gerido localmente através de **stores reativas** e persistido no `localStorage`, simulando uma base de dados local.

## 🛠️ Stack de Tecnologias

- **Vue 3** – Usando a Composition API e `<script setup>`
- **Vite** – Build rápido e servidor de desenvolvimento
- **TypeScript** – Tipagem estática para maior robustez
- **Vue Router** – Roteamento com proteção de rotas
- **ESLint** – Garantia de qualidade e consistência do código

## 💻 Configuração de Ambiente Recomendada

- **IDE**: Visual Studio Code (VSCode)
- **Extensões sugeridas**:
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) – Substitui o Vetur, recomendado para Vue 3
  - ESLint – Para linting do código

## ⚙️ Instalação e Configuração do Projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   ```

````

2. **Navegue para a pasta do frontend:**

   ```bash
   cd bt-tourney-master/frontend
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

## 📦 Scripts Disponíveis

### Iniciar o Servidor de Desenvolvimento

Compila a aplicação e inicia com hot-reload:

```bash
npm run dev
```

### Compilar para Produção

Compila e minifica a aplicação. Os arquivos finais estarão na pasta `dist/`:

```bash
npm run build
```

### Verificar o Código com ESLint

Executa o linting para verificar formatação e possíveis problemas:

```bash
npm run lint
```

---

Feito com ❤️ para a comunidade de Beach Tennis.

```
````
