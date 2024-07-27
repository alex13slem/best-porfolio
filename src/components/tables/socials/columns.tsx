import type { ColumnDef } from '@tanstack/react-table';
import type { SelectSocial } from '@/db/schema/socials';
import { Icon } from '@iconify-icon/react';
import { socialsService } from '@/lib/services/socialsService';
import { useState } from 'react';
import { navigate } from 'astro:transitions/client';
import createDropDownActions from '@/lib/react-table/createDropDownAction';
import TableDeleteAlert from '../../react-table/table-delete-alert';
import TableDropdownMenu from '../../react-table/table-dropdown-menu';

export const columns: ColumnDef<SelectSocial>[] = [
  // Icon
  {
    accessorKey: 'iconifyId',
    header: 'Iconify Icon',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Icon
          icon={value}
          className="text-3xl leading-none text-white text-opacity-80"
        />
      );
    },
  },

  // Name
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-bold">{value}</span>;
    },
  },

  // URL
  {
    accessorKey: 'url',
    header: 'Ссылка',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    },
  },

  // Actions
  {
    id: 'actions',
    cell: ({ row }) => {
      const [deleteDialogIsOpen, setDeleteDialogIsOpen] =
        useState<boolean>(false);

      const handleDelete = async () => {
        try {
          const response = await socialsService.delete(
            row.original.slug
          );
          if (response.success) {
            navigate('/admin/socials');
          }
        } catch (error) {
          console.error('Error deleting social:', error);
        }
      };

      const actions = createDropDownActions(
        'socials',
        row.original.slug,
        () => setDeleteDialogIsOpen(true)
      );

      return (
        <div className="flex justify-center">
          <TableDropdownMenu actions={actions} />
          <TableDeleteAlert
            deleteDialogIsOpen={deleteDialogIsOpen}
            setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            handleDelete={handleDelete}
            title="Удалить социальную сеть?"
            description="Вы уверены, что хотите удалить эту социальную сеть?"
          />
        </div>
      );
    },
  },
];
