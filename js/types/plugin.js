"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlugin = void 0;
const isPlugin = (p) => {
    const pl = p;
    const errorOut = (key) => {
        console.error("=".repeat(6) +
            `Plugin doesn't have ${key}!` +
            "=".repeat(6) +
            "\n" +
            JSON.stringify(pl) +
            "=".repeat(6));
        return false;
    };
    const required_funcs = [
        "popularNovels",
        "parseNovelAndChapters",
        "parseChapter",
        "searchNovels",
        "fetchImage",
    ];
    for (let i = 0; i < required_funcs.length; i++) {
        const key = required_funcs[i];
        if (!pl[key] || typeof pl[key] !== "function")
            return errorOut(key);
    }
    const requireds_fields = [
        "id",
        "name",
        "version",
        "icon",
        "site",
    ];
    for (let i = 0; i < requireds_fields.length; i++) {
        const key = requireds_fields[i];
        if (pl[key] === undefined)
            return errorOut(key);
    }
    return true;
};
exports.isPlugin = isPlugin;
