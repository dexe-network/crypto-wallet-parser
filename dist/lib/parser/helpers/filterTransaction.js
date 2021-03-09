"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTransaction = void 0;
var FilterTransaction = /** @class */ (function () {
    function FilterTransaction() {
    }
    FilterTransaction.prototype.filterAfterRegistration = function (data, blockNumber) {
        return data.filter(function (item) { return item.blockNumber > blockNumber; });
    };
    return FilterTransaction;
}());
exports.FilterTransaction = FilterTransaction;
//# sourceMappingURL=filterTransaction.js.map