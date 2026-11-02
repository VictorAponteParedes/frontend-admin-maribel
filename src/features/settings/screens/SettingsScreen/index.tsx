import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Store,
  Building2,
  FileBadge,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Clock,
  Instagram,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ControlledInput } from '@/components/ui/ControlledInput';
import { useSettingsStore, DEFAULT_STORE_SETTINGS } from '../../store/useSettingsStore';
import { StoreGeneralSettings } from '../../types/settings.types';
import { StoreFooterPreviewCard } from '../../components/StoreFooterPreviewCard';
import { LogoUploader } from '../../components/LogoUploader';
import { toast } from '@/store/useToastStore';

export const StoreSettingsScreen: React.FC = () => {
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <span>Sistema</span>
            <span>/</span>
            <span>Configuración</span>
            <span>/</span>
            <span className="text-maribel-700 font-semibold">Datos de la Tienda (Web)</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight flex items-center gap-2">
            Datos de la Tienda & Footer Web
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Personaliza la información institucional, redes sociales, horarios y contacto que verán tus clientes en la página web.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer todo</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer ${
              isDirty
                ? 'bg-maribel-700 hover:bg-maribel-800 shadow-maribel-700/20'
                : 'bg-stone-800 hover:bg-stone-900'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card 1: Identidad de la Marca & Tienda Web */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-rose-50 text-maribel-700 rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Identidad Comercial & Presentación Web
                  </h3>
                  <p className="text-xs text-stone-500">
                    Nombre visible en el encabezado y descripción de la tienda
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ControlledInput
                  name="tradeName"
                  control={control}
                  label="Nombre de la Tienda (Marca Comercial) *"
                  placeholder="Ej. Maribel Tienda de Regalos"
                  leftIcon={<Store className="w-4 h-4 text-stone-400" />}
                  rules={{
                    required: 'El nombre de la tienda es obligatorio',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  }}
                  helperText="Nombre principal desplegado en la web y footer"
                />

                <ControlledInput
                  name="storeBio"
                  control={control}
                  label="Slogan o Resumen de la Tienda (Visible en Footer) *"
                  placeholder="Ej. Perfumería fina, fragancias exclusivas y detalles especiales..."
                  leftIcon={<Sparkles className="w-4 h-4 text-stone-400" />}
                  rules={{
                    required: 'La descripción breve de la tienda es obligatoria',
                  }}
                  helperText="Frase breve que explica tu catálogo a los visitantes"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ControlledInput
                    name="legalName"
                    control={control}
                    label="Razón Social / Nombre del Titular *"
                    placeholder="Ej. Maribel Escriva"
                    leftIcon={<Building2 className="w-4 h-4 text-stone-400" />}
                    rules={{
                      required: 'El nombre del titular o razón social es obligatorio',
                    }}
                    helperText="Aparece en el pie legal del sitio"
                  />

                  <ControlledInput
                    name="taxId"
                    control={control}
                    label="RUC Paraguay *"
                    placeholder="Ej. 4815234-7"
                    leftIcon={<FileBadge className="w-4 h-4 text-stone-400" />}
                    rules={{
                      required: 'El RUC es obligatorio',
                    }}
                    helperText="Número de RUC para transparencia comercial"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Contacto & Pedidos por WhatsApp */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Canales de Contacto Directo & Pedidos
                  </h3>
                  <p className="text-xs text-stone-500">
                    Números donde tus clientes harán pedidos y consultas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ControlledInput
                  name="whatsappNumber"
                  control={control}
                  label="WhatsApp Oficial para Pedidos *"
                  placeholder="Ej. 0986 314 630"
                  leftIcon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
                  rules={{
                    required: 'El número de WhatsApp es requerido',
                  }}
                  helperText="Enlace directo en el botón flotante y footer web"
                />

                <ControlledInput
                  name="businessPhone"
                  control={control}
                  label="Teléfono Comercial / Llamadas"
                  placeholder="Ej. 0986 314 630"
                  leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
                  rules={{
                    required: 'El teléfono de contacto es requerido',
                  }}
                  helperText="Línea secundaria de atención al cliente"
                />
              </div>
            </div>

            {/* Card 3: Ubicación Física del Local & Retiros */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Local Físico & Ubicación para Retiros
                  </h3>
                  <p className="text-xs text-stone-500">
                    Dirección que verán los clientes para ubicar la tienda
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ControlledInput
                  name="address"
                  control={control}
                  label="Dirección del Local *"
                  placeholder="Ej. Avda. Dr. Francia e/ Tte. Herrero"
                  leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
                  rules={{
                    required: 'La dirección es obligatoria',
                  }}
                  helperText="Calle, número de local o referencias clave"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ControlledInput
                    name="city"
                    control={control}
                    label="Ciudad / Departamento *"
                    placeholder="Ej. Pedro Juan Caballero"
                    rules={{
                      required: 'La ciudad es requerida',
                    }}
                  />

                  <ControlledInput
                    name="country"
                    control={control}
                    label="País *"
                    placeholder="Paraguay"
                    rules={{
                      required: 'El país es requerido',
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <ControlledInput
                    name="mapsUrl"
                    control={control}
                    label="Enlace de Google Maps (Cómo llegar)"
                    placeholder="https://maps.google.com/?q=..."
                    leftIcon={<Globe className="w-4 h-4 text-stone-400" />}
                    helperText="Enlace que abre Google Maps en el celular del cliente"
                  />
                  {watchedValues.mapsUrl && (
                    <div className="pt-1">
                      <a
                        href={watchedValues.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Probar enlace de Maps en pestaña nueva</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 4: Horarios, Redes Sociales & Pie de Página */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Horarios de Atención & Redes Sociales
                  </h3>
                  <p className="text-xs text-stone-500">
                    Información complementaria visible al pie de la página
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ControlledInput
                  name="openingHours"
                  control={control}
                  label="Horarios de Atención al Público *"
                  placeholder="Ej. Lunes a Sábados: 07:30 a 19:30 hs"
                  leftIcon={<Clock className="w-4 h-4 text-stone-400" />}
                  rules={{
                    required: 'Los horarios de atención son requeridos',
                  }}
                  helperText="Horarios en los que los clientes pueden retirar productos"
                />

                <ControlledInput
                  name="instagramUrl"
                  control={control}
                  label="Perfil de Instagram *"
                  placeholder="https://instagram.com/maribel_tiendaderegalos"
                  leftIcon={<Instagram className="w-4 h-4 text-rose-500" />}
                  rules={{
                    required: 'El perfil de Instagram es requerido',
                  }}
                  helperText="Enlace para que los clientes te sigan en redes"
                />

                <ControlledInput
                  name="footerCopyright"
                  control={control}
                  label="Texto de Derechos / Copyright en Footer *"
                  placeholder="Ej. © 2026 Maribel Tienda de Regalos. Todos los derechos reservados."
                  rules={{
                    required: 'El texto de copyright es requerido',
                  }}
                  helperText="Línea final al pie de la tienda del cliente"
                />
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cambios guardados localmente y reflejados en tiempo real.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-maribel-700 hover:bg-maribel-800 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar y Publicar en Web</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sticky Aside with Logo Uploader & Real-Time Web Footer Preview (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          {/* Logo Manager */}
          <LogoUploader
            currentLogoUrl={watchedValues.logoUrl || '/logo-maribel.png'}
            onLogoChange={handleLogoChange}
            onResetDefault={handleResetLogo}
          />

          {/* Live Store Footer Preview */}
          <StoreFooterPreviewCard settings={watchedValues} />
        </div>
      </div>
    </div>
  );
};

export const SettingsScreen = StoreSettingsScreen;
