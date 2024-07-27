import type { HTMLAttributes } from 'react';
import type { SelectSocial } from '@/db/schema/socials';
import DataTableUi from '@/components/ui/data-table';
import { columns } from './columns';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: SelectSocial[];
}

const DataTable = ({ ...props }: Props) => {
  return <DataTableUi columns={columns} {...props} />;
};

export default DataTable;
