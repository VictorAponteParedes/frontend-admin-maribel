import { useForm } from 'react-hook-form';
import { useSettingsStore, DEFAULT_STORE_SETTINGS } from '../store/useSettingsStore';
import { StoreGeneralSettings } from '../types/settings.types';
import { toast } from '@/store/useToastStore';

export const useSettingsForm = () => {
  const { settings, updateSettings, resetToDefaults } = useSettingsStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<StoreGeneralSettings>({
    defaultValues: settings,
    mode: 'onTouched',
  });

  const watchedValues = watch();

  const onSubmit = (data: StoreGeneralSettings) => {
    updateSettings(data);
    toast.success('Configuración Guardada', 'Los datos de la tienda online fueron actualizados con éxito.');
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer los datos de la tienda a los valores iniciales?')) {
      resetToDefaults();
      reset(DEFAULT_STORE_SETTINGS);
      toast.info('Valores Restablecidos', 'Se han restaurado los datos predeterminados.');
    }
  };

  const handleLogoChange = (newLogoUrl: string) => {
    setValue('logoUrl', newLogoUrl, { shouldDirty: true });
    updateSettings({ logoUrl: newLogoUrl });
    toast.success('Logotipo Actualizado', 'El nuevo logo ya está visible en la tienda.');
  };

  const handleResetLogo = () => {
    setValue('logoUrl', DEFAULT_STORE_SETTINGS.logoUrl, { shouldDirty: true });
    updateSettings({ logoUrl: DEFAULT_STORE_SETTINGS.logoUrl });
    toast.info('Logo Predeterminado', 'Se restauró el logo oficial.');
  };

  return {
    form: {
      control,
      handleSubmit,
      watchedValues,
      isDirty,
      isSubmitting,
    },
    actions: {
      onSubmit,
      handleReset,
      handleLogoChange,
      handleResetLogo,
    },
  };
};
