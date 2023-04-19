import parserTypeScript from 'prettier/parser-typescript';
import prettier from 'prettier/standalone';
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBaseOptions } from 'projen/lib/cdk';
import { TypeGenerator } from '../src/index';

const options = { parser: 'typescript', plugins: [parserTypeScript] };

describe('TypeGenerator', () => {
  describe('readJson', () => {
    it('should convert JSON input to TypeScript interfaces', () => {
      const mockInputData = '{"id": 123, "name": "John Doe"}';
      const mockTypeScriptInterfaces = ['interface RootObject { id: number; name: string; }'];
      const mockProject = new AwsCdkTypeScriptApp({
        cdkVersion: '1.123.0',
        defaultReleaseBranch: 'main',
        name: 'test-app',
        context: {},
      });
      const mockOptions: AutoDiscoverBaseOptions = {
        extension: '.ts',
        projectdir: 'src',
      };
      const mockTypeGenerator = new TypeGenerator(mockProject, mockOptions);
      const mockJsonToTs = mockTypeGenerator.convert(mockInputData, 'test.json');
      expect(prettier.format(mockJsonToTs.content[0], options)).toBe(prettier.format(mockTypeScriptInterfaces[0], options));
    });

    it('should convert YAML input to TypeScript interfaces and write to file', () => {
      const mockInputData = 'id: 123\nname: John Doe\n';
      const mockTypeScriptInterfaces = ['interface RootObject { id: number; name: string; }'];
      const mockProject = new AwsCdkTypeScriptApp({
        cdkVersion: '1.123.0',
        defaultReleaseBranch: 'main',
        name: 'test-app',
        context: {},
      });
      const mockOptions: AutoDiscoverBaseOptions = {
        extension: '.ts',
        projectdir: 'src',
      };
      const mockTypeGenerator = new TypeGenerator(mockProject, mockOptions);
      const mockJsonToTs = mockTypeGenerator.convert(mockInputData, 'test.yaml');
      expect(prettier.format(mockJsonToTs.content[0], options)).toBe(prettier.format(mockTypeScriptInterfaces[0], options));
    });
  });
});
