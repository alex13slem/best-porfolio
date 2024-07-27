import { useState, type FC, type FormEvent } from 'react';
import Button from './ui/firm-button';
import axios from 'axios';
import { useToast } from './ui/use-toast';

const BuildTriggerButton: FC = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const { toast } = useToast();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast({
      title: 'Запуск сборки',
    });
    try {
      await axios.post('/api/trigger-build');
      toast({
        title: 'Сборка запущена',
      });
      setDisabled(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Не удалось запустить сборку',
      });
    }
  }
  return (
    <form onSubmit={handleSubmit} className="contents">
      <Button disabled={disabled}>Запустить сборку</Button>
    </form>
  );
};

export default BuildTriggerButton;
