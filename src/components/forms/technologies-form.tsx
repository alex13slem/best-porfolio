import {
  useEffect,
  type ComponentProps,
  type FC,
  type HTMLAttributes,
} from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  insertFormTechnologiesSchema,
  updateFormTechnologiesSchema,
  type InsertFormTechnology,
} from '@/schemas/db/technologies';
import { twMerge } from 'tailwind-merge';
import InputField from '../react-hook-form/input-field';
import MDEditorField from '../react-hook-form/md-editor-field';
import ImageField from '../react-hook-form/image-field';
import { navigate } from 'astro:transitions/client';
import { technologiesService } from '@/lib/services/technologiesService';
import type { FieldError } from 'react-hook-form';
import DataFormButtons from '../ui/data-form-buttons';
import { getSlugifyValue } from '@/lib/utils';
import type { SelectTechnology } from '@/db/schema';

interface Props
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLFormElement> {
  imagePlaceholder?: string;
  method: 'create' | 'edit';
  defaultValues?: SelectTechnology;
}

const TechnologiesForm: FC<Props> = ({
  className,
  imagePlaceholder,
  method,
  defaultValues,
  ...props
}) => {
  const form = useForm<InsertFormTechnology>({
    resolver: zodResolver(
      method === 'create'
        ? insertFormTechnologiesSchema
        : updateFormTechnologiesSchema
    ),
    defaultValues: {
      ...defaultValues,
      image: undefined,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  useEffect(() => {
    const generatedSlug = getSlugifyValue(watch('name'));
    setValue('slug', generatedSlug);
  }, [watch('name'), setValue]);

  const onSubmit: SubmitHandler<InsertFormTechnology> = async (
    data
  ) => {
    const result =
      method === 'create'
        ? await technologiesService.create(data)
        : await technologiesService.update(
            defaultValues?.slug!,
            data,
            defaultValues!
          );

    if (!result.success) {
      return console.error(
        `Error ${
          method === 'create' ? 'creating' : 'updating'
        } technology:`,
        result.errors
      );
    }
    navigate('/admin/technologies');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={twMerge(
          'grid grid-cols-1 md:grid-cols-2 gap-4',
          className
        )}
        noValidate
        {...props}
      >
        <div className="col-span-1 flex flex-col gap-4">
          {['name', 'slug', 'link', 'iconifyId'].map((field) => (
            <InputField
              key={field}
              control={control}
              name={field as keyof InsertFormTechnology}
              label={getFieldLabel(field)}
              error={
                errors[
                  field as keyof InsertFormTechnology
                ] as FieldError
              }
              type={field === 'link' ? 'url' : 'text'}
              className="col-span-1"
            />
          ))}
        </div>

        <div className="col-span-1">
          <ImageField
            control={control}
            defaultValue={defaultValues?.image}
            name="image"
            error={errors.image as FieldError}
            onUpload={(file) => setValue('image', file)}
            label={getFieldLabel('image')}
            className="col-span-1"
          />
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-4">
          {['description', 'body'].map((field) => (
            <MDEditorField
              key={field}
              control={control}
              name={field as keyof InsertFormTechnology}
              label={getFieldLabel(field)}
              error={
                errors[
                  field as keyof InsertFormTechnology
                ] as FieldError
              }
              className="col-span-1"
            />
          ))}
        </div>

        <DataFormButtons
          category="technologies"
          className="col-span-2 mt-2 justify-end"
        />
      </form>
    </Form>
  );
};

const getFieldLabel = (field: string) => {
  switch (field) {
    case 'name':
      return 'Название технологии';
    case 'slug':
      return 'Slug';
    case 'link':
      return 'Ссылка на официальный сайт';
    case 'iconifyId':
      return 'Идентификатор иконки (Iconify ID)';
    case 'description':
      return 'Краткое описание';
    case 'body':
      return 'Детальное описание';
    case 'image':
      return 'Изображение';
    default:
      return '';
  }
};

export default TechnologiesForm;
