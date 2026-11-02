import {
  useController,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';
import { AppInput, AppInputProps } from '@/components/ui/AppInput';

export interface ControlledInputProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<AppInputProps, 'name' | 'defaultValue'> {}

export const ControlledInput = <T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  helperText,
  leftIcon,
  ...inputProps
}: ControlledInputProps<T>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
  });

  return (
    <AppInput
      {...inputProps}
      ref={ref}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      label={label}
      helperText={helperText}
      leftIcon={leftIcon}
      error={error?.message}
    />
  );
};
