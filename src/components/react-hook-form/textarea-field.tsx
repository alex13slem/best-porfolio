import type { TextareaHTMLAttributes } from 'react';
import type {
  Control,
  FieldError,
  Path,
  FieldValues,
} from 'react-hook-form';
import { FormField, FormItem, FormControl } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface Props<T extends FieldValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error: FieldError | undefined;
}

const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  className,
}: Props<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem error={error} className={className}>
        <FormControl>
          <Textarea
            {...field}
            placeholder={label}
            value={(field.value as string) || ''}
            invalid={!!error}
            className="resize-none h-full"
          />
        </FormControl>
      </FormItem>
    )}
  />
);

export default TextareaField;
