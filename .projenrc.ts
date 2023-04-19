import { typescript } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const deps = ['quicktype-core', 'js-yaml', '@types/js-yaml', 'readable-stream', '@types/readable-stream'];

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  authorName: 'Dmytro Kosiachenko',
  description: 'Generates typescript interfaces out of JSON or YAML files in projen.',
  name: 'projen-type-generator',
  license: 'MIT',
  peerDeps: ['projen'],
  deps: deps,
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  projenrcTs: true,
  gitignore: ['.vscode/* '],
});

project.synth();
