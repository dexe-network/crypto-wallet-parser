"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toQueryString = void 0;
var qs_1 = require("qs");
function toQueryString(obj, addQueryPrefix) {
    if (addQueryPrefix === void 0) { addQueryPrefix = true; }
    return qs_1.stringify(obj, { addQueryPrefix: addQueryPrefix, strictNullHandling: true });
}
exports.toQueryString = toQueryString;
//# sourceMappingURL=http.helper.js.map