import { Command, Option } from 'commander';
import chalk from 'chalk';
import open from 'open';
import { getSheet, readSheetContent, getSheetFilePath } from '../lib/storage';
import { renderMarkdown } from '../lib/markdown';

export const showCommand = new Command('show')
  .description('Display cheatsheet contents')
  .argument('<name>', 'Name of the cheatsheet')
  .addOption(new Option('-o, --open', 'Open with external viewer (for images)').hideHelp())
  .option('-r, --raw', 'Display raw Markdown')
  .action(async (name: string, options: { open?: boolean; raw?: boolean }) => {
    try {
      const sheet = await getSheet(name);

      if (!sheet) {
        console.error(chalk.red(`Error: Sheet "${name}" not found`));
        process.exit(1);
      }

      if (sheet.type === 'text') {
        const content = await readSheetContent(sheet);
        if (options.raw) {
          console.log(content);
        } else {
          console.log(renderMarkdown(content));
        }
      } else {
        const filePath = getSheetFilePath(sheet);
        console.log(chalk.cyan(`Image file: ${filePath}`));

        if (options.open) {
          await open(filePath);
          console.log(chalk.green('Opened with external viewer'));
        } else {
          console.log(chalk.gray('Use --open option to open with external viewer'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
