"use strict";
exports.__esModule = true;
var integrations_1 = require("../integrations");
exports.defaultGoogleConfig = {
    name: '',
    id: integrations_1.IntegrationId.Google,
    type: integrations_1.IntegrationType.Export,
    credentials: {
        keyFile: '',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
    },
    documentId: ''
};
