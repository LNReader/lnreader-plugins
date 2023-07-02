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
const fetchFile = function (url, init) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!init)
            init = {};
        try {
            const res = yield fetch(url, init);
            if (!res.ok)
                return undefined;
            const arrayBuffer = yield res.arrayBuffer();
            return Buffer.from(arrayBuffer).toString("base64");
        }
        catch (e) {
            return undefined;
        }
    });
};
exports.default = fetchFile;
module.exports = fetchFile;
