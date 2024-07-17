const getConfigFile = ({ baseUrl }: { baseUrl: string }) => `

import Axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  AxiosInstance,
} from "axios";
import qs from "qs";

const baseConfig: AxiosRequestConfig = {
  baseURL: "${baseUrl}", // <--- Add your base url
  headers: {
    "Content-Encoding": "UTF-8",
    Accept: "application/json",
    "Content-Type": "application/json-patch+json",
  },
  paramsSerializer: (param) => qs.stringify(param, { indices: false }),
};

let axiosInstance: AxiosInstance;

function getAxiosInstance(security: Security): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = Axios.create(baseConfig);


    axiosInstance.interceptors.response.use(
      (async (response: AxiosResponse): Promise<SwaggerResponse<any>> => {
        return response.data;
      }),
      (error: AxiosError) => {
      
        if (error.response) {
          return Promise.reject(
            new RequestError(
              String(error.response.data),
              error.response.status,
              error.response,
            ),
          );
        }

        if (error.isAxiosError) {
          return Promise.reject(
            new RequestError(
              "No internet connection",
            ),
          );
        }
        return Promise.reject(error);
      },
    );
  }

  axiosInstance.interceptors.request.use(
    async (requestConfig) => {
 
      if (security?.[0]) {
        // requestConfig.headers.authorization = "";
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
}

class RequestError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: AxiosResponse,
  ) {
    super(message);
  }

  isApiException = true;

  static isRequestError(error: any): error is RequestError {
    return error.isApiException;
  }
}

export type Security = any[] | undefined;

export type SwaggerResponse<R> = R

export {
  getAxiosInstance,
  RequestError,
};`;

export default getConfigFile;
