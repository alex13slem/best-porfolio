import { json, ResponseErrorData } from '@/lib/utils';
import type { APIRoute } from 'astro';

export const prerender = false;

export const DELETE: APIRoute = async () => {
  return json(new ResponseErrorData(['Method not allowed']), { status: 405 });
};
