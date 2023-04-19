const { typescript } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const deps = ['quicktype-core', 'js-yaml', '@types/js-yaml'];

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
  description: 'Generates typescript interfaces from json or yaml files.',

  gitignore: [
    '.vscode/* ',
  ],
});

project.synth();
