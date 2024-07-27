import {
  type ComponentProps,
  type FC,
  type HTMLAttributes,
} from 'react';
import { socialsEnum, type SelectSocial } from '@/db/schema/socials';
import {
  insertFormSocialsSchema,
  updateFormSocialsSchema,
  type InsertFormSocial,
} from '@/schemas/db/socials';
import {
  useForm,
  type FieldError,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { navigate } from 'astro:transitions/client';
import { socialsService } from '@/lib/services/socialsService';
import { Form } from '../ui/form';
import { cn } from '@/lib/utils';
import InputField from '../react-hook-form/input-field';

import {
  SelectField,
  type SelectOption,
} from '../react-hook-form/select-field';
import DataFormButtons from '../ui/data-form-buttons';

interface Props
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLFormElement> {
  method: 'create' | 'edit';
  defaultValues?: SelectSocial;
}

const SocialsForm: FC<Props> = ({
  defaultValues,
  method,
  className,
  ...props
}) => {
  const form = useForm<InsertFormSocial>({
    resolver: zodResolver(
      method === 'create'
        ? insertFormSocialsSchema
        : updateFormSocialsSchema
    ),
    defaultValues: defaultValues,
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form;

  const slugOptions: SelectOption[] = Object.values(
    socialsEnum.enumValues
  ).map((value) => ({
    label: value,
    value: value,
  }));

  const onSubmit: SubmitHandler<InsertFormSocial> = async (data) => {
    const result =
      method === 'create'
        ? await socialsService.create(data)
        : await socialsService.update(
            data.slug,
            data,
            defaultValues!
          );
    if (!result.success) {
      // console.log(result);

      console.error(
        `Error ${
          method === 'create' ? 'creating' : 'updating'
        } socials:`,
        result.errors
      );
      return;
    }
    navigate('/admin/socials');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn('grid grid-cols-1 gap-4 max-w-96', className)}
        {...props}
      >
        <SelectField
          control={control}
          name="slug"
          placeholder={getFieldLabel('slug')}
          error={errors.slug}
          options={slugOptions}
        />
        {['name', 'url', 'iconifyId'].map((field) => (
          <InputField
            key={field}
            name={field as keyof InsertFormSocial}
            control={control}
            label={getFieldLabel(field)}
            error={
              errors[field as keyof InsertFormSocial] as FieldError
            }
            type={['url'].includes(field) ? 'url' : 'text'}
          />
        ))}
        <DataFormButtons category="socials" className="" />
      </form>
    </Form>
  );
};

const getFieldLabel = (field: string) => {
  switch (field) {
    case 'name':
      return 'Название';
    case 'slug':
      return 'Slug';
    case 'url':
      return 'Ссылка';
    case 'iconifyId':
      return 'Iconify ID';
    default:
      return '';
  }
};

export default SocialsForm;
