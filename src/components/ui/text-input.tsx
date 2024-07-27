import {
  forwardRef,
  type ComponentProps,
  type FC,
  type InputHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

interface Props
  extends ComponentProps<FC>,
    InputHTMLAttributes<HTMLInputElement> {}

const TextInput: FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          'px-2 py-1  rounded-sm w-full bg-darkgrey',
          className
        )}
        {...props}
      />
    );
  }
);

export default TextInput;
