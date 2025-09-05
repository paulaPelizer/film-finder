# 🎬 Film Finder

Aplicação em **React + Vite + TypeScript** que consome a API do [OMDb](https://www.omdbapi.com/) para buscar filmes, ver detalhes e gerenciar favoritos.

---

## ✨ Funcionalidades
- 🔎 Busca por título (10 resultados por página)  
- 📑 Paginação  
- 🎥 Página de detalhes (diretor, elenco, sinopse, avaliação, etc.)  
- ⭐ Lista de favoritos persistida em `localStorage`  
- 🖼️ Fallback automático de pôster quando a imagem quebra  
- ⚡ Tratamento de erros e estado de *loading*

---

## 📂 Estrutura
film-finder/
├─ public/ # assets estáticos (placeholder, ícones)
├─ src/
│ ├─ components/ # Navbar, MovieCard, Pagination
│ ├─ lib/ # api.ts, img.ts, useLocalStorage.ts
│ ├─ pages/ # Search, Details, Favorites
│ ├─ types/ # Tipagens da OMDb
│ └─ main.tsx
├─ .env.example # modelo da chave OMDb
├─ vite.config.mts # config do Vite (base + proxies em dev)
└─ package.json

yaml
Copiar código

---

## ⚙️ Configuração

### 1) Clonar o repositório
```bash
git clone https://github.com/paulaPelizer/film-finder.git
cd film-finder
2) Instalar dependências
bash
Copiar código
npm install
3) Configurar o .env
Crie um arquivo .env na raiz com sua chave OMDb:

ini
Copiar código
VITE_OMDB_API_KEY=SUA_CHAVE_AQUI
Gere uma chave gratuita em omdbapi.com/apikey.aspx

▶️ Rodar localmente
bash
Copiar código
npm run dev
Acesse em: http://localhost:5173

