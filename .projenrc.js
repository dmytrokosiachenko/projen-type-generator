const { typescript } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const deps = ['json-to-ts', 'js-yaml'];
const devDeps = ['@types/json5', '@types/js-yaml', 'json5', 'js-yaml', '@types/readable-stream', 'prettier'];

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  authorName: 'Dmytro Kosiachenko',
  name: 'projen-type-generator',
  license: 'MIT',
  peerDeps: ['projen'],
  deps: deps,
  devDeps: devDeps,
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  description: 'Generates typescript interfaces from json or yaml files.',
  gitignore: [
    '.vscode/* ',
  ],


});
project.synth();
