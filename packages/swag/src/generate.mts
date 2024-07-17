import { getSwaggerConfig } from "./load.mjs";
import { generateService } from "./utils.mjs";

async function generate() {
  const configs = await getSwaggerConfig();

  if (!configs || configs?.length === 0) return;

  for (const conf of configs) {
    await generateService(conf);
  }
}

export { generate };
