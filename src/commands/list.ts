import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import { getAllSheets } from '../lib/storage';

export const listCommand = new Command('list')
  .description('List all cheatsheets')
  .action(async () => {
    try {
      const sheets = await getAllSheets();

      if (sheets.length === 0) {
        console.log(chalk.yellow('No cheatsheets found'));
        return;
      }

      // 更新日時でソート（新しい順）
      sheets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const table = new Table({
        head: [
          chalk.cyan('Name'),
          chalk.cyan('Type'),
          chalk.cyan('Updated'),
        ],
        colWidths: [30, 10, 25],
      });

      for (const sheet of sheets) {
        const typeLabel = sheet.type === 'text' ? 'Text' : 'Image';
        const updatedAt = new Date(sheet.updatedAt).toLocaleString('en-US');
        table.push([sheet.name, typeLabel, updatedAt]);
      }

      console.log(table.toString());
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
