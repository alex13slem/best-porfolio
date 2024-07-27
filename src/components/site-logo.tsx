import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import '@/assets/fonts/shadows-into-light-font.css';

interface Props extends ComponentProps<FC>, HTMLAttributes<HTMLSpanElement> {}

const SiteLogo: FC<Props> = ({ className }) => {
  return (
    <span
      className={twMerge(
        `
        font-logo text-2xl text-transparent font-bold
        bg-clip-text bg-gradient-to-r from-cyan to-cyan via-yellow
        logo-animation`,
        className
      )}
    >
      alex13slem
    </span>
  );
};

export default SiteLogo;
