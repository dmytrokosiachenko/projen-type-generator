import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import JsonToTS from 'json-to-ts';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBase, AutoDiscoverBaseOptions } from 'projen/lib/cdk';

export class TypeGenerator extends AutoDiscoverBase {
  constructor(project: AwsCdkTypeScriptApp, projectOptions: AutoDiscoverBaseOptions) {
    super(project, {
      extension: projectOptions.extension,
      projectdir: project.srcdir,
    });
    this.generateTypes();
  }

  generateTypes() {
    for (const filePath of this.entrypoints) {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content, fileExtension } = this.convert(fileContents, filePath);
        const generatedFileName = path.basename(filePath, fileExtension) + '.ts';
        const generatedFilePath = path.join(path.dirname(filePath), generatedFileName);
        this.writeFile(generatedFilePath, content);
      } catch (error) {
        console.error(`Error processing file: ${filePath}`);
        console.error(error);
        throw error;
      }
    }
  }

  convert(fileContents: string, filePath: string): { content: string[]; fileExtension: string } {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
      case '.json':
        return { content: JsonToTS(JSON.parse(fileContents)), fileExtension: extension };
      case '.yaml':
      case '.yml':
        const jsonContent = yaml.load(fileContents) as string;
        return { content: JsonToTS(jsonContent), fileExtension: extension };
      default:
        throw new Error(`Unknown file extension: ${extension}`);
    }
  }

  writeFile(filePath: string, lines: string[]): void {
    const fileContents = lines.join('\n');
    const outputFilePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.d.ts`);
    fs.writeFileSync(outputFilePath, fileContents, 'utf8');
    console.info(`Generated types for file: ${filePath}`);
  }
}
