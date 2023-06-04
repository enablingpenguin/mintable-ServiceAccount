"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
var config_1 = require("../common/config");
var plaidIntegration_1 = require("../integrations/plaid/plaidIntegration");
var googleIntegration_1 = require("../integrations/google/googleIntegration");
var logging_1 = require("../common/logging");
var integrations_1 = require("../types/integrations");
var date_fns_1 = require("date-fns");
var csvImportIntegration_1 = require("../integrations/csv-import/csvImportIntegration");
var csvExportIntegration_1 = require("../integrations/csv-export/csvExportIntegration");
exports["default"] = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, startDate, endDate, accounts, _a, _b, _i, accountId, accountConfig, _c, plaid, _d, _e, csv, _f, _g, numTransactions, totalTransactions, transactionMatchesRule, countOverridden_1, _h, google, csv, _j, google, csv;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                config = config_1.getConfig();
                startDate = config.transactions.startDate
                    ? date_fns_1.parseISO(config.transactions.startDate)
                    : date_fns_1.startOfMonth(date_fns_1.subMonths(new Date(), 2));
                endDate = config.transactions.endDate ? date_fns_1.parseISO(config.transactions.endDate) : new Date();
                accounts = [];
                _a = [];
                for (_b in config.accounts)
                    _a.push(_b);
                _i = 0;
                _k.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                accountId = _a[_i];
                accountConfig = config.accounts[accountId];
                logging_1.logInfo("Fetching account " + accountConfig.id + " using " + accountConfig.integration + ".");
                _c = accountConfig.integration;
                switch (_c) {
                    case integrations_1.IntegrationId.Plaid: return [3 /*break*/, 2];
                    case integrations_1.IntegrationId.CSVImport: return [3 /*break*/, 4];
                }
                return [3 /*break*/, 6];
            case 2:
                plaid = new plaidIntegration_1.PlaidIntegration(config);
                _e = (_d = accounts).concat;
                return [4 /*yield*/, plaid.fetchAccount(accountConfig, startDate, endDate)];
            case 3:
                accounts = _e.apply(_d, [_k.sent()]);
                return [3 /*break*/, 7];
            case 4:
                csv = new csvImportIntegration_1.CSVImportIntegration(config);
                _g = (_f = accounts).concat;
                return [4 /*yield*/, csv.fetchAccount(accountConfig, startDate, endDate)];
            case 5:
                accounts = _g.apply(_f, [_k.sent()]);
                return [3 /*break*/, 7];
            case 6: return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8:
                accounts.flat(10);
                numTransactions = function () {
                    return accounts
                        .map(function (account) { return (account.hasOwnProperty('transactions') ? account.transactions.length : 0); })
                        .reduce(function (a, b) { return a + b; }, 0);
                };
                totalTransactions = numTransactions();
                transactionMatchesRule = function (transaction, rule) {
                    return rule.conditions
                        .map(function (condition) { return new RegExp(condition.pattern, condition.flags).test(transaction[condition.property]); })
                        .every(function (condition) { return condition === true; });
                };
                // Transaction Rules
                if (config.transactions.rules) {
                    countOverridden_1 = 0;
                    accounts = accounts.map(function (account) { return (__assign(__assign({}, account), { transactions: account.transactions
                            .map(function (transaction) {
                            config.transactions.rules.forEach(function (rule) {
                                if (transaction && transactionMatchesRule(transaction, rule)) {
                                    if (rule.type === 'filter') {
                                        transaction = undefined;
                                    }
                                    if (rule.type === 'override' && transaction.hasOwnProperty(rule.property)) {
                                        transaction[rule.property] = transaction[rule.property].toString().replace(new RegExp(rule.findPattern, rule.flags), rule.replacePattern);
                                        countOverridden_1 += 1;
                                    }
                                }
                            });
                            return transaction;
                        })
                            .filter(function (transaction) { return transaction !== undefined; }) })); });
                    logging_1.logInfo(numTransactions() + " transactions out of " + totalTransactions + " total transactions matched filters.");
                    logging_1.logInfo(countOverridden_1 + " out of " + totalTransactions + " total transactions overridden.");
                }
                _h = config.balances.integration;
                switch (_h) {
                    case integrations_1.IntegrationId.Google: return [3 /*break*/, 9];
                    case integrations_1.IntegrationId.CSVExport: return [3 /*break*/, 11];
                }
                return [3 /*break*/, 13];
            case 9:
                google = new googleIntegration_1.GoogleIntegration(config);
                return [4 /*yield*/, google.updateBalances(accounts)];
            case 10:
                _k.sent();
                return [3 /*break*/, 14];
            case 11:
                csv = new csvExportIntegration_1.CSVExportIntegration(config);
                return [4 /*yield*/, csv.updateBalances(accounts)];
            case 12:
                _k.sent();
                return [3 /*break*/, 14];
            case 13: return [3 /*break*/, 14];
            case 14:
                _j = config.transactions.integration;
                switch (_j) {
                    case integrations_1.IntegrationId.Google: return [3 /*break*/, 15];
                    case integrations_1.IntegrationId.CSVExport: return [3 /*break*/, 17];
                }
                return [3 /*break*/, 19];
            case 15:
                google = new googleIntegration_1.GoogleIntegration(config);
                return [4 /*yield*/, google.updateTransactions(accounts)];
            case 16:
                _k.sent();
                return [3 /*break*/, 20];
            case 17:
                csv = new csvExportIntegration_1.CSVExportIntegration(config);
                return [4 /*yield*/, csv.updateTransactions(accounts)];
            case 18:
                _k.sent();
                return [3 /*break*/, 20];
            case 19: return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); });
