import { Command } from 'commander';
import chalk from 'chalk';
import readline from 'readline';
import { getSheet, removeSheet } from '../lib/storage';

// 削除確認プロンプト
const confirmDelete = async (name: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      chalk.yellow(`Delete sheet "${name}"? (y/N): `),
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y');
      }
    );
  });
};

export const removeCommand = new Command('rm')
  .description('Remove a cheatsheet')
  .argument('<name>', 'Name of the cheatsheet')
  .option('-f, --force', 'Skip confirmation')
  .action(async (name: string, options: { force?: boolean }) => {
    try {
      const sheet = await getSheet(name);

      if (!sheet) {
        console.error(chalk.red(`Error: Sheet "${name}" not found`));
        process.exit(1);
      }

      if (!options.force) {
        const shouldDelete = await confirmDelete(name);
        if (!shouldDelete) {
          console.log(chalk.yellow('Cancelled'));
          return;
        }
      }

      await removeSheet(name);
      console.log(chalk.green(`Deleted sheet "${name}"`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
