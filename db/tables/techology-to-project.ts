import { column, defineTable } from 'astro:db';
import Project from './project';
import Technology from './technology';

const TechnologyToProject = defineTable({
  columns: {
    technologyId: column.number({ references: () => Technology.columns.id }),
    projectId: column.number({ references: () => Project.columns.id }),
  },
});

export default TechnologyToProject;
