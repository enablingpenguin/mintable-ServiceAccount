"use strict";
exports.__esModule = true;
var integrations_1 = require("../integrations");
exports.defaultCSVExportConfig = {
    name: 'CSV-Export',
    id: integrations_1.IntegrationId.CSVExport,
    type: integrations_1.IntegrationType.Export,
    transactionPath: '',
    balancePath: '',
    dateFormat: 'yyyy-MM-dd'
};
