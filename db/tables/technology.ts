import { column, defineTable } from 'astro:db';

const Technology = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    name: column.text(),
    description: column.text(),
    body: column.text(),
    link: column.text(),
    iconifyId: column.text(),
    image: column.text({ optional: true }),
  },
});

export default Technology;
