import { getRefName, getSchemaName, getTsType } from "./utils.mjs";
import type { Schema, Config, TypeAST } from "../types.mjs";
import { getJsdoc } from "../utilities/jsdoc.mjs";
import { isAscending } from "../utils.mjs";

function generateTypes(types: TypeAST[], config: Config): string {
  let code = "";
  try {
    code += types
      .sort(({ name }, { name: _name }) => isAscending(name, _name))
      .reduce((prev, { name: _name, schema, description }) => {
        const name = getSchemaName(_name);
        prev += `
        ${getJsdoc({
          ...schema,
          description: description || schema?.description,
          deprecated: schema?.deprecated ? schema?.["x-deprecatedMessage"] || String(schema?.deprecated) : undefined,
        })}
        ${getTypeDefinition(name, schema, config)}
        `;

        return prev;
      }, "");

    return code;
  } catch (error) {
    console.error({ error });
    return "";
  }
}

function getTypeDefinition(name: string, schema: Schema = {}, config: Config) {
  const {
    type,
    enum: Enum,
    "x-enumNames": enumNames,
    allOf,
    oneOf,
    items,
    $ref,
    additionalProperties,
    properties,
  } = schema;

  if (Enum) {
    if (config.generateEnumAsType) {
      return `export type ${name} =${Enum.map((e) => JSON.stringify(e)).join(" | ")};`;
    }
    return `export enum ${name} {${Enum.map(
      (e, index) => `${enumNames ? enumNames[index] : JSON.stringify(e)}=${JSON.stringify(e)}`,
    )}}`;
  }

  if (allOf || oneOf) {
    return `export type ${name} = ${getTsType(schema, config)}`;
  }

  if (type === "array" && items) {
    return `export type ${name} = ${getTsType(items, config)}[]`;
  }

  if ($ref) {
    return `export type ${name} = ${getRefName($ref)}`;
  }

  if (type === "object") {
    const typeObject = getTsType(schema, config);

    if ((additionalProperties || properties) && !oneOf) {
      return `export interface ${name} ${typeObject}`;
    }

    return `export type ${name} = ${typeObject}`;
  }

  if (type === "string") {
    return `export type ${name} = ${type}`;
  }

  return `export type ${name} = any`;
}

export { generateTypes };
