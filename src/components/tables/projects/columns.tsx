import type { ColumnDef } from '@tanstack/react-table';
import { addProtocolToUrl } from '@/lib/utils';

import { useState } from 'react';

import { navigate } from 'astro:transitions/client';
import createDropDownActions from '@/lib/react-table/createDropDownAction';
import TableDropdownMenu from '@/components/react-table/table-dropdown-menu';
import TableDeleteAlert from '@/components/react-table/table-delete-alert';
import { projectsService } from '@/lib/services/projectsService';
import type { SelectProject } from '@/db/schema';

export const columns: ColumnDef<SelectProject>[] = [
  // Name
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-bold">{value}</span>;
    },
  },

  // Role
  {
    accessorKey: 'role',
    header: 'Моя роль',
  },

  // Thumbnail
  {
    accessorKey: 'thumbnailGreeting',
    header: 'Картинка',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <img
          loading="lazy"
          src={value}
          alt="Thumbnail"
          className="rounded-md aspect-video w-[250px] object-cover object-center"
        />
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
          const response = await projectsService.delete(
            row.original.slug
          );
          if (response.success) {
            navigate('/admin/projects');
          }
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      };

      const { siteLink, githubLink, slug } = row.original;
      const formattedSiteLink = addProtocolToUrl(siteLink);
      const formattedGithubLink = addProtocolToUrl(githubLink);
      const actions = createDropDownActions(
        'projects',
        slug,
        () => setDeleteDialogIsOpen(true),
        true
      );
      const externalLinks = [
        {
          name: 'GitHub',
          href: formattedGithubLink,
        },
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
            description="Вы уверены, что хотите удалить проект?"
            handleDelete={handleDelete}
            setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            title="Удалить проект"
          />
        </div>
      );
    },
  },
];
