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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupConsoleInterface = void 0;
var readline_1 = __importDefault(require("readline"));
var configHelper_1 = require("./configHelper");
var utils_1 = require("./utils");
var BAF_1 = require("./BAF");
var ingameMessageHandler_1 = require("./ingameMessageHandler");
var logger_1 = require("./logger");
function processInput(input, bot, ws) {
    return __awaiter(this, void 0, void 0, function () {
        var lowercaseInput, window1, items_1, window2, items, splits, command, canStillClaim, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lowercaseInput = input.toLowerCase();
                    if (!((lowercaseInput === null || lowercaseInput === void 0 ? void 0 : lowercaseInput.startsWith('/visit')) && (input === null || input === void 0 ? void 0 : input.split(' ').length) >= 2)) return [3 /*break*/, 8];
                    window1 = bot.currentWindow;
                    bot.state = 'purchasing';
                    if (!window1) return [3 /*break*/, 4];
                    bot.closeWindow(window1);
                    return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                case 1:
                    _a.sent();
                    bot.chat(input);
                    return [4 /*yield*/, (0, utils_1.sleep)(5000)];
                case 2:
                    _a.sent();
                    window1 = bot.currentWindow;
                    items_1 = window1.containerItems();
                    items_1 = items_1.filter(function (item) { return item.name !== 'black_stained_glass_pane'; });
                    (0, utils_1.clickWindow)(bot, 11);
                    (0, utils_1.clickWindow)(bot, 13);
                    return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                case 3:
                    _a.sent();
                    bot.removeAllListeners('windowOpen');
                    bot.state = null;
                    bot.closeWindow(window1);
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                case 5:
                    _a.sent();
                    bot.chat(input);
                    return [4 /*yield*/, (0, utils_1.sleep)(5000)];
                case 6:
                    _a.sent();
                    window2 = bot.currentWindow;
                    items = window2.containerItems();
                    items = items.filter(function (item) { return item.name !== 'black_stained_glass_pane'; });
                    (0, utils_1.clickWindow)(bot, 11);
                    (0, utils_1.clickWindow)(bot, 13);
                    return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                case 7:
                    _a.sent();
                    bot.removeAllListeners('windowOpen');
                    bot.state = null;
                    bot.closeWindow(window2);
                    return [2 /*return*/];
                case 8:
                    if (!(((lowercaseInput === null || lowercaseInput === void 0 ? void 0 : lowercaseInput.startsWith('/cofl')) || (input === null || input === void 0 ? void 0 : input.startsWith('/baf'))) && (input === null || input === void 0 ? void 0 : input.split(' ').length) >= 2)) return [3 /*break*/, 9];
                    splits = input.split(' ');
                    splits.shift(); // remove /cofl
                    command = splits.shift();
                    ws.send(JSON.stringify({
                        type: command,
                        data: "\"".concat(splits.join(' '), "\"")
                    }));
                    return [3 /*break*/, 18];
                case 9:
                    if (!(lowercaseInput === null || lowercaseInput === void 0 ? void 0 : lowercaseInput.startsWith('/forceclaim'))) return [3 /*break*/, 17];
                    (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fForce claiming...");
                    canStillClaim = true;
                    _a.label = 10;
                case 10:
                    if (!canStillClaim) return [3 /*break*/, 16];
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 14, , 15]);
                    return [4 /*yield*/, (0, ingameMessageHandler_1.claimPurchased)(bot)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_1 = _a.sent();
                    canStillClaim = false;
                    (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fRan into error while claiming. Please check your logs or report this to the developer.");
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 10];
                case 16:
                    (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fFinished claiming.");
                    return [2 /*return*/];
                case 17:
                    (0, logger_1.printMcChatToConsole)("oopsies");
                    _a.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
}
var consoleSetupFinished = false;
function setupConsoleInterface(bot) {
    var _this = this;
    if (!(0, configHelper_1.getConfigProperty)('ENABLE_CONSOLE_INPUT') || consoleSetupFinished) {
        return;
    }
    consoleSetupFinished = true;
    var rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('line', function (input) { return __awaiter(_this, void 0, void 0, function () {
        var ws;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, BAF_1.getCurrentWebsocket)()];
                case 1:
                    ws = _a.sent();
                    if (((input === null || input === void 0 ? void 0 : input.startsWith('/')) && !(input === null || input === void 0 ? void 0 : input.startsWith('/cofl'))) && (input === null || input === void 0 ? void 0 : input.split(' ').length) >= 2) {
                        bot.chat(input);
                    }
                    else {
                        processInput(input, bot, ws);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.setupConsoleInterface = setupConsoleInterface;
//# sourceMappingURL=consoleHandler.js.map