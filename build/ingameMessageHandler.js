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
exports.claimSoldItem = exports.claimPurchased = exports.registerIngameMessageHandler = void 0;
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var webhookHandler_1 = require("./webhookHandler");
var BAF_1 = require("./BAF");
var fs = require('fs');
var path = require('path');
var buy_total = 0;
var sold_total = 0;
function updateFile() {
    var filePath = path.join(__dirname, 'totals.txt');
    fs.writeFileSync(filePath, "buy_total=".concat(buy_total, "\nsold_total=").concat(sold_total));
}
var errorTimeout;
function registerIngameMessageHandler(bot) {
    return __awaiter(this, void 0, void 0, function () {
        var wss;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, BAF_1.getCurrentWebsocket)()];
                case 1:
                    wss = _a.sent();
                    bot.on('message', function (message, type) {
                        var text = message.getText(null);
                        if (type == 'chat') {
                            (0, logger_1.printMcChatToConsole)(message.toAnsi());
                            if (text.startsWith('You purchased')) {
                                buy_total += 1;
                                setTimeout(function () {
                                    updateFile();
                                }, 100);
                            }
                            if (text.startsWith('[Auction]') && text.includes('bought') && text.includes('for')) {
                                (0, logger_1.log)('New item sold');
                                sold_total += 1;
                                setTimeout(function () {
                                    updateFile();
                                }, 100);
                                claimSoldItem(bot);
                                (0, webhookHandler_1.sendWebhookItemSold)(text.split(' bought ')[1].split(' for ')[0], text.split(' for ')[1].split(' coins')[0], text.split('[Auction] ')[1].split(' bought ')[0]);
                            }
                            if (bot.privacySettings && bot.privacySettings.chatRegex.test(text)) {
                                wss.send(JSON.stringify({
                                    type: 'chatBatch',
                                    data: JSON.stringify([text])
                                }));
                            }
                        }
                    });
                    setNothingBoughtFor1HourTimeout(wss);
                    return [2 /*return*/];
            }
        });
    });
}
exports.registerIngameMessageHandler = registerIngameMessageHandler;
function claimPurchased(bot, useCollectAll) {
    var _this = this;
    if (useCollectAll === void 0) { useCollectAll = true; }
    return new Promise(function (resolve, reject) {
        if (bot.state) {
            (0, logger_1.log)('Currently busy with something else (' + bot.state + ') -> not claiming purchased item');
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, claimPurchased(bot)];
                        case 1:
                            result = _a.sent();
                            resolve(result);
                            return [2 /*return*/];
                    }
                });
            }); }, 1000);
            return;
        }
        bot.state = 'claiming';
        bot.chat('/ah');
        var timeout = setTimeout(function () {
            (0, logger_1.log)('Claiming of purchased auction failed. Removing lock');
            bot.state = null;
            resolve(false);
        }, 5000);
        bot.on('windowOpen', function (window) { return __awaiter(_this, void 0, void 0, function () {
            var title, slotToClick, i, slot, name_1, lore;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                title = (0, utils_1.getWindowTitle)(window);
                (0, logger_1.log)('Claiming auction window: ' + title);
                if (title.toString().includes('Auction House')) {
                    (0, utils_1.clickWindow)(bot, 13);
                }
                if (title.toString().includes('Your Bids')) {
                    slotToClick = -1;
                    for (i = 0; i < window.slots.length; i++) {
                        slot = window.slots[i];
                        name_1 = (_f = (_e = (_d = (_c = (_b = (_a = slot === null || slot === void 0 ? void 0 : slot.nbt) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.display) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.Name) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.toString();
                        if (useCollectAll && (slot === null || slot === void 0 ? void 0 : slot.type) === 380 && (name_1 === null || name_1 === void 0 ? void 0 : name_1.includes('Claim')) && (name_1 === null || name_1 === void 0 ? void 0 : name_1.includes('All'))) {
                            (0, logger_1.log)('Found cauldron to claim all purchased auctions -> clicking index ' + i);
                            (0, utils_1.clickWindow)(bot, i);
                            bot.removeAllListeners('windowOpen');
                            bot.state = null;
                            clearTimeout(timeout);
                            resolve(true);
                            return [2 /*return*/];
                        }
                        lore = (_o = (_m = (_l = (_k = (_j = (_h = (_g = slot === null || slot === void 0 ? void 0 : slot.nbt) === null || _g === void 0 ? void 0 : _g.value) === null || _h === void 0 ? void 0 : _h.display) === null || _j === void 0 ? void 0 : _j.value) === null || _k === void 0 ? void 0 : _k.Lore) === null || _l === void 0 ? void 0 : _l.value) === null || _m === void 0 ? void 0 : _m.value) === null || _o === void 0 ? void 0 : _o.toString();
                        if ((lore === null || lore === void 0 ? void 0 : lore.includes('Status:')) && (lore === null || lore === void 0 ? void 0 : lore.includes('Sold!'))) {
                            (0, logger_1.log)('Found claimable purchased auction. Gonna click index ' + i);
                            (0, logger_1.log)(JSON.stringify(slot));
                            slotToClick = i;
                        }
                    }
                    if (slotToClick === -1) {
                        (0, logger_1.log)('No claimable purchased auction found');
                        bot.removeAllListeners('windowOpen');
                        bot.state = null;
                        bot.closeWindow(window);
                        clearTimeout(timeout);
                        resolve(false);
                        return [2 /*return*/];
                    }
                    (0, utils_1.clickWindow)(bot, slotToClick);
                }
                if (title.toString().includes('BIN Auction View')) {
                    (0, logger_1.log)('Claiming purchased auction...');
                    bot.removeAllListeners('windowOpen');
                    bot.state = null;
                    clearTimeout(timeout);
                    (0, utils_1.clickWindow)(bot, 31);
                    resolve(true);
                }
                return [2 /*return*/];
            });
        }); });
    });
}
exports.claimPurchased = claimPurchased;
function claimSoldItem(bot) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (bot.state) {
                        (0, logger_1.log)('Currently busy with something else (' + bot.state + ') -> not claiming sold item');
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, claimSoldItem(bot)];
                                    case 1:
                                        result = _a.sent();
                                        resolve(result);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                        return;
                    }
                    var timeout = setTimeout(function () {
                        (0, logger_1.log)('Seems something went wrong while claiming sold item. Removing lock');
                        bot.state = null;
                        bot.removeAllListeners('windowOpen');
                        resolve(false);
                    }, 10000);
                    bot.state = 'claiming';
                    bot.chat('/ah');
                    bot.on('windowOpen', function (window) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        var title = (0, utils_1.getWindowTitle)(window);
                        if (title.toString().includes('Auction House')) {
                            (0, utils_1.clickWindow)(bot, 15);
                        }
                        if (title.toString().includes('Manage Auctions')) {
                            (0, logger_1.log)('Claiming sold auction...');
                            var clickSlot = void 0;
                            for (var i = 0; i < window.slots.length; i++) {
                                var item = window.slots[i];
                                if (((_d = (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.nbt) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.display) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.Lore) && JSON.stringify(item.nbt.value.display.value.Lore).includes('Sold for')) {
                                    clickSlot = item.slot;
                                }
                                if (item && item.name === 'cauldron' && ((_j = (_h = (_g = (_f = (_e = item.nbt.value) === null || _e === void 0 ? void 0 : _e.display) === null || _f === void 0 ? void 0 : _f.value) === null || _g === void 0 ? void 0 : _g.Name) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.toString().includes('Claim All'))) {
                                    (0, logger_1.log)(item);
                                    (0, logger_1.log)('Found cauldron to claim all sold auctions -> clicking index ' + item.slot);
                                    (0, utils_1.clickWindow)(bot, item.slot);
                                    clearTimeout(timeout);
                                    bot.removeAllListeners('windowOpen');
                                    bot.state = null;
                                    resolve(true);
                                    return;
                                }
                            }
                            if (!clickSlot) {
                                (0, logger_1.log)('No sold auctions found');
                                (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §l§cSomething is wrong while trying to claim sold auctions. Maybe not have auctions to claim!');
                                clearTimeout(timeout);
                                bot.removeAllListeners('windowOpen');
                                bot.state = null;
                                bot.closeWindow(window);
                                resolve(false);
                                return;
                            }
                            (0, logger_1.log)('Clicking auction to claim, index: ' + clickSlot);
                            (0, logger_1.log)(JSON.stringify(window.slots[clickSlot]));
                            (0, utils_1.clickWindow)(bot, clickSlot);
                        }
                        if (title == 'BIN Auction View') {
                            (0, logger_1.log)('Clicking slot 31, claiming purchased auction');
                            (0, utils_1.clickWindow)(bot, 31);
                            clearTimeout(timeout);
                            bot.removeAllListeners('windowOpen');
                            bot.state = null;
                            resolve(true);
                        }
                    });
                })];
        });
    });
}
exports.claimSoldItem = claimSoldItem;
function setNothingBoughtFor1HourTimeout(wss) {
    if (errorTimeout) {
        clearTimeout(errorTimeout);
    }
    errorTimeout = setTimeout(function () {
        wss.send(JSON.stringify({
            type: 'clientError',
            data: 'Nothing bought for 1 hour'
        }));
    });
}
//# sourceMappingURL=ingameMessageHandler.js.map