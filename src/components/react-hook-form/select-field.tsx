import type { HTMLAttributes } from 'react';
import type {
  FieldValues,
  Control,
  FieldError,
  Path,
} from 'react-hook-form';
import { FormField, FormItem, FormControl } from '../ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';

export type SelectOption = {
  label: string;
  value: string;
};

interface Props<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  error: FieldError | undefined;
  options: SelectOption[];
}

export const SelectField = <T extends FieldValues>({
  control,
  name,
  placeholder,
  error,
  options,
  className,
}: Props<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem error={error} className={className}>
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />
);
