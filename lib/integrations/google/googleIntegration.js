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
exports.__esModule = true;
var googleapis_1 = require("googleapis");
var integrations_1 = require("../../types/integrations");
var logging_1 = require("../../common/logging");
var lodash_1 = require("lodash");
var date_fns_1 = require("date-fns");
var GoogleIntegration = /** @class */ (function () {
    function GoogleIntegration(config) {
        var _this = this;
        this.getSheets = function (documentId) {
            return _this.sheets
                .get({ spreadsheetId: documentId || _this.googleConfig.documentId })
                .then(function (res) {
                logging_1.logInfo("Fetched " + res.data.sheets.length + " sheets.", res.data.sheets);
                return res.data.sheets;
            })["catch"](function (error) {
                logging_1.logError("Error fetching sheets for spreadsheet " + _this.googleConfig.documentId + ".", error);
                return [];
            });
        };
        this.copySheet = function (title, sourceDocumentId) { return __awaiter(_this, void 0, void 0, function () {
            var sheets, sourceSheetId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSheets(sourceDocumentId || this.googleConfig.documentId)];
                    case 1:
                        sheets = _a.sent();
                        try {
                            sourceSheetId = sheets.find(function (sheet) { return sheet.properties.title === title; }).properties.sheetId;
                        }
                        catch (error) {
                            logging_1.logError("Error finding template sheet " + title + " in document " + sourceDocumentId + ".", { error: error, sheets: sheets });
                        }
                        return [2 /*return*/, this.sheets.sheets
                                .copyTo({
                                spreadsheetId: sourceDocumentId || this.googleConfig.documentId,
                                sheetId: sourceSheetId,
                                requestBody: { destinationSpreadsheetId: this.googleConfig.documentId }
                            })
                                .then(function (res) {
                                logging_1.logInfo("Copied sheet " + title + ".", res.data);
                                return res.data;
                            })["catch"](function (error) {
                                logging_1.logError("Error copying sheet " + title + ".", error);
                                return {};
                            })];
                }
            });
        }); };
        this.addSheet = function (title) {
            return _this.sheets
                .batchUpdate({
                spreadsheetId: _this.googleConfig.documentId,
                requestBody: { requests: [{ addSheet: { properties: { title: title } } }] }
            })
                .then(function (res) {
                logging_1.logInfo("Added sheet " + title + ".", res.data);
                return res.data.replies[0].addSheet.properties;
            })["catch"](function (error) {
                logging_1.logError("Error adding sheet " + title + ".", error);
                return {};
            });
        };
        this.renameSheet = function (oldTitle, newTitle) { return __awaiter(_this, void 0, void 0, function () {
            var sheets, sheetId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSheets()];
                    case 1:
                        sheets = _a.sent();
                        sheetId = sheets.find(function (sheet) { return sheet.properties.title === oldTitle; }).properties.sheetId;
                        return [2 /*return*/, this.sheets
                                .batchUpdate({
                                spreadsheetId: this.googleConfig.documentId,
                                requestBody: {
                                    requests: [
                                        {
                                            updateSheetProperties: {
                                                properties: { sheetId: sheetId, title: newTitle },
                                                fields: 'title'
                                            }
                                        }
                                    ]
                                }
                            })
                                .then(function (res) {
                                logging_1.logInfo("Renamed sheet " + oldTitle + " to " + newTitle + ".", res.data);
                                return res.data.replies;
                            })["catch"](function (error) {
                                logging_1.logError("Error renaming sheet " + oldTitle + " to " + newTitle + ".", error);
                                return [];
                            })];
                }
            });
        }); };
        this.translateRange = function (range) {
            return "'" + range.sheet + "'!" + range.start.toUpperCase() + ":" + range.end.toUpperCase();
        };
        this.translateRanges = function (ranges) { return ranges.map(_this.translateRange); };
        this.clearRanges = function (ranges) {
            var translatedRanges = _this.translateRanges(ranges);
            return _this.sheets.values
                .batchClear({
                spreadsheetId: _this.googleConfig.documentId,
                requestBody: { ranges: translatedRanges }
            })
                .then(function (res) {
                logging_1.logInfo("Cleared " + ranges.length + " range(s): " + translatedRanges + ".", res.data);
                return res.data;
            })["catch"](function (error) {
                logging_1.logError("Error clearing " + ranges.length + " range(s): " + translatedRanges + ".", error);
                return {};
            });
        };
        this.updateRanges = function (dataRanges) {
            var data = dataRanges.map(function (dataRange) { return ({
                range: _this.translateRange(dataRange.range),
                values: dataRange.data
            }); });
            return _this.sheets.values
                .batchUpdate({
                spreadsheetId: _this.googleConfig.documentId,
                requestBody: {
                    valueInputOption: "USER_ENTERED",
                    data: data
                }
            })
                .then(function (res) {
                logging_1.logInfo("Updated " + data.length + " range(s): " + data.map(function (r) { return r.range; }) + ".", res.data);
                return res.data;
            })["catch"](function (error) {
                logging_1.logError("Error updating " + data.length + " range(s): " + data.map(function (r) { return r.range; }) + ".", error);
                return {};
            });
        };
        this.sortSheets = function () { return __awaiter(_this, void 0, void 0, function () {
            var sheets, ordered;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSheets()];
                    case 1:
                        sheets = _a.sent();
                        ordered = lodash_1.sortBy(sheets, function (sheet) { return sheet.properties.title; }).reverse();
                        return [2 /*return*/, this.sheets
                                .batchUpdate({
                                spreadsheetId: this.googleConfig.documentId,
                                requestBody: {
                                    requests: ordered.map(function (sheet, i) { return ({
                                        updateSheetProperties: {
                                            properties: { sheetId: sheet.properties.sheetId, index: i },
                                            fields: 'index'
                                        }
                                    }); })
                                }
                            })
                                .then(function (res) {
                                logging_1.logInfo("Updated indices for " + sheets.length + " sheets.", res.data);
                                return res.data;
                            })["catch"](function (error) {
                                logging_1.logError("Error updating indices for " + sheets.length + " sheets.", error);
                                return {};
                            })];
                }
            });
        }); };
        this.formatSheets = function () { return __awaiter(_this, void 0, void 0, function () {
            var sheets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSheets()];
                    case 1:
                        sheets = _a.sent();
                        return [2 /*return*/, this.sheets
                                .batchUpdate({
                                spreadsheetId: this.googleConfig.documentId,
                                requestBody: {
                                    requests: sheets
                                        .map(function (sheet) { return [
                                        {
                                            repeatCell: {
                                                range: { sheetId: sheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
                                                cell: {
                                                    userEnteredFormat: {
                                                        backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
                                                        horizontalAlignment: 'CENTER',
                                                        textFormat: {
                                                            foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                                                            bold: true
                                                        }
                                                    }
                                                },
                                                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
                                            }
                                        },
                                        {
                                            updateSheetProperties: {
                                                properties: {
                                                    sheetId: sheet.properties.sheetId,
                                                    gridProperties: { frozenRowCount: 1 }
                                                },
                                                fields: 'gridProperties.frozenRowCount'
                                            }
                                        },
                                        {
                                            autoResizeDimensions: {
                                                dimensions: {
                                                    sheetId: sheet.properties.sheetId,
                                                    dimension: 'COLUMNS',
                                                    startIndex: 0,
                                                    endIndex: sheet.properties.gridProperties.columnCount
                                                }
                                            }
                                        }
                                    ]; })
                                        .flat(10)
                                }
                            })
                                .then(function (res) {
                                logging_1.logInfo("Updated formatting for " + sheets.length + " sheets.", res.data);
                                return res.data;
                            })["catch"](function (error) {
                                logging_1.logError("Error updating formatting for " + sheets.length + " sheets.", error);
                                return {};
                            })];
                }
            });
        }); };
        this.getRowWithDefaults = function (row, columns, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            return columns.map(function (key) {
                if (row && row.hasOwnProperty(key)) {
                    if (key === 'date') {
                        return date_fns_1.format(row[key], _this.googleConfig.dateFormat || 'yyyy.MM.dd');
                    }
                    return row[key];
                }
                return defaultValue;
            });
        };
        this.updateSheet = function (sheetTitle, rows, columns, useTemplate) { return __awaiter(_this, void 0, void 0, function () {
            var sheets, existing, copied, columnHeaders, range, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSheets()];
                    case 1:
                        sheets = _a.sent();
                        existing = sheets.find(function (sheet) { return sheet.properties.title === sheetTitle; });
                        if (!(existing === undefined)) return [3 /*break*/, 6];
                        if (!(this.googleConfig.template && useTemplate === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.copySheet(this.googleConfig.template.sheetTitle, this.googleConfig.template.documentId)];
                    case 2:
                        copied = _a.sent();
                        return [4 /*yield*/, this.renameSheet(copied.title, sheetTitle)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.addSheet(sheetTitle)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        columns = columns || Object.keys(rows[0]);
                        columnHeaders = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                        range = {
                            sheet: sheetTitle,
                            start: "A1",
                            end: "" + columnHeaders[columns.length > 0 ? columns.length - 1 : 1] + (rows.length + 1)
                        };
                        data = [columns].concat(rows.map(function (row) { return _this.getRowWithDefaults(row, columns); }));
                        return [4 /*yield*/, this.clearRanges([range])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, this.updateRanges([{ range: range, data: data }])];
                }
            });
        }); };
        this.updateTransactions = function (accounts) { return __awaiter(_this, void 0, void 0, function () {
            var transactions, groupedTransactions, _a, _b, _i, month;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        transactions = lodash_1.sortBy(accounts.map(function (account) { return account.transactions; }).flat(10), 'date');
                        groupedTransactions = lodash_1.groupBy(transactions, function (transaction) { return date_fns_1.formatISO(date_fns_1.startOfMonth(transaction.date)); });
                        _a = [];
                        for (_b in groupedTransactions)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        month = _a[_i];
                        return [4 /*yield*/, this.updateSheet(date_fns_1.format(date_fns_1.parseISO(month), this.googleConfig.dateFormat || 'yyyy.MM'), groupedTransactions[month], this.config.transactions.properties, true)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: 
                    // Sort Sheets
                    return [4 /*yield*/, this.sortSheets()
                        // Format, etc.
                    ];
                    case 5:
                        // Sort Sheets
                        _c.sent();
                        // Format, etc.
                        return [4 /*yield*/, this.formatSheets()];
                    case 6:
                        // Format, etc.
                        _c.sent();
                        logging_1.logInfo('You can view your sheet here:\n');
                        console.log("https://docs.google.com/spreadsheets/d/" + this.googleConfig.documentId);
                        return [2 /*return*/];
                }
            });
        }); };
        this.updateBalances = function (accounts) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Update Account Balances Sheets
                    return [4 /*yield*/, this.updateSheet('Balances', accounts, this.config.balances.properties)
                        // Sort Sheets
                    ];
                    case 1:
                        // Update Account Balances Sheets
                        _a.sent();
                        // Sort Sheets
                        return [4 /*yield*/, this.sortSheets()
                            // Format, etc.
                        ];
                    case 2:
                        // Sort Sheets
                        _a.sent();
                        // Format, etc.
                        return [4 /*yield*/, this.formatSheets()];
                    case 3:
                        // Format, etc.
                        _a.sent();
                        logging_1.logInfo('You can view your sheet here:\n');
                        console.log("https://docs.google.com/spreadsheets/d/" + this.googleConfig.documentId);
                        return [2 /*return*/];
                }
            });
        }); };
        this.config = config;
        this.googleConfig = config.integrations[integrations_1.IntegrationId.Google];
        var auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: this.googleConfig.credentials.keyFile,
            scopes: this.googleConfig.credentials.scope
        });
        this.sheets = googleapis_1.google.sheets({ version: 'v4', auth: auth }).spreadsheets;
    }
    return GoogleIntegration;
}());
exports.GoogleIntegration = GoogleIntegration;
