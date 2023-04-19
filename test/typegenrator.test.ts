import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { AutoDiscoverBaseOptions } from 'projen/lib/cdk';
import { TypeGenerator } from '../src/index';

const mockTypeScriptInterfaces = 'export interface Test {';

describe('TypeGenerator', () => {
  describe('readJson', () => {
    it('should convert JSON input to TypeScript interfaces', async () => {
      const mockInputData = '{"id": 123, "name": "John Doe"}';
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
      const { content, fileExtension } = await mockTypeGenerator.convert(mockInputData, 'test.json');
      expect(content).toContain(mockTypeScriptInterfaces);
      expect(fileExtension).toBe('.json');
    });

    it('should convert YAML input to TypeScript interfaces and write to file', async () => {
      const mockInputData = 'id: 123\nname: John Doe\n';
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
      const { content, fileExtension } = await mockTypeGenerator.convert(mockInputData, 'test.yaml');
      expect(content).toContain(mockTypeScriptInterfaces);
      expect(fileExtension).toBe('.yaml');
    });
  });
});
