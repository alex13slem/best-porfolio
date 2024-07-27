import { type HTMLAttributes, type ChangeEvent, useState } from 'react';
import type { FieldValues, Control, FieldError, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import phd from '@/assets/img/placeholder.png';
import FormTitle from './form-title';

interface Props<T extends FieldValues> extends HTMLAttributes<HTMLDivElement> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error: FieldError | undefined;
  onUpload: (file: File) => void;
}
const ImageField = <T extends FieldValues>({
  control,
  name,
  error,
  label,
  defaultValue,
  onUpload,
  className,
}: Props<T>) => {
  const [uploadedImage, setUploadedImage] = useState<string>(
    (defaultValue as string) || phd.src
  );

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem error={error} className={className}>
          <FormTitle>{label}</FormTitle>
          <FormLabel className="w-full cursor-pointer">
            <img
              src={uploadedImage}
              alt="Uploaded image"
              loading="lazy"
              className=" w-full aspect-video object-cover object-center rounded-md h-[244px]"
            />
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ImageField;
