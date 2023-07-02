"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const path_1 = __importDefault(require("path"));
const dayjs_1 = __importDefault(require("dayjs"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pluginApi = __importStar(require("./test_web/api/plugins"));
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const app = (0, express_1.default)();
const port = 3000;
const host = "localhost";
const dirname = path_1.default.join(__dirname, "..");
app.use(body_parser_1.default.json());
app.use("/static", express_1.default.static(path_1.default.join(dirname, "test_web", "static")));
app.get("/all_plugins", (req, res) => {
    const allPlugins = pluginApi.all_plugins();
    res.json(allPlugins);
});
app.post("/popularNovels/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.body["filters"] || {};
    const showLatestNovels = req.body["showLatestNovels"] || false;
    const novels = yield pluginApi.popularNovels(req.body["pluginRequirePath"], { showLatestNovels, filters });
    res.json(novels);
}));
app.post("/searchNovels/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const novels = yield pluginApi.searchNovels(req.body["pluginRequirePath"], req.body["searchTerm"]);
    res.json(novels);
}));
app.post("/parseNovelAndChapters/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceNovel = yield pluginApi.parseNovelAndChapters(req.body["pluginRequirePath"], req.body["novelUrl"]);
    res.json(sourceNovel);
}));
app.post("/parseChapter/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chapterText = yield pluginApi.parseChapter(req.body["pluginRequirePath"], req.body["chapterUrl"]);
    res.json(chapterText);
}));
app.post("/fetchImage/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const base64 = yield pluginApi.fetchImage(req.body["pluginRequirePath"], req.body["url"]);
    res.json(base64);
}));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(dirname, "test_web", "index.html"));
});
app.listen(port, host, () => {
    console.log("Testing plugins web listening on http://localhost:3000");
});
//Dayjs localization
const language = ((_b = (_a = Intl === null || Intl === void 0 ? void 0 : Intl.DateTimeFormat()) === null || _a === void 0 ? void 0 : _a.resolvedOptions()) === null || _b === void 0 ? void 0 : _b.locale) || "en";
require("dayjs/locale/ar");
require("dayjs/locale/de");
require("dayjs/locale/es");
require("dayjs/locale/it");
require("dayjs/locale/pt");
require("dayjs/locale/ru");
require("dayjs/locale/tr");
require("dayjs/locale/uk");
require("dayjs/locale/zh");
dayjs_1.default.locale(language);
dayjs_1.default.extend(localizedFormat_1.default);
