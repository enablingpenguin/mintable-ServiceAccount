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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var date_fns_1 = require("date-fns");
var plaid_1 = __importDefault(require("plaid"));
var config_1 = require("../../common/config");
var plaid_2 = require("../../types/integrations/plaid");
var integrations_1 = require("../../types/integrations");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var logging_1 = require("../../common/logging");
var PLAID_USER_ID = 'LOCAL';
var PlaidIntegration = /** @class */ (function () {
    function PlaidIntegration(config) {
        var _this = this;
        this.exchangeAccessToken = function (accessToken) {
            // Exchange an expired API access_token for a new Link public_token
            return _this.client.createPublicToken(accessToken).then(function (token) { return token.public_token; });
        };
        this.savePublicToken = function (tokenResponse) {
            config_1.updateConfig(function (config) {
                config.accounts[tokenResponse.item_id] = {
                    id: tokenResponse.item_id,
                    integration: integrations_1.IntegrationId.Plaid,
                    token: tokenResponse.access_token
                };
                _this.config = config;
                return config;
            });
        };
        this.accountSetup = function () {
            return new Promise(function (resolve, reject) {
                var client = _this.client;
                var app = express_1["default"]()
                    .use(body_parser_1["default"].json())
                    .use(body_parser_1["default"].urlencoded({ extended: true }))
                    .use(express_1["default"].static(path_1["default"].resolve(path_1["default"].join(__dirname, '../../../docs'))));
                var server;
                app.post('/get_access_token', function (req, res) {
                    if (req.body.public_token !== undefined) {
                        client.exchangePublicToken(req.body.public_token, function (error, tokenResponse) {
                            if (error != null) {
                                reject(logging_1.logError('Encountered error exchanging Plaid public token.', error));
                            }
                            _this.savePublicToken(tokenResponse);
                            resolve(logging_1.logInfo('Plaid access token saved.', req.body));
                        });
                    }
                    else if (req.body.exit !== undefined) {
                        resolve(logging_1.logInfo('Plaid authentication exited.', req.body));
                    }
                    else {
                        if ((req.body.error['error-code'] = 'item-no-error')) {
                            resolve(logging_1.logInfo('Account is OK, no further action is required.', req.body));
                        }
                        else {
                            reject(logging_1.logError('Encountered error during authentication.', req.body));
                        }
                    }
                    return res.json({});
                });
                app.post('/accounts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var accounts, _loop_1, this_1, _a, _b, _i, accountId;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                accounts = [];
                                _loop_1 = function (accountId) {
                                    var accountConfig, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                accountConfig = this_1.config.accounts[accountId];
                                                if (!(accountConfig.integration === integrations_1.IntegrationId.Plaid)) return [3 /*break*/, 4];
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, this_1.client.getAccounts(accountConfig.token).then(function (resp) {
                                                        accounts.push({
                                                            name: resp.accounts[0].name,
                                                            token: accountConfig.token
                                                        });
                                                    })];
                                            case 2:
                                                _b.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                _a = _b.sent();
                                                accounts.push({
                                                    name: 'Error fetching account name',
                                                    token: accountConfig.token
                                                });
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                };
                                this_1 = this;
                                _a = [];
                                for (_b in this.config.accounts)
                                    _a.push(_b);
                                _i = 0;
                                _c.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                accountId = _a[_i];
                                return [5 /*yield**/, _loop_1(accountId)];
                            case 2:
                                _c.sent();
                                _c.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, res.json(accounts)];
                        }
                    });
                }); });
                app.post('/create_link_token', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var clientUserId, options;
                    return __generator(this, function (_a) {
                        clientUserId = this.user.client_user_id;
                        options = {
                            user: {
                                client_user_id: clientUserId
                            },
                            client_name: 'Mintable',
                            products: ['transactions'],
                            country_codes: ['US'],
                            language: 'en' // TODO
                        };
                        if (req.body.access_token) {
                            options.access_token = req.body.access_token;
                            delete options.products;
                        }
                        this.client.createLinkToken(options, function (err, data) {
                            if (err) {
                                logging_1.logError('Error creating Plaid link token.', err);
                            }
                            logging_1.logInfo('Successfully created Plaid link token.');
                            res.json({ link_token: data.link_token });
                        });
                        return [2 /*return*/];
                    });
                }); });
                app.post('/remove', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, config_1.updateConfig(function (config) {
                                        Object.values(config.accounts).forEach(function (account) {
                                            var accountConfig = account;
                                            if (accountConfig.hasOwnProperty('token') && accountConfig.token == req.body.token) {
                                                delete config.accounts[accountConfig.id];
                                            }
                                        });
                                        _this.config = config;
                                        return config;
                                    })];
                            case 1:
                                _a.sent();
                                logging_1.logInfo('Successfully removed Plaid account.', req.body.token);
                                return [2 /*return*/, res.json({})];
                            case 2:
                                error_1 = _a.sent();
                                logging_1.logError('Error removing Plaid account.', error_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.post('/done', function (req, res) {
                    res.json({});
                    return server.close();
                });
                app.get('/', function (req, res) {
                    return res.sendFile(path_1["default"].resolve(path_1["default"].join(__dirname, '../../../src/integrations/plaid/account-setup.html')));
                });
                server = require('http')
                    .createServer(app)
                    .listen('8000');
            });
        };
        this.fetchPagedTransactions = function (accountConfig, startDate, endDate) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dateFormat, start, end, options, accounts, next_page, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    accountConfig = accountConfig;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 6, , 7]);
                                    dateFormat = 'yyyy-MM-dd';
                                    start = date_fns_1.format(startDate, dateFormat);
                                    end = date_fns_1.format(endDate, dateFormat);
                                    options = { count: 500, offset: 0 };
                                    return [4 /*yield*/, this.client.getTransactions(accountConfig.token, start, end, options)];
                                case 2:
                                    accounts = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!(accounts.transactions.length < accounts.total_transactions)) return [3 /*break*/, 5];
                                    options.offset += options.count;
                                    return [4 /*yield*/, this.client.getTransactions(accountConfig.token, start, end, options)];
                                case 4:
                                    next_page = _a.sent();
                                    accounts.transactions = accounts.transactions.concat(next_page.transactions);
                                    return [3 /*break*/, 3];
                                case 5: return [2 /*return*/, resolve(accounts)];
                                case 6:
                                    e_1 = _a.sent();
                                    return [2 /*return*/, reject(e_1)];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.fetchAccount = function (accountConfig, startDate, endDate) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (startDate < date_fns_1.subMonths(new Date(), 5)) {
                    logging_1.logWarn('Transaction history older than 6 months may not be available for some institutions.', {});
                }
                return [2 /*return*/, this.fetchPagedTransactions(accountConfig, startDate, endDate)
                        .then(function (data) {
                        var accounts = data.accounts.map(function (account) { return ({
                            integration: integrations_1.IntegrationId.Plaid,
                            accountId: account.account_id,
                            mask: account.mask,
                            institution: account.name,
                            account: account.official_name,
                            type: account.subtype || account.type,
                            current: account.balances.current,
                            available: account.balances.available,
                            limit: account.balances.limit,
                            currency: account.balances.iso_currency_code || account.balances.unofficial_currency_code
                        }); });
                        var transactions = data.transactions.map(function (transaction) { return ({
                            integration: integrations_1.IntegrationId.Plaid,
                            name: transaction.name,
                            date: date_fns_1.parseISO(transaction.date),
                            amount: transaction.amount,
                            currency: transaction.iso_currency_code || transaction.unofficial_currency_code,
                            type: transaction.transaction_type,
                            accountId: transaction.account_id,
                            transactionId: transaction.transaction_id,
                            pendingtransactionId: transaction.pending_transaction_id,
                            category: transaction.category.join(' - '),
                            address: transaction.location.address,
                            city: transaction.location.city,
                            state: transaction.location.region,
                            postal_code: transaction.location.postal_code,
                            country: transaction.location.country,
                            latitude: transaction.location.lat,
                            longitude: transaction.location.lon,
                            pending: transaction.pending
                        }); });
                        accounts = accounts.map(function (account) { return (__assign(__assign({}, account), { transactions: transactions
                                .filter(function (transaction) { return transaction.accountId === account.accountId; })
                                .map(function (transaction) { return (__assign(__assign({}, transaction), { institution: account.institution, account: account.account })); }) })); });
                        logging_1.logInfo("Fetched " + data.accounts.length + " sub-accounts and " + data.total_transactions + " transactions.", accounts);
                        return accounts;
                    })["catch"](function (error) {
                        logging_1.logError("Error fetching account " + accountConfig.id + ".", error);
                        return [];
                    })];
            });
        }); };
        this.config = config;
        this.plaidConfig = this.config.integrations[integrations_1.IntegrationId.Plaid];
        this.environment =
            this.plaidConfig.environment === plaid_2.PlaidEnvironmentType.Development
                ? plaid_1["default"].environments.development
                : plaid_1["default"].environments.sandbox;
        this.client = new plaid_1["default"].Client({
            clientID: this.plaidConfig.credentials.clientId,
            secret: this.plaidConfig.credentials.secret,
            env: this.environment,
            options: {
                version: '2019-05-29'
            }
        });
        // In production this is supposed to be a unique identifier but for Mintable we only have one user (you)
        this.user = {
            client_user_id: PLAID_USER_ID
        };
    }
    return PlaidIntegration;
}());
exports.PlaidIntegration = PlaidIntegration;
