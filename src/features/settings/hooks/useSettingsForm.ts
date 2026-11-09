import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsStore, DEFAULT_STORE_SETTINGS } from '../store/useSettingsStore';
import { StoreGeneralSettings } from '../types/settings.types';
import { toast } from '@/store/useToastStore';

export const useSettingsForm = () => {
  const {
    settings,
    isLoading,
    fetchSettings,
    saveSettings,
    resetToDefaults,
  } = useSettingsStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<StoreGeneralSettings>({
    defaultValues: settings,
    mode: 'onTouched',
  });

  // Cargar configuración real del backend al montar
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sincronizar el formulario cuando lleguen los datos del backend
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const watchedValues = watch();

  const onSubmit = async (data: StoreGeneralSettings) => {
    try {
      await saveSettings(data);
      reset(data);
      toast.success(
        'Configuración Guardada',
        'Los datos de la tienda online fueron sincronizados y guardados en el servidor con éxito.'
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo guardar la configuración';
      toast.error('Error al guardar', message);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        '¿Deseas restablecer los datos de la tienda a los valores iniciales?'
      )
    ) {
      await resetToDefaults();
      reset(DEFAULT_STORE_SETTINGS);
      toast.info(
        'Valores Restablecidos',
        'Se han restaurado los datos predeterminados en el servidor.'
      );
    }
  };

  const handleLogoChange = async (newLogoUrl: string) => {
    setValue('logoUrl', newLogoUrl, { shouldDirty: true });
    try {
      await saveSettings({ logoUrl: newLogoUrl });
      toast.success(
        'Logotipo Actualizado',
        'El nuevo logo fue guardado en el servidor y ya está visible en la tienda.'
      );
    } catch {
      toast.error('Error', 'No se pudo guardar el logotipo en el servidor.');
    }
  };

  const handleResetLogo = async () => {
    setValue('logoUrl', DEFAULT_STORE_SETTINGS.logoUrl, { shouldDirty: true });
    try {
      await saveSettings({ logoUrl: DEFAULT_STORE_SETTINGS.logoUrl });
      toast.info('Logo Predeterminado', 'Se restauró el logo oficial.');
    } catch {
      toast.error('Error', 'No se pudo restaurar el logo en el servidor.');
    }
  };

  return {
    form: {
      control,
      handleSubmit,
      watchedValues,
      isDirty,
      isSubmitting: isSubmitting || isLoading,
      errors,
    },
    actions: {
      onSubmit,
      handleReset,
      handleLogoChange,
      handleResetLogo,
    },
  };
};
