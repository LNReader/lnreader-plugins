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
Object.defineProperty(exports, "__esModule", { value: true });
const nodeFetch_1 = require("./nodeFetch");
const fetch = (...args) => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, nodeFetch_1.getNodeFetch)())(...args); });
const defaultUserAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
function fetchApi(url, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = Object.assign({ "User-Agent": defaultUserAgentString }, init === null || init === void 0 ? void 0 : init.headers);
        return yield fetch(url, Object.assign(Object.assign({}, init), { headers }));
    });
}
exports.default = fetchApi;
module.exports = fetchApi;
