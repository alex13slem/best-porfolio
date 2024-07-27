import { useRef, type HTMLAttributes } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

interface Props<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  error: FieldError | undefined;
}

const MultipleBagesSelect = <T extends FieldValues>({
  control,
  name,
  placeholder,
  error,
  className,
}: Props<T>) => {
  const epithetInput = useRef<HTMLInputElement>(null);

  const addBadge = (field: any) => {
    if (!epithetInput.current) return;

    const newValue = epithetInput.current.value.trim();
    if (newValue) {
      field.onChange([...field.value, newValue]);
      epithetInput.current.value = '';
    }
  };

  const removeBadge = (field: any, value: string) => {
    field.onChange(field.value.filter((v: string) => v !== value));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={className}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  ref={epithetInput}
                  placeholder={placeholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBadge(field);
                    }
                  }}
                  invalid={!!error}
                />
                {error && (
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer absolute top-0 bottom-0 right-3 flex items-center">
                      ❗
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p>{error.message}</p>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
              <Button type="button" onClick={() => addBadge(field)}>
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2 empty:mt-0">
              {field.value.map((v: string) => (
                <Badge
                  key={v}
                  deletable
                  onClick={() => removeBadge(field, v)}
                >
                  {v}
                </Badge>
              ))}
            </div>
          </FormLabel>
          <FormControl>
            <select hidden multiple {...field}>
              {field.value.length ? (
                field.value.map((v: string) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  {placeholder || 'Ничего не выбрано'}
                </option>
              )}
            </select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default MultipleBagesSelect;
