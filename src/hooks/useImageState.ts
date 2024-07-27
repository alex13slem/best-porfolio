import { useState, type ChangeEvent } from 'react';

const useImageState = (defaultValue: string = '') => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setValue: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(URL.createObjectURL(file));
    }
  };

  return { imageUrl, setImageUrl, handleImageUpload };
};

export default useImageState;
