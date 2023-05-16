import { typescript } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const deps = ['quicktype-core', 'js-yaml', 'readable-stream'];
const devDeps = ['@types/js-yaml@^4.0.5', '@types/readable-stream'];

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  description: 'Generates typescript interfaces out of JSON or YAML files in projen.',
  keywords: ['awscdk', 'cdk'],
  name: 'projen-type-generator',
  peerDeps: ['projen'],
  deps: deps,
  devDeps: devDeps,
  bundledDeps: ['js-yaml'],
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  projenrcTs: true,
  gitignore: ['.vscode/* '],
});

project.synth();
