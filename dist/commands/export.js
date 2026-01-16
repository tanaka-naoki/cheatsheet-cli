"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const storage_1 = require("../lib/storage");
exports.exportCommand = new commander_1.Command('export')
    .description('Export a cheatsheet')
    .argument('<name>', 'Name of the cheatsheet')
    .option('-o, --out <path>', 'Output path')
    .action(async (name, options) => {
    try {
        const sheet = await (0, storage_1.getSheet)(name);
        if (!sheet) {
            console.error(chalk_1.default.red(`Error: Sheet "${name}" not found`));
            process.exit(1);
        }
        const srcPath = (0, storage_1.getSheetFilePath)(sheet);
        const destDir = options.out ? path_1.default.resolve(options.out) : process.cwd();
        const destPath = path_1.default.join(destDir, sheet.filename);
        // 出力先ディレクトリが存在することを確認
        await fs_extra_1.default.ensureDir(destDir);
        await fs_extra_1.default.copy(srcPath, destPath);
        console.log(chalk_1.default.green(`Exported: ${destPath}`));
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
//# sourceMappingURL=export.js.map