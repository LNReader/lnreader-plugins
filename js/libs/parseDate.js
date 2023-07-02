"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMadaraDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const parseMadaraDate = (date) => {
    var _a;
    if (date.includes("ago")) {
        const dayJSDate = (0, dayjs_1.default)(new Date()); // today
        const timeAgo = ((_a = date.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || "";
        const timeAgoInt = parseInt(timeAgo, 10);
        if (!timeAgo)
            return date; // there is no number!
        if (date.includes("hours ago") || date.includes("hour ago")) {
            dayJSDate.subtract(timeAgoInt, "hours"); // go back N hours
        }
        if (date.includes("days ago") || date.includes("day ago")) {
            dayJSDate.subtract(timeAgoInt, "days"); // go back N days
        }
        if (date.includes("months ago") || date.includes("month ago")) {
            dayJSDate.subtract(timeAgoInt, "months"); // go back N months
        }
        return dayJSDate.format("LL");
    }
    return date; // there is no "ago" so don't mess with the date
};
exports.parseMadaraDate = parseMadaraDate;
