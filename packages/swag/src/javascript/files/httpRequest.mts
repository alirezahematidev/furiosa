const getHttpRequestFile = () => `
import axios, { AxiosRequestConfig, CancelToken } from "axios";
import { getAxiosInstance } from "./config";
import type { Security, SwaggerResponse } from "./config";


function cancellation<T>(
  getPromise: (cancelToken: CancelToken) => Promise<T>,
): Promise<T> {
  const source = axios.CancelToken.source();
  const promise = getPromise(source.token);
  
  (promise as Promise<T> & { cancel: () => void }).cancel = () => {
    source.cancel("request canceled");
  };

  return promise;
}

export const Http = {
  getRequest(
    url: string,
    queryParams: any | undefined,
    _requestBody: undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).get(url, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).post(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).put(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  patchRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).patch(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).delete(url, {
        data: requestBody,
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
};`;

export default getHttpRequestFile;
