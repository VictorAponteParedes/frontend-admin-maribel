import React, { useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { toast } from '@/store/useToastStore';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { SettingsHeader } from '../../components/SettingsHeader';
import {
  StoreSettingsTabs,
  STORE_SETTINGS_TABS,
} from '../../components/StoreSettingsTabs';
import { StoreIdentitySection } from '../../components/StoreIdentitySection';
import { StoreAnnouncementSection } from '../../components/StoreAnnouncementSection';
import { StoreContactSection } from '../../components/StoreContactSection';
import { StoreLocationSection } from '../../components/StoreLocationSection';
import { StoreHoursAndSocialSection } from '../../components/StoreHoursAndSocialSection';
import { SettingsFormActions } from '../../components/SettingsFormActions';
import { LogoUploader } from '../../components/LogoUploader';
import { StoreFooterPreviewCard } from '../../components/StoreFooterPreviewCard';
import { StoreGeneralSettings, StoreSettingsTabId } from '../../types/settings.types';

export const StoreSettingsScreen: React.FC = () => {
  const { form, actions } = useSettingsForm();
  const [activeTab, setActiveTab] = useState<StoreSettingsTabId>('identity');

  // Redirige automáticamente a la pestaña que contenga el primer error de validación
  const handleFormError = (errors: FieldErrors<StoreGeneralSettings>) => {
    const tabWithError = STORE_SETTINGS_TABS.find((tab) =>
      tab.fields.some((field) => Boolean(errors[field]))
    );
    if (tabWithError) {
      setActiveTab(tabWithError.id);
      toast.warning(
        'Campos incompletos',
        `Revisa los campos obligatorios en "${tabWithError.shortLabel}".`
      );
    }
  };

  const handleValidSubmit = form.handleSubmit(actions.onSubmit, handleFormError);

  // Stepper para navegación fluida entre pestañas
  const currentIndex = STORE_SETTINGS_TABS.findIndex((tab) => tab.id === activeTab);
  const prevTab = currentIndex > 0 ? STORE_SETTINGS_TABS[currentIndex - 1] : null;
  const nextTab =
    currentIndex < STORE_SETTINGS_TABS.length - 1
      ? STORE_SETTINGS_TABS[currentIndex + 1]
      : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <SettingsHeader
        onReset={actions.handleReset}
        onSubmit={handleValidSubmit}
        isDirty={form.isDirty}
        isSubmitting={form.isSubmitting}
      />

      {/* Pestañas de Navegación */}
      <StoreSettingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        errors={form.errors}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleValidSubmit} className="space-y-6">
            <div className={activeTab === 'identity' ? 'block' : 'hidden'}>
              <StoreIdentitySection control={form.control} />
            </div>

            <div className={activeTab === 'announcement' ? 'block' : 'hidden'}>
              <StoreAnnouncementSection control={form.control} />
            </div>

            <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
              <StoreContactSection control={form.control} />
            </div>

            <div className={activeTab === 'location' ? 'block' : 'hidden'}>
              <StoreLocationSection
                control={form.control}
                mapsUrl={form.watchedValues.mapsUrl}
              />
            </div>

            <div className={activeTab === 'hours_social' ? 'block' : 'hidden'}>
              <StoreHoursAndSocialSection control={form.control} />
            </div>

            {/* Stepper entre pestañas */}
            <div className="flex items-center justify-between pt-1">
              {prevTab ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  onClick={() => setActiveTab(prevTab.id)}
                  className="text-stone-600 hover:text-stone-900"
                >
                  <span>Anterior: {prevTab.shortLabel}</span>
                </Button>
              ) : (
                <div />
              )}

              {nextTab && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab(nextTab.id)}
                  className="text-stone-600 hover:text-stone-900 ml-auto flex items-center gap-1.5"
                >
                  <span>Siguiente: {nextTab.shortLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <SettingsFormActions isSubmitting={form.isSubmitting} />
          </form>
        </div>

        {/* Aside with Logo Uploader & Real-Time Web Footer Preview (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <LogoUploader
            currentLogoUrl={form.watchedValues.logoUrl || '/logo-maribel.png'}
            onLogoChange={actions.handleLogoChange}
            onResetDefault={actions.handleResetLogo}
          />

          <StoreFooterPreviewCard settings={form.watchedValues} />
        </div>
      </div>
    </div>
  );
};

export const SettingsScreen = StoreSettingsScreen;
