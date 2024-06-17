import { column, defineTable } from 'astro:db';

const Project = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    name: column.text(),
    description: column.text(),
    body: column.text(),
    role: column.text(),
    link: column.text(),
    thumbnail: column.text(),
  },
});

export default Project;
