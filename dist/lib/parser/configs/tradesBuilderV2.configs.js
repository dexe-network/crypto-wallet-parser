"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBehaviourConfig = void 0;
var interfaces_1 = require("../../interfaces");
var generateIsTrustedProviderPattern = function (config) {
    if (config.parserMode === interfaces_1.PARSER_MODE.W2W) {
        return {
            first: true,
            second: false,
            third: true,
        };
    }
    else {
        return {
            first: true,
            second: false,
            third: false,
        };
    }
};
var generateBehaviourConfig = function (config) {
    return {
        isTrustedProviderPattern: generateIsTrustedProviderPattern(config),
    };
};
exports.generateBehaviourConfig = generateBehaviourConfig;
//# sourceMappingURL=tradesBuilderV2.configs.js.map