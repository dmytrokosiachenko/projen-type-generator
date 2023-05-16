import { awscdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const deps = ['@types/js-yaml@^4.0.5', 'quicktype-core', 'js-yaml', 'readable-stream', '@types/readable-stream'];

const project = new awscdk.AwsCdkConstructLibrary({
  defaultReleaseBranch: 'main',
  author: 'Dmytro Kosiachenko',
  authorAddress: 'dmytro.kosiachenko@gmail.com',
  description: 'Generates typescript interfaces out of JSON or YAML files in projen.',
  repositoryUrl: 'https://github.com/dmytrokosiachenko/projen-type-generator.git',
  cdkVersion: '2.79.1',
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
