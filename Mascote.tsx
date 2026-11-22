/**
 * Mascote Cubee (recortado do avatar original, fundo transparente, sem invólucro).
 * Cada expressão é um PNG em public/mascote/. Trocar `expressao` remonta a imagem
 * e toca uma transição curta de entrada.
 */
import React from 'react';

export type ExpressaoMascote =
  | 'idle' | 'listening' | 'thinking' | 'working' | 'success' | 'error'
  | 'permission' | 'pending' | 'denied' | 'notification' | 'dancing'
  | 'sleeping' | 'dizzy' | 'swallow' | 'poked';

interface MascoteProps {
  expressao?: ExpressaoMascote;
  altura?: number;
  className?: string;
}

export function Mascote({ expressao = 'idle', altura = 20, className = '' }: MascoteProps) {
  return (
    <img
      key={expressao}
      src={`/mascote/${expressao}.png`}
      alt=""
      draggable={false}
      className={`mascote-anim pointer-events-none select-none block shrink-0 ${className}`}
      style={{ height: altura, width: 'auto' }}
    />
  );
}

/**
 * Escolhe a expressão pelo estado real do app (ordem de prioridade).
 */
export function expressaoDaIlha(p: {
  aprovacaoPendente: boolean;
  alerta: boolean;
  estadoAssistente: 'ocioso' | 'ouvindo' | 'pensando' | 'falando';
  tocando: boolean;
  flash: ExpressaoMascote | null;
}): ExpressaoMascote {
  if (p.flash) return p.flash;
  if (p.aprovacaoPendente) return 'pending';
  if (p.alerta) return 'notification';
  if (p.estadoAssistente === 'ouvindo') return 'listening';
  if (p.estadoAssistente === 'pensando') return 'thinking';
  if (p.estadoAssistente === 'falando') return 'working';
  if (p.tocando) return 'dancing';
  return 'idle';
}
