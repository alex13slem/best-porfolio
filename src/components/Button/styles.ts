import type { VariantsCss } from './types';

export const variantsCss: VariantsCss = {
  root: {
    bordered: `
      relative z-10 p-[2px] 
      overflow-hidden
      text-cyangrey 
      animate-gradient__activeXs animate-gradient__rotate`,
    fill: `
      text-black 
      transition-all duration-200 hover:-translate-y-1`,
  },

  text: {
    bordered: `bg-darkgrey`,
    fill: ` colors__gradient `,
  },
  i: {
    fill: `
      bg-black bg-opacity-40 transition-all duration-200 
      opacity-0 group-hover:opacity-100 w-2/3 h-[8px] absolute 
      -bottom-1 left-1/2 -z-1 -translate-x-1/2 blur-md`,
    bordered: ``,
  },
};
