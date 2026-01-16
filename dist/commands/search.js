"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const storage_1 = require("../lib/storage");
exports.searchCommand = new commander_1.Command('search')
    .description('Search cheatsheets by keyword')
    .argument('<keyword>', 'Search keyword')
    .action(async (keyword) => {
    try {
        const sheets = await (0, storage_1.getAllSheets)();
        const lowerKeyword = keyword.toLowerCase();
        const results = [];
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
                const content = await (0, storage_1.readSheetContent)(sheet);
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
            console.log(chalk_1.default.yellow(`No sheets found matching "${keyword}"`));
            return;
        }
        console.log(chalk_1.default.green(`Found ${results.length} result(s):\n`));
        for (const result of results) {
            console.log(`  ${chalk_1.default.cyan(result.name)} (${result.type}) - ${chalk_1.default.gray('matched by ' + result.matchType)}`);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
//# sourceMappingURL=search.js.map