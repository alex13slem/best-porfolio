import { z } from 'zod';

export const jsonArrayString = z.string().refine(
  (data) => {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  },
  {
    message: 'String must be a valid JSON array',
  }
);
