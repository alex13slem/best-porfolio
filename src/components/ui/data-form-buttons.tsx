import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { Button } from './button';
import { navigate } from 'astro:transitions/client';
import { cn } from '../../lib/utils';

interface Props
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLDivElement> {
  category: string;
}

const DataFormButtons: FC<Props> = ({
  className,
  category,
  ...props
}) => {
  return (
    <footer className={cn('flex gap-2', className)} {...props}>
      <Button
        variant="outline"
        type="button"
        onClick={() => navigate('/admin/' + category)}
      >
        Назад
      </Button>
      <Button variant="default" type="submit">
        Сохранить
      </Button>
    </footer>
  );
};

export default DataFormButtons;
