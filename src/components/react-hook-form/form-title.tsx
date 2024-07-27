import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<FC>, HTMLAttributes<HTMLDivElement> {
  level?: 'h2' | 'h3';
}

const FormTitle: FC<Props> = ({ level = 'h3', className, ...props }) => {
  const Tag = level;
  const style = (level: 'h2' | 'h3') => {
    switch (level) {
      case 'h2':
        return 'text-xl';
      case 'h3':
        return 'text-md';
    }
  };
  return <Tag className={cn(style(level), 'mb-2', className)} {...props} />;
};

export default FormTitle;
