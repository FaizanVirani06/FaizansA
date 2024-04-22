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
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipHandler = exports.registerIngameMessage = void 0;
var configHelper_1 = require("./configHelper");
var fastWindowClick_1 = require("./fastWindowClick");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var webhookHandler_1 = require("./webhookHandler");
var ingameMessageHandler_1 = require("./ingameMessageHandler");
var notcoins = false;
var globalText = "";
var buy_total = 0;
function registerIngameMessage(bot, wss) {
    bot.on('message', function (message, type) {
        var text = message.getText(null);
        if (type == 'chat') {
            if (text.startsWith("You") && text.includes("don't have") && text.includes('afford this bid')) {
                notcoins = true;
            }
            if (text.startsWith('You') && text.includes('purchased') && text.includes('for')) {
                globalText = text;
            }
        }
    });
}
exports.registerIngameMessage = registerIngameMessage;
function flipHandler(bot, flip) {
    return __awaiter(this, void 0, void 0, function () {
        var timeout, isBed, delayUntilBuyStart, value, valueMinus3_5Percent, result, parts, formattedValue, numericValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flip.purchaseAt = new Date(flip.purchaseAt);
                    if (bot.state) {
                        setTimeout(function () {
                            flipHandler(bot, flip);
                        }, 1100);
                        return [2 /*return*/];
                    }
                    bot.state = 'purchasing';
                    timeout = setTimeout(function () {
                        if (bot.state === 'purchasing') {
                            (0, logger_1.log)("Resetting 'bot.state === purchasing' lock");
                            bot.state = null;
                            bot.removeAllListeners('windowOpen');
                        }
                    }, 10000);
                    isBed = flip.purchaseAt.getTime() > new Date().getTime();
                    delayUntilBuyStart = isBed ? flip.purchaseAt.getTime() - new Date().getTime() - (0, configHelper_1.getConfigProperty)('DELAY_TO_REMOVE_BED') : (0, configHelper_1.getConfigProperty)('FLIP_ACTION_DELAY');
                    bot.lastViewAuctionCommandForPurchase = "/viewauction ".concat(flip.id);
                    return [4 /*yield*/, (0, utils_1.sleep)(delayUntilBuyStart)];
                case 1:
                    _a.sent();
                    bot.chat(bot.lastViewAuctionCommandForPurchase);
                    (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fTrying to purchase flip".concat(isBed ? ' (Bed)' : '', ": ").concat(flip.itemName, " \u00A7ffor ").concat((0, utils_1.numberWithThousandsSeparators)(flip.startingBid), " coins (Target: ").concat((0, utils_1.numberWithThousandsSeparators)(flip.target), ")"));
                    if (!(0, configHelper_1.getConfigProperty)('USE_WINDOW_SKIPS')) return [3 /*break*/, 2];
                    useWindowSkipPurchase(flip, isBed);
                    // clear timeout after 1sec, so there are no weird overlaps that mess up the windowIds
                    setTimeout(function () {
                        bot.state = null;
                        clearTimeout(timeout);
                    }, 2500);
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, useRegularPurchase(bot, isBed)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                case 4:
                    _a.sent();
                    if (globalText.startsWith('You purchased')) {
                        (0, ingameMessageHandler_1.claimPurchased)(bot);
                        value = flip.target - flip.startingBid;
                        valueMinus3_5Percent = value * 0.965;
                        result = (0, utils_1.numberWithThousandsSeparators)(valueMinus3_5Percent);
                        parts = result.split(".");
                        formattedValue = parts[0];
                        numericValue = Number(formattedValue.replace(/,/g, ''));
                        if (numericValue < 100000000) {
                            (0, webhookHandler_1.sendWebhookItemPurchased)(globalText.split(' purchased ')[1].split(' for ')[0], globalText.split(' for ')[1].split(' coins!')[0], "".concat("+" + formattedValue));
                        }
                        if (numericValue >= 100000000) {
                            (0, webhookHandler_1.sendWebhookItemPurchased100M)(globalText.split(' purchased ')[1].split(' for ')[0], globalText.split(' for ')[1].split(' coins!')[0], "".concat("+" + formattedValue));
                        }
                        globalText = '';
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.flipHandler = flipHandler;
function useRegularPurchase(bot, isBed) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            bot.addListener('windowOpen', function (window) { return __awaiter(_this, void 0, void 0, function () {
                var title, window1, total_clicks, items, bedItem, potatoItem, title_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            title = (0, utils_1.getWindowTitle)(window);
                            window1 = bot.currentWindow;
                            total_clicks = 0;
                            if (!(isBed && title.toString().includes('BIN Auction View'))) return [3 /*break*/, 4];
                            items = window1.containerItems();
                            // Filtrar o item 'black_stained_glass_pane'
                            items = items.filter(function (item) { return item.name !== 'black_stained_glass_pane'; });
                            bedItem = items.find(function (item) { return item.name === 'red_bed'; });
                            potatoItem = items.find(function (item) { return item.name === 'potato'; });
                            if (potatoItem) {
                                console.log('Item "potato" encontrado. Parando o loop...');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            if (!(bedItem && !title.toString().includes('Confirm Purchase') && !potatoItem)) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, utils_1.sleep)((0, configHelper_1.getConfigProperty)('DELAY_BETWEEN_CLICKS'))];
                        case 2:
                            _a.sent();
                            (0, utils_1.clickWindow)(bot, 31);
                            total_clicks++;
                            // Atualizar a janela e a lista de itens
                            window1 = bot.currentWindow;
                            title = (0, utils_1.getWindowTitle)(window1);
                            items = window1.containerItems().filter(function (item) { return item.name !== 'black_stained_glass_pane'; });
                            potatoItem = items.find(function (item) { return item.name === 'potato'; });
                            if (potatoItem) {
                                console.log('Item "potato" found. Stopping the loop.');
                                return [3 /*break*/, 3];
                            }
                            if (notcoins || total_clicks > 300) {
                                title_1 = (0, utils_1.getWindowTitle)(window1);
                                if (title_1.toString().includes('BIN Auction View')) {
                                    (0, logger_1.printMcChatToConsole)("§f[§4BAF§f]: §cClosing this flip because you don't have enough coins to purchase!");
                                    bot.removeAllListeners('windowOpen');
                                    bot.state = null;
                                    bot.closeWindow(window);
                                    notcoins = false;
                                    return [2 /*return*/];
                                }
                            }
                            return [3 /*break*/, 1];
                        case 3:
                            (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7l\u00A76Clicked ".concat(total_clicks, " times on the bed."));
                            total_clicks = 0;
                            _a.label = 4;
                        case 4:
                            if (title.toString().includes('BIN Auction View')) {
                                (0, utils_1.clickWindow)(bot, 31);
                            }
                            if (isBed && title.toString().includes('Confirm Purchase')) {
                                (0, utils_1.clickWindow)(bot, 11);
                                bot.removeAllListeners('windowOpen');
                                bot.state = null;
                                return [2 /*return*/];
                            }
                            if (title.toString().includes('Confirm Purchase')) {
                                (0, utils_1.clickWindow)(bot, 11);
                                bot.removeAllListeners('windowOpen');
                                bot.state = null;
                                return [2 /*return*/];
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function useWindowSkipPurchase(flip, isBed) {
    return __awaiter(this, void 0, void 0, function () {
        var lastWindowId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastWindowId = (0, fastWindowClick_1.getFastWindowClicker)().getLastWindowId();
                    if (isBed) {
                        (0, fastWindowClick_1.getFastWindowClicker)().clickBedPurchase(flip.startingBid, lastWindowId + 1);
                    }
                    else {
                        (0, fastWindowClick_1.getFastWindowClicker)().clickPurchase(flip.startingBid, lastWindowId + 1);
                    }
                    return [4 /*yield*/, (0, utils_1.sleep)((0, configHelper_1.getConfigProperty)('FLIP_ACTION_DELAY'))];
                case 1:
                    _a.sent();
                    (0, fastWindowClick_1.getFastWindowClicker)().clickConfirm(flip.startingBid, flip.itemName, lastWindowId + 2);
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=flipHandler.js.map