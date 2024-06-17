import { Project, Technology, TechnologyToProject, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Project).values([
    {
      name: 'EISVIL',
      slug: 'eisvil',
      description: 'Description',
      body: 'Body',
      role: 'Full Stack Developer',
      link: 'https://eisvil-new.netlify.app/',
      thumbnail: 'https://eisvil.com/img/eisvil.png',
    },
  ]);

  await db.insert(Technology).values([
    {
      name: 'Astro',
      slug: 'astro',
      description: 'The official Astro framework',
      body: 'The official Astro framework',
      link: 'https://astro.build',
      iconifyId: 'simple-icons:astro',
    },
    {
      name: 'Tailwind',
      slug: 'tailwind',
      description: 'The official Tailwind CSS framework',
      body: 'The official Tailwind CSS framework',
      link: 'https://tailwindcss.com',
      iconifyId: 'logos-tailwindcss-icon',
    },
    {
      name: 'Vite',
      slug: 'vite',
      description: 'The official Vite framework',
      body: 'The official Vite framework',
      link: 'https://vitejs.dev',
      iconifyId: 'logos-vite',
    },
    {
      name: 'Svelte',
      slug: 'svelte',
      description: 'The official Svelte framework',
      body: 'The official Svelte framework',
      link: 'https://svelte.dev',
      iconifyId: 'logos-svelte',
    },
  ]);

  await db.insert(TechnologyToProject).values([
    { technologyId: 1, projectId: 1 },
    { technologyId: 2, projectId: 1 },
    { technologyId: 3, projectId: 1 },
  ]);
}
