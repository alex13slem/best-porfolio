import type { ComponentProps, FC } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';

interface Props extends ComponentProps<FC> {
  title: string;
  description: string;
  deleteDialogIsOpen: boolean;
  setDeleteDialogIsOpen: (open: boolean) => void;
  handleDelete: () => void;
}

const TableDeleteAlert: FC<Props> = ({
  title,
  description,
  deleteDialogIsOpen,
  setDeleteDialogIsOpen,
  handleDelete,
}) => {
  return (
    <AlertDialog open={deleteDialogIsOpen} onOpenChange={setDeleteDialogIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TableDeleteAlert;
