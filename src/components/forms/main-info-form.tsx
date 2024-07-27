import {
  type ComponentProps,
  type FC,
  type FormHTMLAttributes,
} from 'react';
import { Form } from '../ui/form';
import {
  useForm,
  type FieldError,
  type SubmitHandler,
} from 'react-hook-form';
import {
  insertFormMainInfoSchema,
  updateFormMainInfoSchema,
  type InsertFormMainInfo,
} from '@/schemas/db/main-info';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../react-hook-form/input-field';
import { Button } from '../ui/button';
import MultipleBagesSelect from '../react-hook-form/multiple-bages-select';
import MDEditorField from '../react-hook-form/md-editor-field';
import TextareaField from '../react-hook-form/textarea-field';
import ImageField from '../react-hook-form/image-field';
import FormTitle from '../react-hook-form/form-title';
import { cn } from '@/lib/utils';
import { mainInfoService } from '@/lib/services/mainInfoService';
import type { SelectMainInfo } from '@/db/schema';
import { useToast } from '../ui/use-toast';

interface Props
  extends ComponentProps<FC>,
    FormHTMLAttributes<HTMLFormElement> {
  method: 'create' | 'edit';
  defaultValues?: SelectMainInfo;
}

const MainInfoForm: FC<Props> = ({
  defaultValues,
  method,
  className,
  ...props
}) => {
  const { toast } = useToast();
  const form = useForm<InsertFormMainInfo>({
    resolver: zodResolver(
      method === 'create'
        ? insertFormMainInfoSchema
        : updateFormMainInfoSchema
    ),
    defaultValues: {
      ...defaultValues,
      openGraphImage: undefined,
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = form;

  const onSubmit: SubmitHandler<InsertFormMainInfo> = async (
    data
  ) => {
    const result =
      method === 'create'
        ? await mainInfoService.create(data)
        : await mainInfoService.update(
            data.id!,
            data,
            defaultValues!
          );
    if (!result.success) {
      console.error(
        `Error ${
          method === 'create' ? 'creating' : 'updating'
        } project:`,
        result.errors
      );
      toast({
        variant: 'destructive',
        title: 'Не удалось сохранить',
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn('grid gap-4 grid-cols-12', className)}
        {...props}
      >
        <section className="col-span-12">
          <FormTitle level="h2">SEO</FormTitle>
          <div className="grid grid-cols-2 grid-flow-col grid-rows-[auto_1fr] gap-4">
            <InputField
              control={control}
              name="siteName"
              label={getFieldLabel('siteName')}
              error={errors.siteName}
              className="col-start-1"
            />
            <TextareaField
              control={control}
              name="siteDescription"
              label={getFieldLabel('siteDescription')}
              error={errors.siteDescription}
              className="col-start-1"
            />
            <ImageField
              defaultValue={defaultValues?.openGraphImage}
              control={control}
              name="openGraphImage"
              label={getFieldLabel('openGraphImage')}
              error={errors.openGraphImage}
              onUpload={(file) => {
                setValue('openGraphImage', file);
              }}
              className="row-span-2"
            />
          </div>
        </section>

        <section className="col-span-12">
          <FormTitle level="h2">Главный экран</FormTitle>
          <div className="grid gap-4 grid-cols-2">
            <MDEditorField
              control={control}
              name="heroGreeting"
              label={getFieldLabel('heroGreeting')}
              error={errors.heroGreeting}
              className="col-span-2"
            />
            <MultipleBagesSelect
              control={control}
              name="heroEpithets"
              placeholder={getFieldLabel('heroEpithets')}
              error={errors.heroEpithets as FieldError}
              className="col-span-1"
            />
            <TextareaField
              control={control}
              name="aboutHero"
              label={getFieldLabel('aboutHero')}
              error={errors.aboutHero}
              className="col-span-1 min-h-40"
            />
          </div>
        </section>

        <section className="col-span-12">
          <FormTitle level="h2">Контакты</FormTitle>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              control={control}
              name="email"
              type="email"
              error={errors.email}
              label={getFieldLabel('email')}
            />
            <InputField
              control={control}
              name="phone"
              type="tel"
              error={errors.phone}
              label={getFieldLabel('phone')}
            />
          </div>
        </section>
        <Button type="submit" className="col-start-11 col-span-2">
          Сохранить
        </Button>
      </form>
    </Form>
  );
};

const getFieldLabel = (field: string) => {
  switch (field) {
    case 'email':
      return 'Электронная почта';
    case 'phone':
      return 'Телефон';
    case 'heroEpithets':
      return 'Эпитеты';
    case 'heroGreeting':
      return 'Приветственный текст';
    case 'aboutHero':
      return 'Обо мне';
    case 'siteName':
      return 'Название сайта';
    case 'siteDescription':
      return 'Описание сайта';
    case 'openGraphImage':
      return 'Изображение для OpenGraph';

    default:
      return '';
  }
};

export default MainInfoForm;
