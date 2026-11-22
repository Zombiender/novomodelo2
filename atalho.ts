/**
 * Atalho global para mostrar a ilha quando ela está escondida.
 * A combinação é gravada pelo próprio Rust (captura global, funciona com outros apps em foco)
 * e salva no localStorage para ser reaplicada a cada abertura.
 */
import { invoke } from "@tauri-apps/api/core";

const CHAVE_STORAGE = "aura_atalho";

const ROTULOS: Record<string, string> = {
  ControlLeft: "Ctrl", ControlRight: "Ctrl", ShiftLeft: "Shift", ShiftRight: "Shift",
  Alt: "Alt", AltGr: "AltGr", MetaLeft: "Win", MetaRight: "Win",
  Space: "Espaço", Return: "Enter", Escape: "Esc", Backspace: "Backspace", Tab: "Tab",
  CapsLock: "Caps", UpArrow: "↑", DownArrow: "↓", LeftArrow: "←", RightArrow: "→",
  PageUp: "PgUp", PageDown: "PgDn",
};

export function rotuloTecla(nome: string): string {
  if (ROTULOS[nome]) return ROTULOS[nome];
  if (/^Key[A-Z]$/.test(nome)) return nome.slice(3);
  if (/^Num\d$/.test(nome)) return nome.slice(3);
  return nome;
}

export function rotuloAtalho(teclas: string[]): string {
  return teclas.length ? teclas.map(rotuloTecla).join(" + ") : "Nenhum";
}

function carregarSalvo(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_STORAGE) ?? "[]");
  } catch {
    return [];
  }
}

declare global {
  interface Window {
    auraAtalhoTeclas?: () => string[];
    auraAtalhoRotulo?: (teclas: string[]) => string;
    auraAtalhoDefinir?: (teclas: string[]) => void;
    auraAtalhoGravar?: (aoFim: (teclas: string[]) => void, aoEstado: (estado: string) => void) => void;
  }
}

async function gravar(aoFim: (t: string[]) => void, aoEstado: (e: string) => void): Promise<void> {
  try {
    await invoke("gravar_atalho");
    aoEstado("Pressione a combinação de teclas… (15 s)");
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 150));
      const teclas = await invoke<string[] | null>("atalho_gravado");
      if (teclas && teclas.length) {
        window.auraAtalhoDefinir?.(teclas);
        aoFim(teclas);
        return;
      }
      // feedback ao vivo: mostra as teclas que o app está lendo neste momento
      const segurando = await invoke<string[]>("teclas_pressionadas").catch(() => [] as string[]);
      if (segurando.length) aoEstado(`Detectando: ${segurando.map(rotuloTecla).join(" + ")}`);
    }
    await invoke("cancelar_gravacao");
    aoEstado("Tempo esgotado. Tente gravar de novo.");
  } catch (e) {
    console.error("Erro ao gravar atalho:", e);
    aoEstado("Não consegui gravar o atalho.");
  }
}

export function iniciarAtalho(): void {
  window.auraAtalhoTeclas = carregarSalvo;
  window.auraAtalhoRotulo = rotuloAtalho;
  window.auraAtalhoDefinir = (teclas) => {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(teclas));
    invoke("definir_atalho", { teclas }).catch((e) => console.error("Atalho:", e));
  };
  window.auraAtalhoGravar = (aoFim, aoEstado) => void gravar(aoFim, aoEstado);

  // Reaplica o atalho salvo ao iniciar
  window.auraAtalhoDefinir(carregarSalvo());
}
