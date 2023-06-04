"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var config_1 = require("../common/config");
var yargs_1 = require("yargs");
var logging_1 = require("../common/logging");
var os = __importStar(require("os"));
var integrations_1 = require("../types/integrations");
var google_1 = require("../types/integrations/google");
exports.getOldConfig = function () {
    if (yargs_1.argv['old-config-file']) {
        var path = yargs_1.argv['old-config-file'].replace(/^~(?=$|\/|\\)/, os.homedir());
        return { type: 'file', path: path };
    }
    logging_1.logError('You need to specify the --old-config-file argument.');
};
exports["default"] = (function () {
    try {
        var oldConfigSource = exports.getOldConfig();
        var oldConfigString = config_1.readConfig(oldConfigSource);
        var oldConfig_1 = config_1.parseConfig(oldConfigString);
        var deprecatedProperties = ['HOST', 'PORT', 'CATEGORY_OVERRIDES', 'DEBUG', 'CREATE_BALANCES_SHEET', 'DEBUG'];
        deprecatedProperties.forEach(function (prop) {
            if (oldConfig_1.hasOwnProperty(prop)) {
                logging_1.logWarn("Config property '" + prop + "' is deprecated and will not be migrated.");
                if (prop === 'DEBUG') {
                    logging_1.logInfo("You can now use the --debug argument to log request output.");
                }
            }
        });
        // Update to new Account syntax
        var balanceColumns = oldConfig_1['BALANCE_COLUMNS'].map(function (col) {
            switch (col) {
                case 'name':
                    return 'institution';
                case 'official_name':
                    return 'account';
                case 'balances.available':
                    return 'available';
                case 'balances.current':
                    return 'current';
                case 'balances.limit':
                    return 'limit';
                default:
                    return col;
            }
        });
        // Update to new Transaction syntax
        var transactionColumns = oldConfig_1['TRANSACTION_COLUMNS'].map(function (col) {
            switch (col) {
                case 'category.0':
                case 'category.1':
                    return 'category';
                default:
                    return col;
            }
        });
        var accounts_1 = {};
        Object.keys(oldConfig_1).map(function (key) {
            if (key.includes('PLAID_TOKEN')) {
                var account = {
                    id: key.replace('PLAID_TOKEN_', ''),
                    integration: integrations_1.IntegrationId.Plaid,
                    token: oldConfig_1[key]
                };
                accounts_1[account.id] = account;
            }
        });
        var newConfigSource = config_1.getConfigSource();
        config_1.writeConfig(newConfigSource, {
            integrations: {
                google: {
                    id: integrations_1.IntegrationId.Google,
                    type: integrations_1.IntegrationType.Export,
                    name: 'Google Sheets',
                    credentials: {
                        keyFile: oldConfig_1['SHEETS_CLIENT_ID'],
                        scope: google_1.defaultGoogleConfig.credentials.scope
                    },
                    documentId: oldConfig_1['SHEETS_SHEET_ID'],
                    template: {
                        documentId: oldConfig_1['TEMPLATE_SHEET']['SHEET_ID'],
                        sheetTitle: oldConfig_1['TEMPLATE_SHEET']['SHEET_TITLE']
                    }
                },
                plaid: {
                    id: integrations_1.IntegrationId.Plaid,
                    type: integrations_1.IntegrationType.Import,
                    name: 'Plaid',
                    environment: oldConfig_1['PLAID_ENVIRONMENT'],
                    credentials: {
                        clientId: oldConfig_1['PLAID_CLIENT_ID'],
                        secret: oldConfig_1['PLAID_SECRET']
                    }
                }
            },
            accounts: accounts_1,
            transactions: {
                integration: integrations_1.IntegrationId.Google,
                properties: transactionColumns.concat(oldConfig_1['REFERENCE_COLUMNS'])
            },
            balances: {
                integration: integrations_1.IntegrationId.Google,
                properties: balanceColumns
            }
        });
    }
    catch (e) {
        logging_1.logError('Error migrating configuration.', e);
    }
});
