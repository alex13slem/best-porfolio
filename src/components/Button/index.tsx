import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import type { VariantStyles } from './types';
import { variantsCss } from './styles';

interface Props extends ComponentProps<FC>, HTMLAttributes<HTMLButtonElement> {
  variant?: VariantStyles;
}

const Button: FC<Props> = ({ className, children, variant = 'bordered' }) => {
  return (
    <button
      className={twMerge(
        variantsCss.root[variant],
        `cursor-pointer rounded-full font-medium text-base group z-0`,
        className
      )}
    >
      <span
        className={twMerge(
          variantsCss.text[variant],
          `inline-block px-7 py-3 rounded-full z-10 relative`
        )}
      >
        {children}
      </span>
      <i className={twMerge(variantsCss.i[variant])} />
    </button>
  );
};

export default Button;
