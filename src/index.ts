import * as fs from 'fs';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBase, AutoDiscoverBaseOptions } from 'projen/lib/cdk';
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core';

export class TypeGenerator extends AutoDiscoverBase {
  private readonly LANGUAGE = 'typescript';

  constructor(project: AwsCdkTypeScriptApp, projectOptions: AutoDiscoverBaseOptions) {
    super(project, {
      extension: projectOptions.extension,
      projectdir: project.srcdir,
    });

    this.entrypoints.forEach(async filePath => {
      console.info(`processing file: ${filePath}`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const inputData = this.getInputData(fileContents, filePath);
      const { lines: lines } = await this.quicktypeJSON(inputData.kind, inputData.contents);
      lines.join('\n');
      console.info('Result:' + JSON.stringify(lines));
      fs.writeFileSync('test.ts', JSON.stringify(lines));
    });
  }

  private async quicktypeJSON(typeName: string, jsonString: string) {
    const jsonInput = jsonInputForTargetLanguage(this.LANGUAGE);
    await jsonInput.addSource({
      name: typeName,
      samples: [jsonString],
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    return quicktype({
      inputData,
      lang: this.LANGUAGE,
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
