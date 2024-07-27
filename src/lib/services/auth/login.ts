import { ResponseErrorData, type ResponseSuccessData } from '@/lib/utils';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import axios from 'axios';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post<
      ResponseSuccessData<AuthTokenResponsePassword>
    >('/api/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    return new ResponseErrorData(['Error logging in']);
  }
}
