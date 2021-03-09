"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateBalance = void 0;
var tslib_1 = require("tslib");
var tokenInfo_1 = require("../../constants/tokenInfo");
var bignumber_js_1 = require("bignumber.js");
var tokens_helper_1 = require("../../helpers/tokens.helper");
var CalculateBalance = /** @class */ (function () {
    function CalculateBalance() {
    }
    CalculateBalance.prototype.buildBalance = function (data, wallet) {
        var _this = this;
        return data.reduce(function (accumulatorValue, currentItem, index, array) {
            var _a, _b, _c;
            var balanceLookupResult = _this.balanceLookup(currentItem, (_a = accumulatorValue[index - 1]) === null || _a === void 0 ? void 0 : _a.balance, wallet);
            var lookupResult = _this.tokenContractAddressMigrateHandler(balanceLookupResult);
            var result = tslib_1.__assign(tslib_1.__assign({}, currentItem), { balance: lookupResult.balance, feeInETH: tokens_helper_1.buildBalanceTransformer(lookupResult.feeInETH, +tokenInfo_1.ethDefaultInfo.decimals), blockNumber: lookupResult.blockNumber, previousTransactionBlockNumber: ((_b = accumulatorValue[index - 1]) === null || _b === void 0 ? void 0 : _b.blockNumber)
                    ? accumulatorValue[index - 1].blockNumber
                    : lookupResult.blockNumber, balanceBeforeTransaction: ((_c = accumulatorValue[index - 1]) === null || _c === void 0 ? void 0 : _c.balance)
                    ? accumulatorValue[index - 1].balance
                    : lookupResult.balance, hash: lookupResult.hash, timeStamp: lookupResult.timeStamp });
            accumulatorValue.push(result);
            return accumulatorValue;
        }, []);
        // Clean Zero Balances for decrease uni balance requests - if enable this crash logic when previous balance 7 current 0 (more info in notes)
        // .map((x) => {
        //   x.balance = pickBy(x.balance, this.filterTokenWIthZeroBalance);
        //   x.balanceBeforeTransaction = pickBy(x.balanceBeforeTransaction, this.filterTokenWIthZeroBalance);
        //   return x;
        // });
    };
    CalculateBalance.prototype.tokenContractAddressMigrateHandler = function (data) {
        var e_1, _a;
        var _loop_1 = function (token) {
            if (token.amount.isLessThan(0) && data.balance[token.address]) {
                var oldContractToken = Object.values(data.balance).find(function (x) { return x.symbol === token.symbol && x.address !== token.address; });
                if (oldContractToken) {
                    data.balance[token.address].amount = data.balance[token.address].amount.plus(oldContractToken.amount);
                    delete data.balance[oldContractToken.address];
                }
            }
        };
        try {
            for (var _b = tslib_1.__values(Object.values(data.balance).reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                _loop_1(token);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return data;
    };
    CalculateBalance.prototype.filterTokenWIthZeroBalance = function (token) {
        if (token.amount.isLessThanOrEqualTo(0)) {
            return false;
        }
        else {
            return true;
        }
    };
    CalculateBalance.prototype.balanceLookup = function (data, previousBalance, wallet) {
        var _this = this;
        var localPreviousBalance = tslib_1.__assign({}, previousBalance) || {};
        var result = Object.keys(data).reduce(function (accum, value) {
            if (value === 'normalTransactions' && data[value]) {
                _this.balanceAndFeeFromNormal(data[value], accum, wallet, data);
                return accum;
            }
            if (value === 'internalTransactions' && data[value]) {
                _this.balanceInternal(data[value], accum, wallet, data);
                return accum;
            }
            if (value === 'erc20Transactions' && data[value]) {
                _this.erc20Balance(data[value], accum, wallet, data);
                return accum;
            }
            if (value === 'erc721Transactions' && data[value]) {
                return accum;
            }
            return accum;
        }, { balance: tslib_1.__assign({}, localPreviousBalance), feeInETH: new bignumber_js_1.default(0), blockNumber: 0, hash: '0', timeStamp: '0' });
        // Minus Fee Operation
        // MINUS Transaction FEE from main eth balance
        if (result.feeInETH.isGreaterThan(0)) {
            result.balance[tokenInfo_1.ethDefaultInfo.address].amount = result.balance[tokenInfo_1.ethDefaultInfo.address].amount.minus(result.feeInETH);
        }
        return result;
    };
    CalculateBalance.prototype.erc20Balance = function (data, accum, wallet, transactionGroup) {
        var e_2, _a;
        try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var item = data_1_1.value;
                accum.blockNumber = +item.blockNumber;
                accum.hash = item.hash;
                accum.timeStamp = item.timeStamp;
                var contractAddress = item.contractAddress.toLowerCase();
                if (!accum.balance[contractAddress]) {
                    accum.balance[contractAddress] = {
                        address: contractAddress,
                        decimals: item.tokenDecimal,
                        name: item.tokenName,
                        symbol: item.tokenSymbol,
                        amount: new bignumber_js_1.default(0),
                    };
                }
                // OUT Operation
                if (item.from.toLowerCase() === wallet) {
                    accum.balance[contractAddress] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.minus(new bignumber_js_1.default(item.value)) });
                    accum.feeInETH = new bignumber_js_1.default(item.gasUsed).multipliedBy(new bignumber_js_1.default(item.gasPrice));
                    // Catch transaction from contract
                    // ( if transaction from contract and user as contract owner fee write from contract balance )
                    if (!transactionGroup['normalTransactions']) {
                        accum.feeInETH = new bignumber_js_1.default(0);
                    }
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[contractAddress] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[contractAddress]), { amount: accum.balance[contractAddress].amount.plus(new bignumber_js_1.default(item.value)) });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    CalculateBalance.prototype.balanceInternal = function (data, accum, wallet, transactionGroup) {
        var e_3, _a;
        if (!accum.balance[tokenInfo_1.ethDefaultInfo.address]) {
            accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, tokenInfo_1.ethDefaultInfo), { amount: new bignumber_js_1.default(0) });
        }
        try {
            for (var data_2 = tslib_1.__values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                var item = data_2_1.value;
                accum.blockNumber = +item.blockNumber;
                accum.hash = item.hash;
                accum.timeStamp = item.timeStamp;
                // Catch Error Transactions and recalculate only fee
                if (item.isError === '1') {
                    continue;
                }
                // OUT Operation
                if (item.from.toLowerCase() === wallet) {
                    accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[tokenInfo_1.ethDefaultInfo.address]), { amount: accum.balance[tokenInfo_1.ethDefaultInfo.address].amount.minus(new bignumber_js_1.default(item.value)) });
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[tokenInfo_1.ethDefaultInfo.address]), { amount: accum.balance[tokenInfo_1.ethDefaultInfo.address].amount.plus(new bignumber_js_1.default(item.value)) });
                    // Catch WETH Unwrap
                    if (!transactionGroup.erc20Transactions &&
                        item.from.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
                        accum.balance[item.from.toLowerCase()] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[item.from.toLowerCase()]), { amount: accum.balance[item.from.toLowerCase()].amount.minus(new bignumber_js_1.default(item.value)) });
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    CalculateBalance.prototype.balanceAndFeeFromNormal = function (data, accum, wallet, transactionGroup) {
        var e_4, _a;
        if (!accum.balance[tokenInfo_1.ethDefaultInfo.address]) {
            accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, tokenInfo_1.ethDefaultInfo), { amount: new bignumber_js_1.default(0) });
        }
        try {
            for (var data_3 = tslib_1.__values(data), data_3_1 = data_3.next(); !data_3_1.done; data_3_1 = data_3.next()) {
                var item = data_3_1.value;
                accum.blockNumber = +item.blockNumber;
                accum.hash = item.hash;
                accum.timeStamp = item.timeStamp;
                // Catch Error Transactions and recalculate only fee
                if (item.isError === '1') {
                    accum.feeInETH = new bignumber_js_1.default(item.gasUsed).multipliedBy(new bignumber_js_1.default(item.gasPrice));
                    continue;
                }
                // OUT Operation
                if (item.from.toLowerCase() === wallet) {
                    accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[tokenInfo_1.ethDefaultInfo.address]), { amount: accum.balance[tokenInfo_1.ethDefaultInfo.address].amount.minus(new bignumber_js_1.default(item.value)) });
                    accum.feeInETH = new bignumber_js_1.default(item.gasUsed).multipliedBy(new bignumber_js_1.default(item.gasPrice));
                    // Catch WETH for ETH->WETH transaction ETH WRAP to WETH
                    if (item.to.toLowerCase() === tokenInfo_1.wethDefaultInfo.address) {
                        if (!accum.balance[tokenInfo_1.wethDefaultInfo.address]) {
                            accum.balance[tokenInfo_1.wethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, tokenInfo_1.wethDefaultInfo), { amount: new bignumber_js_1.default(0) });
                        }
                        accum.balance[tokenInfo_1.wethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[tokenInfo_1.wethDefaultInfo.address]), { amount: accum.balance[tokenInfo_1.wethDefaultInfo.address].amount.plus(new bignumber_js_1.default(item.value)) });
                    }
                }
                // In Operation
                if (item.to.toLowerCase() === wallet) {
                    accum.balance[tokenInfo_1.ethDefaultInfo.address] = tslib_1.__assign(tslib_1.__assign({}, accum.balance[tokenInfo_1.ethDefaultInfo.address]), { amount: accum.balance[tokenInfo_1.ethDefaultInfo.address].amount.plus(new bignumber_js_1.default(item.value)) });
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (data_3_1 && !data_3_1.done && (_a = data_3.return)) _a.call(data_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    return CalculateBalance;
}());
exports.CalculateBalance = CalculateBalance;
//# sourceMappingURL=calculateBalance.js.map