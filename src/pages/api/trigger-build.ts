import {
  json,
  ResponseErrorData,
  ResponseSuccessData,
} from '@/lib/utils';
import type { APIRoute } from 'astro';
import axios from 'axios';

export const POST: APIRoute = async () => {
  try {
    await axios.post(import.meta.env.NETLIFY_TRIGGER_URL);
  } catch (error) {
    console.error('Error triggering build:', error);
    return json(new ResponseErrorData(['Failed to trigger build']));
  }
  return json(new ResponseSuccessData(null));
};
