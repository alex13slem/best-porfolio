import MDEditor from '@uiw/react-md-editor';
import type { HTMLAttributes } from 'react';
import type { FieldValues, Control, FieldError, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import FormTitle from './form-title';

interface Props<T extends FieldValues>
  extends HTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error: FieldError | undefined;
}

const MDEditorField = <T extends FieldValues>({
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
        <FormLabel asChild>
          <FormTitle>{label}</FormTitle>
        </FormLabel>
        <FormControl>
          <MDEditor {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

export default MDEditorField;
