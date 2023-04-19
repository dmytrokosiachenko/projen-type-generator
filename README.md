### TypeScript Type Generator for AWS CDK Projects

This TypeScript package generates TypeScript types based on input files (JSON, YAML) and is designed specifically for use in AWS CDK projects with projen. It allows you to easily generate TypeScript types for configuration files, which can then be used in your infrastructure scripts.

### Usage

Imagine you have a config file config.yaml that looks like:

```yaml
---
server: http://testserver.com
port: 8080
```

You rename your config file to config.generate.yaml and modifies you .projenrc.js like this( **const project** is only an example, you need TypeGenerator of course).

```typescript
import { TypeGenerator } from './TypeGenerator';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';

const dependencies = ['projen-type-generator']; //this is mandatory

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.110.0',
  deps: dependencies,
  defaultReleaseBranch: 'main',
  name: 'my-project',
  authorName: 'My Name',
  authorEmail: 'my.email@example.com',
});

new TypeGenerator(project, { extension: '.generate.yaml' });
```

This will configure the TypeGenerator to search for files with the .generate.yaml extension in your project's src directory, and generate corresponding TypeScript type files.

When you run:

```bash
npx projen
```

the TypeGenerator will automatically search for input files with the specified extension in the src directory, generate TypeScript types for each file, and save the generated TypeScript files in the same directory as the input files.
For example, if the input file is named config.generate.yaml, the generated TypeScript type file will be named config.generate.ts.

## Contributing

This project is open for contributions! Feel free to submit a pull request or create an issue if you find any bugs or have any suggestions for improvement.
