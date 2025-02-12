#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prompts_1 = __importDefault(require("prompts"));
var chalk = require('chalk');
var config_1 = require("../common/config");
var setup_1 = __importDefault(require("../integrations/plaid/setup"));
var setup_2 = __importDefault(require("../integrations/google/setup"));
var setup_3 = __importDefault(require("../integrations/csv-import/setup"));
var setup_4 = __importDefault(require("../integrations/csv-export/setup"));
var accountSetup_1 = __importDefault(require("../integrations/plaid/accountSetup"));
var fetch_1 = __importDefault(require("./fetch"));
var migrate_1 = __importDefault(require("./migrate"));
var logging_1 = require("../common/logging");
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var logo, commands, arg, configSource, overwrite;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logo = [
                        '\n',
                        '          %',
                        '          %%',
                        '         %%%%%',
                        '       %%%%%%%%',
                        '     %%%%%%%%%%',
                        '   %%%%%%%%%%%%',
                        '  %%%% %%%%%%%%',
                        '  %%%  %%%%%%',
                        '  %%   %%%%%%',
                        '   %   %%%',
                        '        %%%',
                        '         %%',
                        '           %',
                        '\n'
                    ];
                    logo.forEach(function (line) {
                        console.log(chalk.green(line));
                    });
                    console.log(' M I N T A B L E (D E V)\n');
                    commands = {
                        migrate: migrate_1["default"],
                        fetch: fetch_1["default"],
                        'plaid-setup': setup_1["default"],
                        'account-setup': accountSetup_1["default"],
                        'google-setup': setup_2["default"],
                        'csv-import-setup': setup_3["default"],
                        'csv-export-setup': setup_4["default"]
                    };
                    arg = process.argv[2];
                    if (!(arg == 'setup')) return [3 /*break*/, 6];
                    configSource = config_1.getConfigSource();
                    if (!config_1.readConfig(configSource, true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, prompts_1["default"]([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: 'Config already exists. Do you to overwrite it?',
                                initial: false
                            }
                        ])];
                case 1:
                    overwrite = _a.sent();
                    if (overwrite.confirm === false) {
                        logging_1.logError('Config update cancelled by user.');
                    }
                    _a.label = 2;
                case 2:
                    config_1.updateConfig(function (config) { return config; }, true);
                    return [4 /*yield*/, setup_1["default"]()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, setup_2["default"]()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, accountSetup_1["default"]()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (commands.hasOwnProperty(arg)) {
                        commands[arg]();
                    }
                    else {
                        console.log("\nmintable v" + require('../../package.json').version + "\n");
                        console.log('\nusage: mintable <command>\n');
                        console.log('available commands:');
                        Object.keys(commands)
                            .concat(['setup'])
                            .forEach(function (command) { return console.log("\t" + command); });
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
})();
