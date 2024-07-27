import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/react-hook-form/input-field';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { login } from '@/lib/services/auth/login';
import { authSchema } from '@/schemas/api/auth';
import { navigate } from 'astro:transitions/client';
import { useToast } from '../ui/use-toast';

interface Props
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLDivElement> {
  type: 'login' | 'register';
}

const AuthForm: FC<Props> = ({ type, className, ...props }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    if (type === 'login') {
      const { success } = await login(values);
      if (success) {
        navigate('/admin');
      } else {
        console.error('Login failed');
        toast({
          variant: 'destructive',
          title: 'Не удалось войти',
        });
      }
    }
    if (type === 'register') {
      // Registration logic goes here
      // console.log('Registering user', values);
    }
  };

  const title = type === 'login' ? 'Войти' : 'Регистрация';

  return (
    <div
      {...props}
      className={cn(
        'max-w-96 border border-white border-opacity-15 p-4 rounded-md',
        className
      )}
    >
      <h1 className="text-2xl text-center mb-5">{title}</h1>
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            control={control}
            name="email"
            type="email"
            error={errors.email}
            label="Email"
          />
          <InputField
            control={control}
            name="password"
            type="password"
            error={errors.password}
            label="Password"
          />
          <Button className="justify-self-center" type="submit">
            {title}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
