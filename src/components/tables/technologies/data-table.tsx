import { type HTMLAttributes } from 'react';
import DataTableUi from '@/components/ui/data-table';
import { columns } from './columns';
import type { SelectTechnology } from '@/db/schema';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: SelectTechnology[];
}

const DataTable = ({ ...props }: Props) => {
  return <DataTableUi columns={columns} {...props} />;
};

export default DataTable;
