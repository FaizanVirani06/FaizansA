"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookInterval = exports.DisconnectWebwook = exports.SendWebhookTotals = exports.sendWebhookItemListed = exports.sendWebhookItemSold = exports.sendWebhookItemPurchased100M = exports.sendWebhookItemPurchased = exports.sendWebhookInitialized = void 0;
var axios_1 = __importDefault(require("axios"));
var configHelper_1 = require("./configHelper");
function sendWebhookData(options) {
    var data = {
        content: options.content || '',
        avatar_url: options.avatar_url,
        tts: options.tts,
        embeds: options.embeds || [],
        username: options.username || 'BAF'
    };
    axios_1.default.post((0, configHelper_1.getConfigProperty)('WEBHOOK_URL'), data);
}
function isWebhookConfigured() {
    return !!(0, configHelper_1.getConfigProperty)('WEBHOOK_URL');
}
function sendWebhookInitialized(ID) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        content: 'Initialized Connection',
        embeds: [
            {
                title: 'Initialized Connection',
                color: 7714666,
                fields: [
                    { name: 'Connected as:', value: "```".concat(ingameName, "```"), inline: false },
                    {
                        name: 'Started at:',
                        value: "<t:".concat((Date.now() / 1000).toFixed(0), ":t>"),
                        inline: false
                    },
                    { name: 'Your Connection ID:', value: "```".concat(ID, "```"), inline: false },
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
                footer: {
                    "text": "Edit Made by luizfernando13",
                    "icon_url": "https://cdn.discordapp.com/avatars/591035486693359641/a363e32ab636d378d46de06a1e6d6616.png?size=2048"
                }
            }
        ]
    });
}
exports.sendWebhookInitialized = sendWebhookInitialized;
function sendWebhookItemPurchased(itemName, price, profit) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Purchased',
                color: 570644,
                fields: [
                    {
                        name: 'Item:',
                        value: "```".concat(itemName, "```"),
                        inline: true
                    },
                    {
                        name: 'Bought for:',
                        value: "```".concat(price, "```"),
                        inline: true
                    },
                    {
                        name: 'Estimated Profit:',
                        value: "```".concat(profit, "```"),
                        inline: false,
                    },
                    { name: ' ', value: "<t:".concat((Date.now() / 1000).toFixed(0), ":R>"), inline: false }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
            }
        ]
    });
}
exports.sendWebhookItemPurchased = sendWebhookItemPurchased;
function sendWebhookItemPurchased100M(itemName, price, profit) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Legendary Flip!',
                color: 15509525,
                fields: [
                    {
                        name: 'Item:',
                        value: "```".concat(itemName, "```"),
                        inline: true
                    },
                    {
                        name: 'Bought for:',
                        value: "```".concat(price, "```"),
                        inline: true
                    },
                    {
                        name: 'Estimated Profit:',
                        value: "```".concat(profit, "```"),
                        inline: false,
                    },
                    { name: ' ', value: "<t:".concat((Date.now() / 1000).toFixed(0), ":R>"), inline: false }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
                footer: {
                    "text": "Edit Made by luizfernando13",
                    "icon_url": "https://cdn.discordapp.com/avatars/591035486693359641/a363e32ab636d378d46de06a1e6d6616.png?size=2048"
                }
            }
        ]
    });
}
exports.sendWebhookItemPurchased100M = sendWebhookItemPurchased100M;
function sendWebhookItemSold(itemName, price, purchasedBy) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Sold',
                color: 14881033,
                fields: [
                    {
                        name: 'Purchased by:',
                        value: "```".concat(purchasedBy, "```"),
                        inline: true
                    },
                    {
                        name: 'Item Sold:',
                        value: "```".concat(itemName, "```"),
                        inline: true
                    },
                    {
                        name: 'Sold for:',
                        value: "```".concat(price, "```\n\n"),
                        inline: true
                    },
                    { name: ' ', value: "<t:".concat((Date.now() / 1000).toFixed(0), ":R>"), inline: false }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
            }
        ]
    });
}
exports.sendWebhookItemSold = sendWebhookItemSold;
function sendWebhookItemListed(itemName, price, duration) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Listed',
                color: 15335168,
                fields: [
                    {
                        name: 'Listed Item:',
                        value: "```".concat(itemName, "```"),
                        inline: false
                    },
                    {
                        name: 'Item Price:',
                        value: "```".concat(price, "```"),
                        inline: false
                    },
                    {
                        name: 'AH Duration:',
                        value: "```".concat(duration, "h```\n\n"),
                        inline: false
                    },
                    { name: ' ', value: "<t:".concat((Date.now() / 1000).toFixed(0), ":R>"), inline: false }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
            }
        ]
    });
}
exports.sendWebhookItemListed = sendWebhookItemListed;
function SendWebhookTotals(buyTotal, soldTotal) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: '**Last Session Statistics:**',
                description: 'Items purchased and sold by the bot during the last session.',
                color: 2410969,
                fields: [
                    { name: 'Items purchased:', value: "```".concat(buyTotal, "```"), inline: true },
                    { name: 'Items sold:', value: "```".concat(soldTotal, "```"), inline: true },
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
                footer: {
                    "text": "Edit Made by luizfernando13",
                    "icon_url": "https://cdn.discordapp.com/avatars/591035486693359641/a363e32ab636d378d46de06a1e6d6616.png?size=2048"
                }
            },
        ],
    });
}
exports.SendWebhookTotals = SendWebhookTotals;
function DisconnectWebwook(DisconnectReason) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Disconnected from the server',
                color: 14881033,
                fields: [
                    { name: 'You got disconnected in the account:', value: "```".concat(ingameName, "```"), inline: false },
                    {
                        name: 'Disconnected at:',
                        value: "<t:".concat((Date.now() / 1000).toFixed(0), ":t>"),
                        inline: false
                    },
                    { name: 'Reason:', value: "```".concat(DisconnectReason, "```"), inline: false },
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
                footer: {
                    "text": "Edit Made by luizfernando13",
                    "icon_url": "https://cdn.discordapp.com/avatars/591035486693359641/a363e32ab636d378d46de06a1e6d6616.png?size=2048"
                }
            }
        ]
    });
}
exports.DisconnectWebwook = DisconnectWebwook;
function webhookInterval(buyTotal, soldTotal, startedSession, purse) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Current flipping session',
                description: 'Session Stats update every 30 minutes.',
                color: 2410969,
                fields: [
                    { name: 'Items purchased:', value: "```".concat(buyTotal, "```"), inline: false },
                    { name: 'Items sold:', value: "```".concat(soldTotal, "```"), inline: false },
                    { name: 'Purse:', value: "```".concat(purse, "```"), inline: false },
                    { name: 'Session Started at:', value: "<t:".concat(startedSession, ":f> // <t:").concat(startedSession, ":R>"), inline: false },
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") },
                footer: {
                    "text": "Edit Made by luizfernando13",
                    "icon_url": "https://cdn.discordapp.com/avatars/591035486693359641/a363e32ab636d378d46de06a1e6d6616.png?size=2048"
                }
            },
        ],
    });
}
exports.webhookInterval = webhookInterval;
//# sourceMappingURL=webhookHandler.js.map