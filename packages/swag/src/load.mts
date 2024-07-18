import { bundleRequire } from 'bundle-require';
import JoyCon from 'joycon';
import { SwagConfig } from './types.mjs';
import chalk from 'chalk';

const supportedExtensions = ['js', 'ts', 'mjs', 'cjs'];

async function getSwaggerConfig(): Promise<Array<SwagConfig> | undefined> {
  try {
    const joycon = new JoyCon();

    const filepath = await joycon.resolve({
      files: supportedExtensions.map((extension) => ['swag', 'config', extension].join('.')),
    });

    if (!filepath) throw new Error('[swag] could not found swag config file.');

    const config = await bundleRequire({ filepath });

    return config.mod.default as Array<SwagConfig> | undefined;
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.redBright(error.message));
    } else {
      console.log(chalk.redBright(error));
    }

    return undefined;
  }
}

export { getSwaggerConfig };
