import type { SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { slugify } from 'transliteration';
import type { UploadFileData } from '../schemas/api/upload-files';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const regex = {
  PHONE:
    /^\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  ICONIFY_ID_TW: /^icon-\[([a-z0-9-]+)--([a-z0-9-]+)\]$/,
  ICONIFY_ID:
    /^([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)$/,
  URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
} as const;

export function convertDataToFormData<T extends Record<string, any>>(
  data: T,
  defaultValues?: Record<string, any>
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if ((value && value !== defaultValues?.[key]) || key === 'id') {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
}

export function addProtocolToUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export function getDomainAndPath(url: string) {
  const parsedUrl = new URL(url);

  return (
    parsedUrl.hostname +
    (parsedUrl.pathname === '/' ? '' : parsedUrl.pathname)
  );
}

export function json(
  data: Record<string, any>,
  init: ResponseInit = { status: 200 }
) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; utf-8',
    },
    ...init,
  });
}

export abstract class ResponseData<TData, TErrors> {
  success: boolean;
  data: TData;
  errors: TErrors[] | null;

  constructor(
    success: boolean,
    data: TData,
    errors: TErrors[] | null = null
  ) {
    this.success = success;
    this.data = data;
    this.errors = errors;
  }
}

export class ResponseSuccessData<TData> extends ResponseData<
  TData,
  unknown
> {
  constructor(data: TData) {
    super(true, data, null);
  }
}

export class ResponseErrorData<TErrors> extends ResponseData<
  unknown,
  TErrors
> {
  constructor(errors: TErrors[]) {
    super(false, null, errors);
  }
}

export async function getUser(
  supabase: SupabaseClient,
  jwt?: string
) {
  const response = await supabase.auth.getUser(jwt);
  const user = response.data.user;

  return user;
}

export async function getSession(supabase: SupabaseClient) {
  const response = await supabase.auth.getSession();
  const session = response.data.session;

  return session;
}

export async function uploadFile(
  file: File,
  bucketId: string,
  accessToken: string,
  uploadUrl: string
) {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('bucketId', bucketId);

  try {
    const response = await axios.post<
      ResponseSuccessData<UploadFileData[]>
    >(uploadUrl, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data.success)
      throw new Error('Error uploading file');

    return response.data.data[0].url;
  } catch (error) {
    let errMessage = 'Error uploading file';
    if (axios.isAxiosError(error)) {
      errMessage = errMessage + ': ' + error.message;
    }
    console.error(errMessage);
    return new ResponseErrorData([errMessage]);
  }
}

type MouseEventType =
  | 'click'
  | 'dblclick'
  | 'mousedown'
  | 'mouseup'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
  | 'contextmenu';
export const triggerMouseEvent = (
  element: HTMLElement,
  eventType: MouseEventType
): void => {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(event);
};

export function getSlugifyValue(value: string): string {
  return slugify(value || '', {
    lowercase: true,
    separator: '-',
  });
}

export function transformIconifyIdToTW(id: string): string {
  const [prefix, icon] = id.split(':');
  return `icon-[${prefix}--${icon}]`;
}
