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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var integrations_1 = require("../types/integrations");
var logging_1 = require("./logging");
var yargs_1 = require("yargs");
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
var path_1 = require("path");
var typescript_json_schema_1 = require("typescript-json-schema");
var ajv_1 = __importDefault(require("ajv"));
var jsonc_1 = require("jsonc");
var DEFAULT_CONFIG_FILE = '~/mintable.jsonc';
var DEFAULT_CONFIG_VAR = 'MINTABLE_CONFIG';
var DEFAULT_CONFIG = {
    accounts: {},
    transactions: {
        integration: integrations_1.IntegrationId.Google,
        properties: ['date', 'amount', 'name', 'account', 'category']
    },
    balances: {
        integration: integrations_1.IntegrationId.Google,
        properties: ['institution', 'account', 'type', 'current', 'available', 'limit', 'currency']
    },
    integrations: {}
};
exports.getConfigSource = function () {
    if (yargs_1.argv['config-file']) {
        var path_2 = yargs_1.argv['config-file'].replace(/^~(?=$|\/|\\)/, os.homedir());
        logging_1.logInfo("Using configuration file `" + path_2 + ".`");
        return { type: 'file', path: path_2 };
    }
    if (process.env[DEFAULT_CONFIG_VAR]) {
        logging_1.logInfo("Using configuration variable '" + DEFAULT_CONFIG_VAR + ".'");
        return { type: 'environment', variable: DEFAULT_CONFIG_VAR };
    }
    // Default to DEFAULT_CONFIG_FILE
    var path = DEFAULT_CONFIG_FILE.replace(/^~(?=$|\/|\\)/, os.homedir());
    logging_1.logInfo("Using default configuration file `" + path + ".`");
    logging_1.logInfo("You can supply either --config-file or --config-variable to specify a different configuration.");
    return { type: 'file', path: path };
};
exports.readConfig = function (source, checkExists) {
    if (source.type === 'file') {
        try {
            var config = fs.readFileSync(source.path, 'utf8');
            logging_1.logInfo('Successfully opened configuration file.');
            return config;
        }
        catch (e) {
            if (checkExists) {
                logging_1.logInfo('Unable to open config file.');
            }
            else {
                logging_1.logError('Unable to open configuration file.', e);
                logging_1.logInfo("You may want to run `mintable setup` (or `mintable migrate`) if you haven't already.");
            }
        }
    }
    if (source.type === 'environment') {
        try {
            var config = process.env[source.variable];
            if (config === undefined) {
                throw "Variable `" + source.variable + "` not defined in environment.";
            }
            logging_1.logInfo('Successfully retrieved configuration variable.');
            return config;
        }
        catch (e) {
            if (!checkExists) {
                logging_1.logInfo('Unable to read config variable from env.');
            }
            else {
                logging_1.logError('Unable to read config variable from env.', e);
            }
        }
    }
};
exports.parseConfig = function (configString) {
    try {
        var parsedConfig = jsonc_1.jsonc.parse(configString);
        logging_1.logInfo('Successfully parsed configuration.');
        return parsedConfig;
    }
    catch (e) {
        logging_1.logError('Unable to parse configuration.', e);
    }
};
exports.getConfigSchema = function () {
    var basePath = path_1.resolve(path_1.join(__dirname, '../..'));
    var config = path_1.resolve(path_1.join(basePath, 'src/common/config.ts'));
    var tsconfig = require(path_1.resolve(path_1.join(basePath, 'tsconfig.json')));
    var types = path_1.resolve(path_1.join(basePath, 'node_modules/@types'));
    // Generate JSON schema at runtime for Config interface above
    var compilerOptions = __assign(__assign({}, tsconfig.compilerOptions), { typeRoots: [types], baseUrl: basePath });
    var settings = {
        required: true,
        defaultProps: true,
        noExtraProps: true
    };
    try {
        var program = typescript_json_schema_1.getProgramFromFiles([config], compilerOptions, basePath);
        var configSchema = typescript_json_schema_1.generateSchema(program, 'Config', settings);
        return configSchema;
    }
    catch (e) {
        logging_1.logError('Could not generate config schema.', e);
    }
};
exports.validateConfig = function (parsedConfig) {
    var configSchema = exports.getConfigSchema();
    // Validate parsed configuration object against generated JSON schema
    try {
        var validator = new ajv_1["default"]();
        var valid = validator.validate(configSchema, parsedConfig);
        if (!valid) {
            logging_1.logError('Unable to validate configuration.', validator.errors);
        }
    }
    catch (e) {
        logging_1.logError('Unable to validate configuration.', e);
    }
    var validatedConfig = parsedConfig;
    logging_1.logInfo('Successfully validated configuration.');
    return validatedConfig;
};
exports.getConfig = function () {
    var configSource = exports.getConfigSource();
    var configString = exports.readConfig(configSource);
    var parsedConfig = exports.parseConfig(configString);
    var validatedConfig = exports.validateConfig(parsedConfig);
    return validatedConfig;
};
exports.writeConfig = function (source, config) {
    if (source.type === 'file') {
        try {
            fs.writeFileSync(source.path, jsonc_1.jsonc.stringify(config, null, 2));
            logging_1.logInfo('Successfully wrote configuration file.');
        }
        catch (e) {
            logging_1.logError('Unable to write configuration file.', e);
        }
    }
    if (source.type === 'environment') {
        logging_1.logError('Node does not have permissions to modify global environment variables. Please use file-based configuration to make changes.');
    }
};
exports.updateConfig = function (configTransformer, initialize) {
    var newConfig;
    var configSource = exports.getConfigSource();
    if (initialize) {
        newConfig = configTransformer(DEFAULT_CONFIG);
    }
    else {
        var configString = exports.readConfig(configSource);
        var oldConfig = exports.parseConfig(configString);
        newConfig = configTransformer(oldConfig);
    }
    var validatedConfig = exports.validateConfig(newConfig);
    exports.writeConfig(configSource, validatedConfig);
    return validatedConfig;
};
