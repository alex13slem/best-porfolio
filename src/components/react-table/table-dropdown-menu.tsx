import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DropDownAction } from '@/lib/react-table/createDropDownAction';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';

interface Props extends ComponentProps<FC> {
  actions: DropDownAction[];
  externalLinks?: {
    name: string;
    href: string;
  }[];
}

const TableDropdownMenu: FC<Props> = ({ actions, externalLinks }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-0 w-10 h-10 text-2xl ">
          <Icon icon={'radix-icons:dropdown-menu'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem key={action.name} asChild>
            <a
              href={action.href}
              className={cn(
                'flex items-center gap-2 cursor-pointer ',
                action?.className
              )}
              onClick={(e) => {
                if (!action?.handler) return;
                e.preventDefault();
                action.handler(e);
              }}
            >
              {action.icon && <Icon icon={action.icon} />}
              {action.name}
            </a>
          </DropdownMenuItem>
        ))}

        {externalLinks && <DropdownMenuSeparator />}

        {externalLinks?.map((action) => (
          <DropdownMenuItem key={action.name} asChild>
            <a
              href={action.href}
              className={cn(
                'flex items-center gap-2 cursor-pointer '
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon={'radix-icons:open-in-new-window'} />
              {action.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableDropdownMenu;
