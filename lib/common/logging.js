"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var chalk = require('chalk');
var yargs_1 = require("yargs");
var util_1 = require("util");
var os = __importStar(require("os"));
var LogLevel;
(function (LogLevel) {
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
    LogLevel["Error"] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var sanitize = function (data) {
    var blacklist = [
        'account.?id',
        'account',
        'client.?id',
        'client.?secret',
        'private.?key',
        'private.?token',
        'public.?key',
        'public.?token',
        'refresh.?token',
        'secret',
        'spreadsheet.?id',
        'spreadsheet',
        'token'
    ];
    if (typeof data === 'string') {
        blacklist.forEach(function (term) {
            data = data.replace(RegExp("(" + term + ").?(.*)", 'gi'), "$1=<redacted>");
        });
        return data;
    }
    else if (typeof data === 'boolean') {
        return data;
    }
    else if (typeof data === 'number') {
        return data;
    }
    else if (Array.isArray(data)) {
        return data.map(sanitize);
    }
    else if (typeof data === 'object') {
        var sanitized = {};
        for (var key in data) {
            sanitized[sanitize(key)] = sanitize(data[key]);
        }
        return sanitized;
    }
    else {
        return '[redacted]';
    }
};
exports.log = function (request) {
    if (yargs_1.argv['ci']) {
        request.message = sanitize(request.message);
        request.data = sanitize(request.data);
    }
    var date = chalk.bold(new Date().toISOString());
    var level = chalk.bold("[" + request.level.toUpperCase() + "]");
    var text = date + " " + level + " " + request.message;
    switch (request.level) {
        case LogLevel.Error:
            console.error(chalk.red(text));
            console.error('\n', chalk.red(util_1.inspect(request.data, true, 10)), '\n');
            var searchIssuesLink = encodeURI("https://github.com/kevinschaich/mintable/issues?q=is:issue+" + request.message);
            var searchIssuesHelpText = "You can check if anybody else has encountered this issue on GitHub:\n" + searchIssuesLink + "\n";
            console.warn(chalk.yellow(searchIssuesHelpText));
            var systemInfo = "arch: " + os.arch() + "\nplatform: " + os.platform() + "\nos: v" + os.release() + "\nmintable: v" + require('../../package.json').version + "\nnode: " + process.version;
            var reportIssueBody = '**Steps to Reproduce:**\n\n1.\n2.\n3.\n\n**Error:**\n\n```\n<Paste Full Error Content Here>\n```\n\n**System Info:**\n\n```\n' +
                systemInfo +
                '\n```';
            var reportIssueLink = encodeURI("https://github.com/kevinschaich/mintable/issues/new?title=Error:+" + request.message + "&body=" + reportIssueBody);
            var reportIssueHelpText = "If this is a new issue, please use this link to report it:\n" + reportIssueLink + "\n";
            console.warn(chalk.yellow(reportIssueHelpText));
            process.exit(1);
        case LogLevel.Warn:
            console.warn(chalk.yellow(text));
            break;
        case LogLevel.Info:
            console.info(text);
            break;
        default:
            break;
    }
    if (yargs_1.argv['debug']) {
        try {
            console.log('\n', util_1.inspect(request.data, true, 10), '\n');
        }
        catch (e) {
            console.log('\n', JSON.stringify(request.data, null, 2), '\n');
        }
    }
};
exports.logError = function (message, data) {
    exports.log({ level: LogLevel.Error, message: message, data: data });
};
exports.logWarn = function (message, data) {
    exports.log({ level: LogLevel.Warn, message: message, data: data });
};
exports.logInfo = function (message, data) {
    exports.log({ level: LogLevel.Info, message: message, data: data });
};
