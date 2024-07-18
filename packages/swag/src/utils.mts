import { OpenApiV2Document, OpenApiV3Document, SwagConfig, SwaggerJson } from './types.mjs';
import yaml from 'js-yaml';
import { getJson } from './getJson.mjs';
import fs from 'fs-extra';
import { transformToOpenApi } from './utilities/swaggerToOpenApi.mjs';
import postmanToOpenApi from 'postman-to-openapi';
import { generateJavascriptService } from './javascript/index.mjs';

function isAscending(a: string, b: string) {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}

function majorVersionsCheck(expectedV: string, inputV?: string) {
  if (!inputV) {
    throw new Error(`seems openApi v3/v2 does not supports your swagger json`);
  }

  const expectedVMajor = expectedV.split('.')[0];

  const inputVMajor = inputV.split('.')[0];

  function isValidPart(x: string) {
    return /^\d+$/.test(x);
  }

  if (!isValidPart(expectedVMajor) || !isValidPart(inputVMajor)) {
    throw new Error(`[SWAG] Provided swagger endpoint openApi version is not valid "${inputV}"`);
  }

  const expectedMajorNumber = Number(expectedVMajor);
  const inputMajorNumber = Number(inputVMajor);

  if (expectedMajorNumber <= inputMajorNumber) {
    return;
  }

  throw new Error(`[SWAG] Provided swagger endpoint openApi version is not valid ${inputV}`);
}

function isMatchWholeWord(stringToSearch: string, word: string) {
  return new RegExp('\\b' + word + '\\b').test(stringToSearch);
}

const generateService = async (config: SwagConfig) => {
  const { url, output } = config;

  await fs.emptyDir(output);

  try {
    let input: SwaggerJson;

    if (!url) throw new Error('[SWAG] add url in your swag config file');

    input = await getJson(url);

    if (isVersion2(input)) {
      majorVersionsCheck('2.0.0', input.swagger);

      input = await transformToOpenApi(input);
    } else if (isVersion3(input)) {
      majorVersionsCheck('3.0.0', input.openapi);
    } else {
      input = yaml.load(await postmanToOpenApi(JSON.stringify(input), undefined)) as SwaggerJson;
    }

    await generateJavascriptService(config, input);
  } catch (error) {
    console.error(error);
  }
};

function isVersion2(input: any): input is OpenApiV2Document {
  return 'swagger' in input && typeof input['swagger'] === 'string';
}

function isVersion3(input: any): input is OpenApiV3Document {
  return 'openapi' in input && typeof input['openapi'] === 'string';
}

export { majorVersionsCheck, isAscending, isMatchWholeWord, generateService, isVersion2, isVersion3 };
