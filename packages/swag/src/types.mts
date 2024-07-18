import { ConvertOutputOptions } from 'swagger2openapi';

type DataType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

export type OpenApiV2Document = ConvertOutputOptions['original'];

export type OpenApiV3Document = ConvertOutputOptions['openapi'];

export type OpenApiDocument = OpenApiV2Document | OpenApiV3Document;

export interface Schema {
  title?: string;
  nullable?: boolean;
  ['x-nullable']?: boolean;
  maxLength?: number;
  max?: number;
  min?: number;
  pattern?: string;
  type?: DataType;
  items?: Schema | {};

  format?: 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'date' | 'password' | 'guid' | 'uuid';
  additionalProperties?: Schema | true | {};
  properties?: { [name: string]: Schema };
  required?: string[];
  description?: string;
  example?: string;
  deprecated?: boolean;
  'x-deprecatedMessage'?: string;
  'x-enumNames'?: string[];
  enum?: string[];
  $ref?: string;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  minimum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  maximum?: number;
  AnyValue?: {
    nullable?: boolean;
    description?: string;
  };

  discriminator?: {
    propertyName: string;
    mapping?: {
      [key: string]: string;
    };
  };
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  };
  externalDocs?: {
    description?: string;
    url: string;
  };
  examples?: { [x: string]: string };
  not?: Schema;
  default?: any;
  multipleOf?: number;
  minLength?: number;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
}

export type Parameter = {
  name: string;
  in: 'query' | 'header' | 'cookie' | 'path';
  required?: boolean;
  schema?: Schema;
  $ref?: string;
  description?: string;
  deprecated?: boolean;
};

export interface SwaggerResponse {
  $ref?: string;
  description?: string;
  content?: Partial<
    Record<
      ApiAST['contentType'],
      Pick<Schema, 'example' | 'examples'> & {
        schema?: Schema;
      }
    >
  >;
}

export interface SwaggerRequest {
  tags?: string[]; // ["Account"];
  summary?: string; // "Get user account balance";
  operationId?: string; // "Account_GetBalance";
  parameters?: Parameter[];
  requestBody?: SwaggerResponse;
  responses: { [x: string]: SwaggerResponse };
  deprecated?: boolean;
  security?: any[];
  description?: string;
  externalDocs?: any;
  callbacks?: any;
  servers?: any[];
}

export interface Components {
  schemas?: Record<string, Schema>;
  parameters?: Record<string, Parameter>;
  requestBodies?: Record<string, SwaggerResponse>;
}

export interface SwaggerJson {
  openapi?: string;
  swagger?: string;
  paths: {
    [url: string]: PathItem;
  };
  components?: Components;
  info: InfoObject;
  servers?: any[];
  security?: any[];
  tags?: any[];
  externalDocs?: any;
}

export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: SwaggerRequest;
  put?: SwaggerRequest;
  post?: SwaggerRequest;
  delete?: SwaggerRequest;
  options?: SwaggerRequest;
  head?: SwaggerRequest;
  patch?: SwaggerRequest;
  trace?: SwaggerRequest;
  servers?: any[];
  parameters?: any[];
}
export interface InfoObject {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: any;
  license?: any;
}

export interface SwagConfig {
  /** The URL of the Swagger JSON endpoint */
  readonly url: string;
  /** The destination directory where generated files will be written */
  output: string;
  /**
   * Flag indicating whether to generate React hooks
   *
   * @default false
   */
  reactHooks?: boolean;
  /**
   * Flag indicating whether to generate enums as types
   *
   * @default false
   */
  generateEnumAsType?: boolean;
  /** Array of patterns to include specific endpoints */
  includes?: string[];
  /** Array of patterns to exclude specific endpoints */
  excludes?: string[];
  /** Array of endpoints to use as queries */
  useQuery?: string[];
  /** Array of endpoints to use as infinite queries */
  useInfiniteQuery?: string[];
  /**
   * Specifies the target language for generated code
   *
   * @default typescript
   */
  language?: 'javascript' | 'typescript';
  /** Prefix value matched pathname will be removed from endpoints */
  prefix?: string;
}

export interface Config extends SwagConfig {}

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

export type ApiAST = {
  contentType:
    | '*/*'
    | 'text/json'
    | 'application/json'
    | 'application/octet-stream'
    | 'application/json-patch+json'
    | 'application/*+json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded';

  summary: string | undefined;
  deprecated: boolean | undefined;
  serviceName: string;
  pathParams: Parameter[];
  requestBody: Schema | undefined;
  queryParamsTypeName: string | false;
  headerParams: string | Parameter[];
  isQueryParamsNullable: boolean;
  isHeaderParamsNullable: boolean;
  responses: Schema | undefined;
  pathParamsRefString: string | undefined;
  endPoint: string;
  method: Method;
  security: string;
  additionalAxiosConfig: string;
  queryParameters: Parameter[];
};

export type TypeAST = {
  name: string;
  schema?: Schema;
  description?: string;
};

export type JsdocAST = Pick<Schema, 'min' | 'max' | 'title' | 'description' | 'format' | 'minimum' | 'maximum' | 'pattern' | 'maxLength' | 'minLength' | 'example'> & {
  deprecated?: string;
};

export type ConstantsAST = { value: string; name: string };
