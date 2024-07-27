import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      nesting: true,
    }),
  ],
  site: 'http://localhost:4321/',
  output: 'hybrid',
  adapter: netlify({
    edgeMiddleware: true,
  }),
});
