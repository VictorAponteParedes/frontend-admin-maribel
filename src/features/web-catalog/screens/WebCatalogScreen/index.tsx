import React, { useState } from 'react';
import { Sparkles, Gift, ExternalLink, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useWebCatalogStore } from '../../store/useWebCatalogStore';
import { IndividualProductsTab } from '../../components/IndividualProductsTab';
import { CombosCreatorTab } from '../../components/CombosCreatorTab';

type CatalogTab = 'individual' | 'combos';

export const WebCatalogScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CatalogTab>('individual');

  const products = useWebCatalogStore((state) => state.products);
  const combos = useWebCatalogStore((state) => state.combos);

  const publishedProductsCount = products.filter((p) => p.isWebVisible).length;
  const activeCombosCount = combos.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      <Header
        title="Catálogo Web & Combos"
        subtitle="Administra qué perfumes de tu inventario se exhiben en la tienda web y crea sets de regalo irresistibles."
        action={
          <a
            href="https://web-maribel-perfum.onrender.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-maribel-700 text-white hover:bg-maribel-800 transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Tienda Online</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        }
      />

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('individual')}
          className={`relative pb-3.5 px-4 font-medium text-sm flex items-center gap-2.5 transition-colors ${
            activeTab === 'individual'
              ? 'text-maribel-900 border-b-2 border-maribel-700 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-maribel-700" />
          <span>🧴 Fragancias Individuales</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'individual'
                ? 'bg-maribel-100 text-maribel-800 font-semibold'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {publishedProductsCount} en web
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('combos')}
          className={`relative pb-3.5 px-4 font-medium text-sm flex items-center gap-2.5 transition-colors ${
            activeTab === 'combos'
              ? 'text-maribel-900 border-b-2 border-maribel-700 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Gift className="w-4 h-4 text-maribel-700" />
          <span>🎁 Creador de Combos & Sets</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'combos'
                ? 'bg-rose-100 text-maribel-800 font-semibold'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {activeCombosCount} activos
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'individual' ? (
          <IndividualProductsTab />
        ) : (
          <CombosCreatorTab />
        )}
      </div>
    </div>
  );
};

export default WebCatalogScreen;
