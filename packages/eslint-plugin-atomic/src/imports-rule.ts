import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';
import path from 'path';

const layers = {
  atoms: 1,
  molecules: 2,
  organisms: 3,
  templates: 4,
  pages: 5,
} as const;

type Layer = keyof typeof layers;

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce that each layer can only import from below its own layer, not from above.',
      category: 'Best Practices',
    },
    messages: {
      forbiddenImport: "Importing from higher layer '{{imported}}' is not allowed in '{{layer}}'",
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node: ImportDeclaration) {
        const currentLayer = Object.keys(layers).find((layer) => context.filename.includes(layer)) as Layer;

        if (!currentLayer || !node.source.value) return;

        const importPath = node.source.value.toString();

        const importedLayer = Object.keys(layers).find((layer) => path.resolve(importPath).includes(layer)) as Layer;

        if (!importedLayer) return;

        if (layers[currentLayer] >= layers[importedLayer]) return;

        context.report({
          node: node.source,
          messageId: 'forbiddenImport',
          data: {
            layer: currentLayer,
            imported: importedLayer,
          },
        });
      },
    };
  },
};
export default rule;
