/**
 * Dígitos de relógio com animação "caindo de cima para baixo" (estilo timer do iPhone).
 * Cada dígito é remontado (key) só quando o valor muda, então só o que mudou anima.
 */
import React from 'react';

function Digito({ valor }: { valor: string }) {
  return (
    <span key={valor} className="digito-cai inline-block tabular-nums">
      {valor}
    </span>
  );
}

export function TempoRolante({ segundos, className = '' }: { segundos: number; className?: string }) {
  const s = Math.max(0, Math.floor(segundos));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return (
    <div
      className={`flex items-center justify-center font-semibold tracking-tight text-white leading-none ${className}`}
      style={{ perspective: '240px' }}
      aria-label={`${mm}:${ss}`}
    >
      <Digito valor={mm[0]} />
      <Digito valor={mm[1]} />
      <span className="px-[2px] pb-[6px] text-zinc-400">:</span>
      <Digito valor={ss[0]} />
      <Digito valor={ss[1]} />
    </div>
  );
}
