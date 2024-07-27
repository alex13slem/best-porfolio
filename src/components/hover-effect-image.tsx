import React, {
  useEffect,
  useRef,
  forwardRef,
  type ComponentProps,
  type FC,
  type HTMLAttributes,
} from 'react';
import hoverEffect from 'hover-effect';

/**
 * HoverEffectProps определяет свойства для компонента HoverEffect.
 * @property {string} image1 - URL первой картинки.
 * @property {string} image2 - URL второй картинки.
 * @property {string} displacementImage - URL изображения для перехода.
 * @property {number} [intensity1=0.1] - Интенсивность эффекта искажения для первой картинки.
 * @property {number} [intensity2=0.1] - Интенсивность эффекта искажения для второй картинки.
 * @property {number} [angle2=Math.PI / 2] - Угол эффекта искажения для второй картинки.
 * @property {number} [imagesRatio=9 / 16] - Соотношение сторон изображений.
 */
interface HoverEffectProps
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLDivElement> {
  image1: string;
  image2: string;
  displacementImage: string;
  intensity1?: number;
  intensity2?: number;
  angle2?: number;
  imagesRatio?: number;
}

/**
 * Компонент HoverEffect для применения эффекта наведения между двумя изображениями.
 * @param {HoverEffectProps} props - Свойства для компонента.
 * @returns {JSX.Element} Отрисованный компонент HoverEffect.
 */
const HoverEffectImage = forwardRef<HTMLDivElement, HoverEffectProps>(
  (
    {
      image1,
      image2,
      displacementImage,
      intensity1 = 0.1,
      intensity2 = 0.1,
      angle2 = Math.PI / 2,
      imagesRatio = 9 / 16,
      ...props
    }: HoverEffectProps,
    ref
  ): JSX.Element => {
    const localRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const currentRef = ref
        ? (ref as React.RefObject<HTMLDivElement>)
        : localRef;

      if (currentRef.current) {
        try {
          new hoverEffect({
            parent: currentRef.current,
            intensity1,
            intensity2,
            angle2,
            image1,
            image2,
            displacementImage,
            imagesRatio,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }, [
      ref,
      image1,
      image2,
      displacementImage,
      intensity1,
      intensity2,
      angle2,
      imagesRatio,
    ]);

    return <div ref={ref || localRef} {...props} />;
  }
);

export default HoverEffectImage;
