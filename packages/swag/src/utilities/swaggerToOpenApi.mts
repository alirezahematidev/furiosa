import { OpenApiV2Document, SwaggerJson } from "../types.mjs";
import converter, { S2OError } from "swagger2openapi";

function transformToOpenApi(input: OpenApiV2Document): Promise<SwaggerJson> {
  const options = { patch: true, warnOnly: true };

  return new Promise<SwaggerJson>((resolve, reject) => {
    converter.convertObj(input, options, function (err: S2OError | undefined, result: any) {
      if (err) return reject(err);
      resolve(result.openapi);
    });
  });
}

export { transformToOpenApi };
