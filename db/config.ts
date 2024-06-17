import { defineDb } from 'astro:db';
import Project from './tables/project';
import Technology from './tables/technology';
import TechnologyToProject from './tables/techology-to-project';

// https://astro.build/db/config
export default defineDb({
  tables: { Technology, Project, TechnologyToProject },
});
