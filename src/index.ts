import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBase, AutoDiscoverBaseOptions } from 'projen/lib/cdk';
import { InputData, TypeScriptTargetLanguage, jsonInputForTargetLanguage, quicktype } from 'quicktype-core';

export class TypeGenerator extends AutoDiscoverBase {
  constructor(project: AwsCdkTypeScriptApp, projectOptions: AutoDiscoverBaseOptions) {
    super(project, {
      extension: projectOptions.extension,
      projectdir: project.srcdir,
    });
    this.generateTypes()
      .then(() => console.log('Generated file successfully!'))
      .catch(e => console.info('Error occured during the generation:' + JSON.stringify(e)));
  }

  async generateTypes(): Promise<void> {
    for (const filePath of this.entrypoints) {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content, fileExtension } = await this.convert(fileContents, filePath);
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

  async convert(fileContents: string, filePath: string): Promise<{ content: string[]; fileExtension: string }> {
    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, extension).split('.')[0];
    let inputContent;
    if (extension === '.yaml' || extension === '.yml') {
      inputContent = JSON.stringify(yaml.load(fileContents) as string);
    } else if (extension === '.json') {
      inputContent = fileContents;
    } else {
      throw new Error(`Unknown file extension: ${extension}`);
    }
    const lang = new TypeScriptTargetLanguage();
    const jsonInput = jsonInputForTargetLanguage(lang);
    await jsonInput.addSource({
      name: fileName,
      samples: [inputContent],
    });
    const inputData = new InputData();
    inputData.addInput(jsonInput);
    const { lines } = await quicktype({ inputData, lang: lang });
    return { content: lines, fileExtension: extension };
  }

  writeFile(filePath: string, lines: string[]): void {
    const fileContents = lines.join('\n');
    const outputFilePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.ts`);
    fs.writeFileSync(outputFilePath, fileContents, 'utf8');
    console.info(`Generated types for file: ${filePath}`);
  }
}
