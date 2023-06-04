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
var csv_import_1 = require("../../types/integrations/csv-import");
var prompts_1 = __importDefault(require("prompts"));
var integrations_1 = require("../../types/integrations");
var config_1 = require("../../common/config");
var logging_1 = require("../../common/logging");
exports["default"] = (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var responses_1, defaultCSVAccountConfig_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('\nThis script will walk you through setting up the CSV Import integration. Follow these steps:');
                            console.log('\n\t1. Choose a consistent folder on your computer to hold CSV files you want to import.');
                            console.log('\t2. Copy the absolute path of this folder (globs for multiple files are also supported).');
                            console.log('\t3. Answer the following questions:\n');
                            return [4 /*yield*/, prompts_1["default"]([
                                    {
                                        type: 'text',
                                        name: 'name',
                                        message: 'What would you like to call this integration?',
                                        initial: 'CSV Import',
                                        validate: function (s) {
                                            return 1 < s.length && s.length <= 64 ? true : 'Must be between 2 and 64 characters in length.';
                                        }
                                    },
                                    {
                                        type: 'text',
                                        name: 'account',
                                        message: 'What would you like to call this account?',
                                        initial: 'My CSV Account',
                                        validate: function (s) {
                                            return 1 < s.length && s.length <= 64 ? true : 'Must be between 2 and 64 characters in length.';
                                        }
                                    },
                                    {
                                        type: 'text',
                                        name: 'path',
                                        message: "What is the path/globs to the CSV file(s) you'd like to import?",
                                        initial: '/path/to/my/csv/files/*.csv',
                                        validate: function (s) { return (s.substring(0, 1) === '/' ? true : 'Must start with `/`.'); }
                                    },
                                    {
                                        type: 'text',
                                        name: 'dateFormat',
                                        message: 'What is the format of the date column in these files?',
                                        initial: 'yyyyMMdd',
                                        validate: function (s) {
                                            return 1 < s.length && s.length <= 64 ? true : 'Must be between 1 and 64 characters in length.';
                                        }
                                    }
                                ])];
                        case 1:
                            responses_1 = _a.sent();
                            defaultCSVAccountConfig_1 = {
                                paths: [responses_1.path],
                                transformer: {
                                    name: 'name',
                                    date: 'date',
                                    amount: 'amount'
                                },
                                dateFormat: responses_1.dateFormat,
                                id: responses_1.account,
                                integration: integrations_1.IntegrationId.CSVImport
                            };
                            config_1.updateConfig(function (config) {
                                var CSVImportConfig = config.integrations[integrations_1.IntegrationId.CSVImport] || csv_import_1.defaultCSVImportConfig;
                                CSVImportConfig.name = responses_1.name;
                                config.integrations[integrations_1.IntegrationId.CSVImport] = CSVImportConfig;
                                config.accounts[responses_1.account] = defaultCSVAccountConfig_1;
                                return config;
                            });
                            console.log("\n\t4. Edit the 'transformer' field of the new account added to your ~/mintable.jsonc config file to map the input columns of your CSV file to a supported Transaction column in Mintable.\n");
                            logging_1.logInfo('Successfully set up CSV Import Integration.');
                            return [2 /*return*/, resolve()];
                        case 2:
                            e_1 = _a.sent();
                            logging_1.logError('Unable to set up CSV Import Integration.', e_1);
                            return [2 /*return*/, reject()];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); });
