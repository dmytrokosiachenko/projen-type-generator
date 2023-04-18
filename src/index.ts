import * as fs from 'fs';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBase, AutoDiscoverBaseOptions } from 'projen/lib/cdk';
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core';

export interface TypeGeneratorOptions extends AutoDiscoverBaseOptions {
  files: string[];
}

export class TypeGenerator extends AutoDiscoverBase {
  constructor(project: AwsCdkTypeScriptApp, projectOptions: TypeGeneratorOptions) {
    super(project, projectOptions);
    projectOptions.files.forEach(async filePath => {
      console.info(`processing file: ${filePath}`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const inputData = this.getInputData(fileContents, filePath);
      await this.quicktypeJSON(inputData.kind, inputData.contents);
    });
  }

  private async quicktypeJSON(typeName: string, jsonString: string) {
    const jsonInput = jsonInputForTargetLanguage('ts');
    await jsonInput.addSource({
      name: typeName,
      samples: [jsonString],
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    return quicktype({
      inputData,
      lang: 'ts',
    });
  }

  private getInputData(fileContents: string, filePath: string) {
    const extension = filePath.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'json':
        return { kind: 'json', name: 'input', contents: fileContents };
      case 'yaml':
      case 'yml':
        return { kind: 'yaml', name: 'input', contents: fileContents };
      default:
        throw new Error(`Unknown file extension: ${extension}`);
    }
  }
}
