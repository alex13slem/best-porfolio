import {
  useEffect,
  type ComponentProps,
  type FC,
  type FormHTMLAttributes,
} from 'react';
import {
  useForm,
  type FieldError,
  type SubmitHandler,
} from 'react-hook-form';
import {
  insertFormProjectsSchema,
  updateFormProjectsSchema,
  type InsertFormProject,
  type SelectProjectTransformed,
} from '@/schemas/db/projects';
import type { SelectTechnology } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import InputField from '../react-hook-form/input-field';
import MDEditorField from '../react-hook-form/md-editor-field';
import ImageField from '../react-hook-form/image-field';
import { navigate } from 'astro:transitions/client';
import { projectsService } from '@/lib/services/projectsService';
import { Checkbox } from '../ui/checkbox';
import DataFormButtons from '../ui/data-form-buttons';
import { getSlugifyValue } from '../../lib/utils';
import FormTitle from '../react-hook-form/form-title';
import { useToast } from '../ui/use-toast';

interface Props
  extends ComponentProps<FC>,
    FormHTMLAttributes<HTMLFormElement> {
  method: 'create' | 'edit';
  defaultValues?: SelectProjectTransformed;
  technologies: SelectTechnology[];
}

const ProjectForm: FC<Props> = ({
  className,
  method,
  defaultValues,
  technologies,
  ...props
}) => {
  const { toast } = useToast();
  const technologiesOptions = technologies.map((technology) => ({
    label: technology.name,
    value: technology.id,
  }));

  const defaultTechnologiesIds =
    defaultValues?.technologies.map((technology) => technology.id) ||
    [];

  const form = useForm<InsertFormProject>({
    resolver: zodResolver(
      method === 'create'
        ? insertFormProjectsSchema
        : updateFormProjectsSchema
    ),
    defaultValues: {
      ...defaultValues,
      thumbnailGreeting: undefined,
      thumbnailPreview: undefined,
      technologiesIds: defaultTechnologiesIds,
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

  const onSubmit: SubmitHandler<InsertFormProject> = async (data) => {
    const result =
      method === 'create'
        ? await projectsService.create(data)
        : await projectsService.update(
            defaultValues?.slug!,
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
      return toast({
        variant: 'destructive',
        title: 'Не удалось сохранить',
      });
    }
    navigate('/admin/projects');
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
          {['name', 'slug', 'role', 'siteLink', 'githubLink'].map(
            (field) => (
              <InputField
                key={field}
                control={control}
                name={field as keyof InsertFormProject}
                label={getFieldLabel(field)}
                error={
                  errors[
                    field as keyof InsertFormProject
                  ] as FieldError
                }
                type={
                  ['siteLink', 'githubLink'].includes(field)
                    ? 'url'
                    : 'text'
                }
                className="col-span-1"
              />
            )
          )}
        </div>

        <div className="col-span-1">
          <FormField
            control={control}
            name="technologiesIds"
            render={() => (
              <FormItem>
                <FormLabel asChild>
                  <FormTitle>Технологии</FormTitle>
                </FormLabel>
                <div className="columns-3">
                  {technologiesOptions.map((technology) => (
                    <FormField
                      key={technology.value}
                      name="technologiesIds"
                      render={({ field }) => (
                        <FormItem
                          key={technology.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(
                                  checked
                                    ? [
                                        ...field.value,
                                        technology.value,
                                      ]
                                    : field.value.filter(
                                        (value: number) =>
                                          value !== technology.value
                                      )
                                );
                              }}
                              defaultChecked={field.value.includes(
                                technology.value
                              )}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {technology.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          {['thumbnailGreeting', 'thumbnailPreview'].map((field) => (
            <ImageField
              key={field}
              control={control}
              defaultValue={(defaultValues as any)?.[field]}
              name={field as keyof InsertFormProject}
              error={
                errors[field as keyof InsertFormProject] as FieldError
              }
              onUpload={(file) =>
                setValue(field as keyof InsertFormProject, file)
              }
              label={getFieldLabel(field)}
              className="col-span-1"
            />
          ))}
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-4">
          {['description', 'body'].map((field) => (
            <MDEditorField
              key={field}
              control={control}
              name={field as keyof InsertFormProject}
              label={getFieldLabel(field)}
              error={
                errors[field as keyof InsertFormProject] as FieldError
              }
              className="col-span-1"
            />
          ))}
        </div>

        <DataFormButtons
          category="projects"
          className="col-span-2 mt-2 justify-end"
        />
      </form>
    </Form>
  );
};

const getFieldLabel = (field: string) => {
  switch (field) {
    case 'name':
      return 'Название проекта';
    case 'slug':
      return 'Slug';
    case 'role':
      return 'Роль в проекте';
    case 'siteLink':
      return 'Ссылка на демонстрационный сайт';
    case 'githubLink':
      return 'Ссылка на GitHub';
    case 'description':
      return 'Краткое описание';
    case 'body':
      return 'Детальное описание';
    case 'thumbnailPreview':
      return 'Превью';
    case 'thumbnailGreeting':
      return 'Приветствие';
    default:
      return '';
  }
};

export default ProjectForm;
