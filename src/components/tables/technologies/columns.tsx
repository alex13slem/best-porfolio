import type { ColumnDef } from '@tanstack/react-table';
import { addProtocolToUrl } from '@/lib/utils';

import { useState } from 'react';

import { navigate } from 'astro:transitions/client';
import createDropDownActions from '@/lib/react-table/createDropDownAction';
import TableDropdownMenu from '@/components/react-table/table-dropdown-menu';
import TableDeleteAlert from '@/components/react-table/table-delete-alert';
import type { SelectTechnology } from '@/db/schema';
import { technologiesService } from '@/lib/services/technologiesService';
import { useToast } from '../../ui/use-toast';

export const columns: ColumnDef<SelectTechnology>[] = [
  {
    // Name
    accessorKey: 'name',
    header: 'Название',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-bold">{value}</span>;
    },
  },
  {
    // Image
    accessorKey: 'image',
    header: 'Картинка',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <img
          loading="lazy"
          src={value}
          alt="Image"
          className="rounded-md aspect-video w-[250px] object-cover object-center"
        />
      );
    },
  },
  {
    // Actions
    id: 'actions',
    cell: ({ row }) => {
      const { toast } = useToast();
      const [deleteDialogIsOpen, setDeleteDialogIsOpen] =
        useState<boolean>(false);

      const handleDelete = async () => {
        try {
          const response = await technologiesService.delete(
            row.original.slug
          );
          if (response.success) {
            navigate('/admin/technologies');
          }
        } catch (error) {
          console.error('Error deleting technology:', error);
          toast({
            variant: 'destructive',
            title: 'Не удалось удалить',
          });
        }
      };

      const { slug, link } = row.original;
      const formattedSiteLink = addProtocolToUrl(link);
      const actions = createDropDownActions(
        'technologies',
        slug,
        () => setDeleteDialogIsOpen(true),
        true
      );
      const externalLinks = [
        {
          name: 'Перейти на сайт',
          href: formattedSiteLink,
        },
      ];
      return (
        <div className="flex justify-center">
          <TableDropdownMenu
            actions={actions}
            externalLinks={externalLinks}
          />
          <TableDeleteAlert
            deleteDialogIsOpen={deleteDialogIsOpen}
            description="Вы уверены, что хотите удалить технологию?"
            handleDelete={handleDelete}
            setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            title="Удалить технологию"
          />
        </div>
      );
    },
  },
];
