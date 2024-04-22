"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigProperty = exports.updatePersistentConfigProperty = exports.initConfigHelper = void 0;
var fs = require('fs');
var path = require('path');
var filePath = path.join(process.pkg ? process.argv[0] : process.argv[1], '..', 'config.toml');
var json2toml = require('json2toml');
var toml = require('toml');
var config = {
    INGAME_NAME: '',
    WEBHOOK_URL: '',
    ENABLE_CONSOLE_INPUT: true,
    USE_COFL_CHAT: true,
    SESSIONS: {},
    USE_WINDOW_SKIPS: false,
    US_INSTANCE: false,
    DELAY_BETWEEN_CLICKS: 50,
    DELAY_TO_REMOVE_BED: 400
};
json2toml({ simple: true });
function initConfigHelper() {
    if (fs.existsSync(filePath)) {
        var existingConfig_1 = toml.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
        // add new default values to existing config if new property was added in newer version
        var hadChange_1 = false;
        Object.keys(config).forEach(function (key) {
            if (existingConfig_1[key] === undefined) {
                existingConfig_1[key] = config[key];
                hadChange_1 = true;
            }
        });
        if (hadChange_1) {
            fs.writeFileSync(filePath, json2toml(existingConfig_1));
        }
        config = existingConfig_1;
    }
}
exports.initConfigHelper = initConfigHelper;
function updatePersistentConfigProperty(property, value) {
    config[property] = value;
    fs.writeFileSync(filePath, json2toml(config));
}
exports.updatePersistentConfigProperty = updatePersistentConfigProperty;
function getConfigProperty(property) {
    return config[property];
}
exports.getConfigProperty = getConfigProperty;
//# sourceMappingURL=configHelper.js.map