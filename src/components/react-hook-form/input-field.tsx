import type { InputHTMLAttributes } from 'react';
import type {
  Control,
  FieldError,
  Path,
  FieldValues,
} from 'react-hook-form';
import { FormField, FormItem, FormControl } from '../ui/form';
import { Input } from '../ui/input';

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error: FieldError | undefined;
  type?: string;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  type = 'text',
  className,
}: Props<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem error={error} className={className}>
        <FormControl>
          <Input
            {...field}
            placeholder={label}
            value={(field.value as string) || ''}
            invalid={!!error}
            type={type}
          />
        </FormControl>
      </FormItem>
    )}
  />
);

export default InputField;
