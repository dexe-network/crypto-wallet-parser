"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTransaction = void 0;
var tslib_1 = require("tslib");
var TransformTransaction = /** @class */ (function () {
    function TransformTransaction() {
    }
    TransformTransaction.prototype.transformTokenTradeObjectToArr = function (data) {
        // Up all trades to single array
        return Object.values(data)
            .reduce(function (accum, item) {
            accum.push.apply(accum, tslib_1.__spreadArray([], tslib_1.__read(item.trades)));
            return accum;
        }, new Array())
            .sort(function (a, b) {
            if (a.openTimeStamp < b.openTimeStamp) {
                return -1;
            }
            if (a.openTimeStamp > b.openTimeStamp) {
                return 1;
            }
            return 0;
        });
    };
    return TransformTransaction;
}());
exports.TransformTransaction = TransformTransaction;
//# sourceMappingURL=transformTransaction.js.map