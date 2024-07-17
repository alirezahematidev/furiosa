import { writeFileSync, existsSync, readFileSync, rmdirSync } from "fs";
import { format } from "prettier";
import { SwaggerJson, Config } from "../types.mjs";
import { generator } from "./generator.mjs";
import { build } from "tsc-prog";
import chalk from "chalk";
import recursive from "recursive-readdir";
import getConfigFile from "./files/config.mjs";
import getHttpRequestFile from "./files/httpRequest.mjs";
import getHooksConfigFile from "./files/hooksConfig.mjs";

const generateJavascriptService = async (config: Config, input: SwaggerJson) => {
  const { url, output, language = "typescript", reactHooks } = config;

  const extension = language.toLowerCase() === "javascript" ? "js" : "ts";

  try {
    const { code, hooks, type } = generator(input, config);

    writeFileSync(`${output}/services.ts`, code);
    console.log(chalk.greenBright("✅ services successfully generated"));

    writeFileSync(`${output}/types.ts`, type);
    console.log(chalk.greenBright("✅ types successfully generated"));

    if (reactHooks && hooks) {
      writeFileSync(`${output}/hooks.ts`, hooks);
      if (!existsSync(`${output}/hooksConfig.${extension}`)) {
        writeFileSync(`${output}/hooksConfig.ts`, getHooksConfigFile());
      }
      console.log(chalk.greenBright("✅ hooks successfully generated"));
    }

    writeFileSync(`${output}/httpRequest.ts`, getHttpRequestFile());
    console.log(chalk.greenBright("✅ httpRequest file successfully created"));

    if (!existsSync(`${output}/config.${extension}`)) {
      writeFileSync(`${output}/config.ts`, getConfigFile({ baseUrl: input.servers?.[0]?.url || "" }));
      console.log(chalk.greenBright("✅ axios config file successfully created\n"));
    }

    if (extension === "js") {
      const files = [
        ...(url ? [...(reactHooks ? ["hooks", "hooksConfig"] : []), "config", "httpRequest", "services", "types"] : []),
      ].filter(Boolean) as string[];
      convertTsToJs(output, files);
    }

    recursive(output, function (err: Error | null, files: any[]) {
      if (err) {
        return console.log(chalk.redBright(err));
      }
      for (const file of files) {
        if (!/(.*)\.(js|ts|json)$/.test(file)) continue;

        formatFile(file, file.endsWith(".json"));
      }
    });
  } catch (error) {
    console.log("[swag]", chalk.redBright(error));
  }
};

async function formatFile(filePath: string, isJson = false) {
  const code = readFileSync(filePath).toString();
  writeFileSync(filePath, await format(code, { parser: isJson ? "json" : "babel-ts" }));
}

function convertTsToJs(dir: string, files: string[]) {
  build({
    basePath: ".",
    compilerOptions: {
      listFiles: true,
      outDir: dir,
      declaration: true,
      skipLibCheck: true,
      module: "esnext",
      target: "esnext",
      lib: ["esnext"],
    },
    files: files.map((file) => `${dir}/${file}.ts`),
  });

  files.forEach((file) => {
    if (existsSync(`${dir}/${file}.ts`)) {
      rmdirSync(`${dir}/${file}.ts`, { recursive: true });
    }
  });
}

export { generateJavascriptService };
