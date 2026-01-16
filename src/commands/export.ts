import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { getSheet, getSheetFilePath } from '../lib/storage';

export const exportCommand = new Command('export')
  .description('Export a cheatsheet')
  .argument('<name>', 'Name of the cheatsheet')
  .option('-o, --out <path>', 'Output path')
  .action(async (name: string, options: { out?: string }) => {
    try {
      const sheet = await getSheet(name);

      if (!sheet) {
        console.error(chalk.red(`Error: Sheet "${name}" not found`));
        process.exit(1);
      }

      const srcPath = getSheetFilePath(sheet);
      const destDir = options.out ? path.resolve(options.out) : process.cwd();
      const destPath = path.join(destDir, sheet.filename);

      // 出力先ディレクトリが存在することを確認
      await fs.ensureDir(destDir);

      await fs.copy(srcPath, destPath);
      console.log(chalk.green(`Exported: ${destPath}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
