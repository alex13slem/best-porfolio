import { type MouseEvent } from 'react';

export interface DropDownAction {
  name: string;
  href?: string;
  icon: string;
  className?: string;
  handler?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const createDropDownActions = (
  categorySlug: string,
  articleSlug: string,
  handleDelete: () => void,
  displayOpenDetail = false
): DropDownAction[] => {
  const actions: DropDownAction[] = [
    {
      name: 'Редактировать',
      href: `/admin/${categorySlug}/${articleSlug}/edit`,
      icon: 'radix-icons:pencil-2',
    },
    {
      name: 'Удалить',
      icon: 'radix-icons:trash',
      className:
        'bg-red-500 bg-opacity-10 text-red-500 dark:focus:text-red-400 dark:focus:bg-red-400 dark:focus:bg-opacity-20 ',
      handler: handleDelete,
    },
  ];

  if (displayOpenDetail) {
    actions.unshift({
      name: 'Открыть страницу',
      href: `/${categorySlug}/${articleSlug}`,
      icon: 'radix-icons:eye-open',
    });
  }

  return actions;
};

export default createDropDownActions;
