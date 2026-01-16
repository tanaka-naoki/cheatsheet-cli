import { Command } from 'commander';
import chalk from 'chalk';
import { getAllSheets, readSheetContent } from '../lib/storage';

export const searchCommand = new Command('search')
  .description('Search cheatsheets by keyword')
  .argument('<keyword>', 'Search keyword')
  .action(async (keyword: string) => {
    try {
      const sheets = await getAllSheets();
      const lowerKeyword = keyword.toLowerCase();
      const results: { name: string; type: string; matchType: string }[] = [];

      for (const sheet of sheets) {
        // 名前で検索
        if (sheet.name.toLowerCase().includes(lowerKeyword)) {
          results.push({
            name: sheet.name,
            type: sheet.type === 'text' ? 'Text' : 'Image',
            matchType: 'name',
          });
          continue;
        }

        // テキストシートの場合は内容も検索
        if (sheet.type === 'text') {
          const content = await readSheetContent(sheet);
          if (content.toLowerCase().includes(lowerKeyword)) {
            results.push({
              name: sheet.name,
              type: 'Text',
              matchType: 'content',
            });
          }
        }
      }

      if (results.length === 0) {
        console.log(chalk.yellow(`No sheets found matching "${keyword}"`));
        return;
      }

      console.log(chalk.green(`Found ${results.length} result(s):\n`));

      for (const result of results) {
        console.log(
          `  ${chalk.cyan(result.name)} (${result.type}) - ${chalk.gray('matched by ' + result.matchType)}`
        );
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
