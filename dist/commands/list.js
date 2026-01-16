"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const storage_1 = require("../lib/storage");
exports.listCommand = new commander_1.Command('list')
    .description('List all cheatsheets')
    .action(async () => {
    try {
        const sheets = await (0, storage_1.getAllSheets)();
        if (sheets.length === 0) {
            console.log(chalk_1.default.yellow('No cheatsheets found'));
            return;
        }
        // 更新日時でソート（新しい順）
        sheets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        const table = new cli_table3_1.default({
            head: [
                chalk_1.default.cyan('Name'),
                chalk_1.default.cyan('Type'),
                chalk_1.default.cyan('Updated'),
            ],
            colWidths: [30, 10, 25],
        });
        for (const sheet of sheets) {
            const typeLabel = sheet.type === 'text' ? 'Text' : 'Image';
            const updatedAt = new Date(sheet.updatedAt).toLocaleString('en-US');
            table.push([sheet.name, typeLabel, updatedAt]);
        }
        console.log(table.toString());
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
//# sourceMappingURL=list.js.map