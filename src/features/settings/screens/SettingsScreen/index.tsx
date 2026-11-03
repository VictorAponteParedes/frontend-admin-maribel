import React from 'react';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { SettingsHeader } from '../../components/SettingsHeader';
import { StoreIdentitySection } from '../../components/StoreIdentitySection';
import { StoreContactSection } from '../../components/StoreContactSection';
import { StoreLocationSection } from '../../components/StoreLocationSection';
import { StoreHoursAndSocialSection } from '../../components/StoreHoursAndSocialSection';
import { SettingsFormActions } from '../../components/SettingsFormActions';
import { LogoUploader } from '../../components/LogoUploader';
import { StoreFooterPreviewCard } from '../../components/StoreFooterPreviewCard';

export const StoreSettingsScreen: React.FC = () => {
  const { form, actions } = useSettingsForm();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <SettingsHeader
        onReset={actions.handleReset}
        onSubmit={form.handleSubmit(actions.onSubmit)}
        isDirty={form.isDirty}
        isSubmitting={form.isSubmitting}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={form.handleSubmit(actions.onSubmit)} className="space-y-6">
            <StoreIdentitySection control={form.control} />
            <StoreContactSection control={form.control} />
            <StoreLocationSection
              control={form.control}
              mapsUrl={form.watchedValues.mapsUrl}
            />
            <StoreHoursAndSocialSection control={form.control} />
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
