"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const open_1 = __importDefault(require("open"));
const storage_1 = require("../lib/storage");
const markdown_1 = require("../lib/markdown");
exports.showCommand = new commander_1.Command('show')
    .description('Display cheatsheet contents')
    .argument('<name>', 'Name of the cheatsheet')
    .addOption(new commander_1.Option('-o, --open', 'Open with external viewer (for images)').hideHelp())
    .option('-r, --raw', 'Display raw Markdown')
    .action(async (name, options) => {
    try {
        const sheet = await (0, storage_1.getSheet)(name);
        if (!sheet) {
            console.error(chalk_1.default.red(`Error: Sheet "${name}" not found`));
            process.exit(1);
        }
        if (sheet.type === 'text') {
            const content = await (0, storage_1.readSheetContent)(sheet);
            if (options.raw) {
                console.log(content);
            }
            else {
                console.log((0, markdown_1.renderMarkdown)(content));
            }
        }
        else {
            const filePath = (0, storage_1.getSheetFilePath)(sheet);
            console.log(chalk_1.default.cyan(`Image file: ${filePath}`));
            if (options.open) {
                await (0, open_1.default)(filePath);
                console.log(chalk_1.default.green('Opened with external viewer'));
            }
            else {
                console.log(chalk_1.default.gray('Use --open option to open with external viewer'));
            }
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
//# sourceMappingURL=show.js.map