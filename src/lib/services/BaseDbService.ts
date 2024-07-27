import {
  ResponseErrorData,
  ResponseSuccessData,
  convertDataToFormData,
} from '@/lib/utils';
import axios, { type AxiosResponse } from 'axios';

interface BaseDbServiceInterface<
  TInsertForm extends Record<string, any>,
  TUpdateForm extends Record<string, any>,
  TSelect
> {
  create(
    data: TInsertForm
  ): Promise<ResponseSuccessData<null> | ResponseErrorData<string>>;
  delete(
    identifier: string | number
  ): Promise<ResponseSuccessData<null> | ResponseErrorData<string>>;
  update(
    identifier: string | number,
    data: TUpdateForm,
    defaultValues: TSelect
  ): Promise<ResponseSuccessData<null> | ResponseErrorData<string>>;
}

export default class BaseDbService<
  TInsertForm extends Record<string, any>,
  TUpdateForm extends Record<string, any>,
  TSelect
> implements
    BaseDbServiceInterface<TInsertForm, TUpdateForm, TSelect>
{
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private async handleRequest<T>(
    request: Promise<AxiosResponse<ResponseSuccessData<T>>>
  ): Promise<ResponseSuccessData<T> | ResponseErrorData<string>> {
    try {
      const response = await request;
      return response.data;
    } catch (error) {
      let errors: string[];
      if (axios.isAxiosError(error)) {
        const responseData: ResponseErrorData<string> =
          error.response?.data;
        errors = responseData.errors ?? ['Unknown error'];
      } else if (error instanceof Error) {
        errors = [error.message];
      } else {
        errors = ['Unknown error'];
      }
      return new ResponseErrorData(errors);
    }
  }

  async create(data: TInsertForm) {
    const formData = convertDataToFormData(data);
    return this.handleRequest(
      axios.post<ResponseSuccessData<null>>(
        `${this.endpoint}/create`,
        formData
      )
    );
  }

  async delete(identifier: string | number) {
    return this.handleRequest(
      axios.delete<ResponseSuccessData<null>>(
        `${this.endpoint}/${identifier}/delete`
      )
    );
  }

  async update(
    identifier: string | number,
    data: TUpdateForm,
    defaultValues: NonNullable<TSelect>
  ) {
    const formData = convertDataToFormData(data, defaultValues);
    return this.handleRequest(
      axios.patch<ResponseSuccessData<null>>(
        `${this.endpoint}/${identifier}/edit`,
        formData
      )
    );
  }
}
