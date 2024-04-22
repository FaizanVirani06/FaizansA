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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWebsocket = void 0;
var mineflayer_1 = require("mineflayer");
var fastWindowClick_1 = require("./fastWindowClick");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var sellHandler_1 = require("./sellHandler");
var tradeHandler_1 = require("./tradeHandler");
var swapProfileHandler_1 = require("./swapProfileHandler");
var flipHandler_1 = require("./flipHandler");
var ingameMessageHandler_1 = require("./ingameMessageHandler");
var configHelper_1 = require("./configHelper");
var coflSessionManager_1 = require("./coflSessionManager");
var webhookHandler_1 = require("./webhookHandler");
var consoleHandler_1 = require("./consoleHandler");
var AFKHandler_1 = require("./AFKHandler");
var fs = require('fs');
var path = require('path');
var WebSocket = require('ws');
var prompt = require('prompt-sync')();
(0, configHelper_1.initConfigHelper)();
(0, logger_1.initLogger)();
var version = '1.5.0-af';
var _websocket;
var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
if (!ingameName) {
    ingameName = prompt('Enter your ingame name: ');
    (0, configHelper_1.updatePersistentConfigProperty)('INGAME_NAME', ingameName);
}
var bot = (0, mineflayer_1.createBot)({
    username: ingameName,
    auth: 'microsoft',
    logErrors: true,
    version: '1.17',
    host: 'mc.hypixel.net'
});
bot.setMaxListeners(0);
bot.state = 'gracePeriod';
(0, fastWindowClick_1.createFastWindowClicker)(bot._client);
if ((0, configHelper_1.getConfigProperty)('LOG_PACKAGES')) {
    (0, logger_1.addLoggerToClientWriteFunction)(bot._client);
}
bot.once('login', function () {
    connectWebsocket();
    bot._client.on('packet', function (packet, packetMeta) {
        return __awaiter(this, void 0, void 0, function () {
            var wss, reason, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!packetMeta.name.includes('disconnect')) return [3 /*break*/, 2];
                        return [4 /*yield*/, getCurrentWebsocket()];
                    case 1:
                        wss = _a.sent();
                        wss.send(JSON.stringify({
                            type: 'report',
                            data: "\"".concat(JSON.stringify(packet), "\"")
                        }));
                        (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fYou were disconnected from the server...');
                        packet = JSON.parse(JSON.stringify(packet));
                        reason = JSON.parse(packet.reason);
                        text = reason.extra[0].text;
                        (0, webhookHandler_1.DisconnectWebwook)(text);
                        (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §f' + text);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
});
bot.once('spawn', function () { return __awaiter(void 0, void 0, void 0, function () {
    var wss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bot.waitForChunksToLoad()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.sleep)(2000)];
            case 2:
                _a.sent();
                bot.chat('/play sb');
                bot.on('scoreboardTitleChanged', onScoreboardChanged);
                (0, ingameMessageHandler_1.registerIngameMessageHandler)(bot);
                return [4 /*yield*/, getCurrentWebsocket()];
            case 3:
                wss = _a.sent();
                (0, flipHandler_1.registerIngameMessage)(bot, wss);
                return [2 /*return*/];
        }
    });
}); });
function connectWebsocket() {
    if ((0, configHelper_1.getConfigProperty)('US_INSTANCE') == true) {
        _websocket = new WebSocket("ws://sky-us.coflnet.com/modsocket?player=".concat(ingameName, "&version=").concat(version, "&SId=").concat((0, coflSessionManager_1.getSessionId)(ingameName)));
    }
    else {
        _websocket = new WebSocket("wss://sky.coflnet.com/modsocket?player=".concat(ingameName, "&version=").concat(version, "&SId=").concat((0, coflSessionManager_1.getSessionId)(ingameName)));
    }
    _websocket.onopen = function () {
        (0, consoleHandler_1.setupConsoleInterface)(bot);
    };
    _websocket.onmessage = onWebsocketMessage;
    _websocket.onclose = function (e) {
        (0, logger_1.log)('Connection closed. Reconnecting... ', 'warn');
        (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §4WS Connection closed. Reconnecting... ');
        setTimeout(function () {
            connectWebsocket();
        }, 1000);
    };
    _websocket.onerror = function (err) {
        (0, logger_1.log)('Connection error: ' + JSON.stringify(err), 'error');
        (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §4WS Connection error: ' + JSON.stringify(err));
        _websocket.close();
    };
}
function onWebsocketMessage(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var message, data, _a, _i, _b, da, isCoflChat_1, textmsg, ID, isCoflChat, tradeDisplay, wss, splits, command;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    message = JSON.parse(msg.data);
                    data = JSON.parse(message.data);
                    _a = message.type;
                    switch (_a) {
                        case 'flip': return [3 /*break*/, 1];
                        case 'chatMessage': return [3 /*break*/, 2];
                        case 'writeToChat': return [3 /*break*/, 3];
                        case 'swapProfile': return [3 /*break*/, 4];
                        case 'createAuction': return [3 /*break*/, 5];
                        case 'trade': return [3 /*break*/, 6];
                        case 'tradeResponse': return [3 /*break*/, 7];
                        case 'getInventory': return [3 /*break*/, 10];
                        case 'execute': return [3 /*break*/, 12];
                        case 'privacySettings': return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 14];
                case 1:
                    (0, logger_1.log)(message, 'debug');
                    (0, flipHandler_1.flipHandler)(bot, data);
                    return [3 /*break*/, 14];
                case 2:
                    for (_i = 0, _b = __spreadArray([], data, true); _i < _b.length; _i++) {
                        da = _b[_i];
                        isCoflChat_1 = (0, utils_1.isCoflChatMessage)(da.text);
                        if (da.text.startsWith("Your") && da.text.includes("connection id is")) {
                            textmsg = da.text.replace(',', '').split(' ');
                            ID = textmsg[4];
                            (0, webhookHandler_1.sendWebhookInitialized)(ID);
                        }
                        if (!isCoflChat_1) {
                            (0, logger_1.log)(message, 'debug');
                        }
                        if ((0, configHelper_1.getConfigProperty)('USE_COFL_CHAT') || !isCoflChat_1) {
                            (0, logger_1.printMcChatToConsole)(da.text);
                        }
                    }
                    return [3 /*break*/, 14];
                case 3:
                    isCoflChat = (0, utils_1.isCoflChatMessage)(data.text);
                    if (!isCoflChat) {
                        (0, logger_1.log)(message, 'debug');
                    }
                    if ((0, configHelper_1.getConfigProperty)('USE_COFL_CHAT') || !isCoflChat) {
                        (0, logger_1.printMcChatToConsole)(data.text);
                    }
                    return [3 /*break*/, 14];
                case 4:
                    (0, logger_1.log)(message, 'debug');
                    (0, swapProfileHandler_1.swapProfile)(bot, data);
                    return [3 /*break*/, 14];
                case 5:
                    (0, logger_1.log)(message, 'debug');
                    (0, sellHandler_1.onWebsocketCreateAuction)(bot, data);
                    return [3 /*break*/, 14];
                case 6:
                    (0, logger_1.log)(message, 'debug');
                    (0, tradeHandler_1.tradePerson)(bot, data);
                    return [3 /*break*/, 14];
                case 7:
                    tradeDisplay = bot.currentWindow.slots[39].nbt.value.display.value.Name.value;
                    if (!(tradeDisplay.includes('Deal!') || tradeDisplay.includes('Warning!'))) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, utils_1.sleep)(3400)];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    (0, utils_1.clickWindow)(bot, 39);
                    return [3 /*break*/, 14];
                case 10:
                    (0, logger_1.log)('Uploading inventory...');
                    return [4 /*yield*/, getCurrentWebsocket()];
                case 11:
                    wss = _c.sent();
                    wss.send(JSON.stringify({
                        type: 'uploadInventory',
                        data: JSON.stringify(bot.inventory)
                    }));
                    return [3 /*break*/, 14];
                case 12:
                    (0, logger_1.log)(message, 'debug');
                    if (data.startsWith('/cofl')) {
                        splits = data.split(' ');
                        splits.shift(); // remove /cofl
                        command = splits.shift();
                        wss.send(JSON.stringify({
                            type: command,
                            data: "\"".concat(splits.join(' '), "\"")
                        }));
                    }
                    else {
                        bot.chat(data);
                    }
                    return [3 /*break*/, 14];
                case 13:
                    (0, logger_1.log)(message, 'debug');
                    data.chatRegex = new RegExp(data.chatRegex);
                    bot.privacySettings = data;
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function onScoreboardChanged() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!bot.scoreboard.sidebar.items.map(function (item) { return item.displayName.getText(null).replace(item.name, ''); }).find(function (e) { return e.includes('Purse:') || e.includes('Piggy:'); })) return [3 /*break*/, 3];
                    bot.removeListener('scoreboardTitleChanged', onScoreboardChanged);
                    (0, logger_1.log)('Joined SkyBlock');
                    (0, AFKHandler_1.initAFKHandler)(bot);
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var wss;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getCurrentWebsocket()];
                                case 1:
                                    wss = _a.sent();
                                    (0, logger_1.log)('Waited for grace period to end. Flips can now be bought.');
                                    bot.state = null;
                                    bot.removeAllListeners('scoreboardTitleChanged');
                                    wss.send(JSON.stringify({
                                        type: 'uploadScoreboard',
                                        data: JSON.stringify(bot.scoreboard.sidebar.items.map(function (item) { return item.displayName.getText(null).replace(item.name, ''); }))
                                    }));
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 5500);
                    return [4 /*yield*/, (0, utils_1.sleep)(2500)];
                case 1:
                    _a.sent();
                    (0, AFKHandler_1.tryToTeleportToIsland)(bot, 0);
                    return [4 /*yield*/, (0, utils_1.sleep)(20000)
                        // trying to claim sold items if sold while user was offline
                    ];
                case 2:
                    _a.sent();
                    // trying to claim sold items if sold while user was offline
                    (0, ingameMessageHandler_1.claimSoldItem)(bot);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var executed = true;
function sendWebhookTotalsMSG(buyTotal, soldTotal) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, fileContent, lines, _i, lines_1, line, _a, key, value, fileContent2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!executed) return [3 /*break*/, 2];
                    filePath = path.join(__dirname, 'totals.txt');
                    if (!fs.existsSync(filePath)) {
                        fs.writeFileSync(filePath, 'buy_total=0\nsold_total=0');
                    }
                    fileContent = fs.readFileSync(filePath, 'utf8');
                    lines = fileContent.split('\n');
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        _a = line.split('='), key = _a[0], value = _a[1];
                        if (key === 'buy_total') {
                            buyTotal = parseInt(value, 10);
                        }
                        else if (key === 'sold_total') {
                            soldTotal = parseInt(value, 10);
                        }
                    }
                    return [4 /*yield*/, (0, webhookHandler_1.SendWebhookTotals)(buyTotal, soldTotal)];
                case 1:
                    _b.sent();
                    fileContent2 = "buy_total=0\nsold_total=0";
                    fs.writeFileSync(filePath, fileContent2);
                    executed = false;
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
sendWebhookTotalsMSG(0, 0);
var startSession = (Date.now() / 1000).toFixed(0);
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num;
}
function updateSession(buyTotal, soldTotal) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath;
        var _this = this;
        return __generator(this, function (_a) {
            filePath = path.join(__dirname, 'totals.txt');
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, 'buy_total=0\nsold_total=0');
            }
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var fileContent, lines, test, purse, _i, lines_2, line, _a, key, value;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            fileContent = fs.readFileSync(filePath, 'utf8');
                            lines = fileContent.split('\n');
                            test = bot.scoreboard.sidebar.items.map(function (item) { return item.displayName.getText(null).replace(item.name, ''); }).find(function (e) { return e.includes('Purse:') || e.includes('Piggy:'); });
                            purse = test.replace('Purse: ', '').replace(/,/g, '');
                            purse = formatNumber(Number(purse));
                            for (_i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                                line = lines_2[_i];
                                _a = line.split('='), key = _a[0], value = _a[1];
                                if (key === 'buy_total') {
                                    buyTotal = parseInt(value, 10);
                                }
                                else if (key === 'sold_total') {
                                    soldTotal = parseInt(value, 10);
                                }
                            }
                            return [4 /*yield*/, (0, webhookHandler_1.webhookInterval)(buyTotal, soldTotal, startSession, purse)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, 30 * 60 * 1000);
            return [2 /*return*/];
        });
    });
}
updateSession(0, 0);
function getCurrentWebsocket() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (_websocket.readyState === WebSocket.OPEN) {
                return [2 /*return*/, _websocket];
            }
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var socket;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, getCurrentWebsocket()];
                            case 2:
                                socket = _a.sent();
                                resolve(socket);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.getCurrentWebsocket = getCurrentWebsocket;
//# sourceMappingURL=BAF.js.map