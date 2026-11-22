# Aura — protótipo 1 (lógica) + visual do "outro modelo"

## O que mudou em relação ao primeiro protótipo
- `index.html` (visual antigo + simuladores) foi trocado por um `#root` React; o visual vem do outro modelo
  (`src/ui/App.tsx`, Tailwind). Fundo e painel de simulação foram removidos; a janela continua transparente.
- `src/main.ts`: só ganhou `montarUI()`. Todo o resto (voz, Gemini, ações, overlay, atalho) é o do protótipo.
- `src/core/preferencias.ts` (novo): chave do Gemini, Spotify e formato da ilha salvos no app (têm prioridade sobre o `.env`).
  `config.ts`, `ia.ts`, `spotify.ts`, `acoes.ts`, `orquestrador.ts`, `reconhecimento.ts` passaram a ler a chave na hora do uso.
- `src/core/letras.ts` (LRCLIB), `capa.ts` (iTunes), `spotify-vinculo.ts` (login PKCE), `arquivos.ts` (novos).
- `src/core/overlay.ts`: removido o trecho dos botões laterais da ilha antiga.
- Rust (`src-tauri/src/lib.rs`): novos comandos `info_arquivos`, `revelar_arquivo`, `abrir_url`, `clipboard_arquivos`,
  `midia_posicao`, `spotify_aguardar_codigo`; posição da mídia agora é corrigida pelo horário da última atualização.
  `Cargo.toml` (features Win32) e `capabilities/default.json` (lrclib.net, itunes.apple.com) ajustados.
- `package.json`/`vite.config.ts`/`tsconfig.json`: React, Tailwind 3, lucide-react e plugin do Vite.

## Spotify
Crie um app em developer.spotify.com, cadastre a Redirect URI `http://127.0.0.1:8898/callback`,
cole o Client ID em Configurações e clique em Vincular.
