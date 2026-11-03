import React from 'react';

export const LoginBrandingPanel: React.FC = () => {
  return (
    <div className="md:col-span-5 relative bg-gradient-to-b from-[#8B1229] via-[#6F0B1F] to-[#450412] p-8 lg:p-10 flex flex-col justify-between overflow-hidden text-white min-h-[420px] md:min-h-full">
      {/* Círculos decorativos de fondo con resplandor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Izquierdo: Logo y Título */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-md">
          <img
            src="/logo-maribel.png"
            alt="Maribel Haute Parfumerie"
            className="w-full h-full object-contain drop-shadow"
          />
        </div>
        <div>
          <h2 className="font-serif font-bold text-white tracking-[0.22em] text-sm leading-tight">
            MARIBEL
          </h2>
          <p className="text-[9px] font-medium tracking-[0.16em] text-rose-200/80 uppercase mt-0.5">
            BACKOFFICE • HAUTE PARFUMERIE
          </p>
        </div>
      </div>

      {/* Gráfico Central: Medallón de Lujo con Logo Oficial de Maribel */}
      <div className="relative z-10 my-auto py-8 flex items-center justify-center">
        {/* Anillos orbitales decorativos */}
        <div className="absolute w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute w-52 h-52 rounded-full border border-rose-300/25 border-dashed pointer-events-none animate-[spin_60s_linear_infinite]" />

        {/* Chispas y destellos decorativos */}
        <span className="absolute -top-1 right-10 text-rose-300/80 text-xs select-none">✦</span>
        <span className="absolute bottom-4 left-8 text-rose-300/60 text-[10px] select-none">✦</span>
        <span className="absolute top-8 left-6 w-1.5 h-1.5 rounded-full bg-rose-200/70" />
        <span className="absolute bottom-12 right-6 w-1.5 h-1.5 rounded-full bg-rose-200/70" />

        {/* Medallón Glassmorphism de Lujo */}
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full border border-white/30 bg-gradient-to-b from-white/20 via-white/5 to-black/40 backdrop-blur-md p-2 flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.4)] group">
          <div className="absolute inset-1 rounded-full border border-rose-300/30 pointer-events-none" />

          <div className="w-full h-full rounded-full overflow-hidden border border-white/30 shadow-2xl flex items-center justify-center bg-maribel-900">
            <img
              src="/logo-maribel.png"
              alt="Maribel Haute Parfumerie & Regalos"
              className="w-full h-full object-cover rounded-full filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Pie Izquierdo: Mensaje y Paginación decorativa */}
      <div className="relative z-10 space-y-3">
        <h1 className="text-2xl lg:text-3xl font-serif font-normal text-white tracking-tight leading-snug">
          ¡Bienvenida a la Maison!
        </h1>
        <p className="text-xs text-rose-100/75 leading-relaxed font-light max-w-sm">
          Plataforma integral de gestión de existencias, pedidos de regalos personalizados y ventas exclusivas de tienda.
        </p>

        {/* Indicadores decorativos */}
        <div className="flex items-center space-x-2 pt-2">
          <span className="w-6 h-1.5 bg-white rounded-full transition-all" />
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
