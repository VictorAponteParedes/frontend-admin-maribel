import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { CustomerSelect } from '../CustomerSelect';
import { useSaleFormModal } from './hooks';
import { SaleFormModalHeader } from './SaleFormModalHeader';
import { SaleFormLinkedOrderBanner } from './SaleFormLinkedOrderBanner';
import { SaleFormProductScanner } from './SaleFormProductScanner';
import { SaleFormCartList } from './SaleFormCartList';
import { SaleFormModalFooter } from './SaleFormModalFooter';

export const SaleFormModal: React.FC = () => {
  const { state, refs, actions } = useSaleFormModal();

  if (!state.isCreateModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs select-none">
        {/* Backdrop para cerrar al hacer clic afuera */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={actions.closeCreateModal}
          className="fixed inset-0"
        />

        {/* Drawer Lateral desde la derecha */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        >
          {/* Header */}
          <SaleFormModalHeader
            isLinkedOrder={Boolean(state.pendingOrderSale)}
            onClose={actions.closeCreateModal}
          />

          {/* Cuerpo Scrolleable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {state.errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.errorMessage}</span>
              </div>
            )}

            {state.successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{state.successMessage}</span>
              </div>
            )}

            {/* Banner de Pedido Vinculado */}
            {state.pendingOrderSale && (
              <SaleFormLinkedOrderBanner
                pendingOrderSale={state.pendingOrderSale}
              />
            )}

            {/* Buscador / Escáner de Productos */}
            <SaleFormProductScanner
              searchInput={state.searchInput}
              onSearchChange={(val) => {
                actions.setSearchInput(val);
                actions.setIsSearchingLive(true);
              }}
              onClearSearch={() => {
                actions.setSearchInput('');
                actions.setIsSearchingLive(false);
              }}
              searchInputRef={refs.searchInputRef}
              onSubmit={actions.handleScanSubmit}
              isSearchingLive={state.isSearchingLive}
              liveSearchResults={state.liveSearchResults}
              quickProducts={state.products}
              cartItems={state.cartItems}
              onAddToCart={actions.handleAddToCart}
            />

            {/* Lista del Carrito */}
            <SaleFormCartList
              cartItems={state.cartItems}
              totalQuantity={state.totalQuantity}
              onUpdateQuantity={actions.handleUpdateQuantity}
              onRemoveItem={actions.handleRemoveItem}
              onClearCart={actions.handleClearCart}
            />

            {/* Selección de Cliente */}
            <div className="pt-2 border-t border-stone-100">
              <CustomerSelect
                selectedCustomer={state.selectedCustomer}
                onSelectCustomer={actions.setSelectedCustomer}
                customers={state.customers}
              />
            </div>
          </div>

          {/* Footer Sticky */}
          <SaleFormModalFooter
            cartItemsCount={state.cartItems.length}
            totalQuantity={state.totalQuantity}
            totalAmount={state.totalAmount}
            onClose={actions.closeCreateModal}
            onSaveSale={actions.handleSaveSale}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SaleFormModal;
