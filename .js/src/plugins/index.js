"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import all plugins
var spacebattles_1 = __importDefault(require("./english/spacebattles"));
var ao3_1 = __importDefault(require("./english/ao3"));
var bestlightnovel_1 = __importDefault(require("./english/bestlightnovel"));
var chrysanthemumgarden_1 = __importDefault(require("./english/chrysanthemumgarden"));
var divinedaolibrary_1 = __importDefault(require("./english/divinedaolibrary"));
var dreambigtl_1 = __importDefault(require("./english/dreambigtl"));
var earlynovel_1 = __importDefault(require("./english/earlynovel"));
var faqwikius_1 = __importDefault(require("./english/faqwikius"));
var fenrirrealm_1 = __importDefault(require("./english/fenrirrealm"));
var fictionzone_1 = __importDefault(require("./english/fictionzone"));
var foxteller_1 = __importDefault(require("./english/foxteller"));
var genesis_1 = __importDefault(require("./english/genesis"));
var inkitt_1 = __importDefault(require("./english/inkitt"));
var lightnovelpub_1 = __importDefault(require("./english/lightnovelpub"));
var lightnoveltranslation_1 = __importDefault(require("./english/lightnoveltranslation"));
var lnmtl_1 = __importDefault(require("./english/lnmtl"));
var mvlempyr_1 = __importDefault(require("./english/mvlempyr"));
var novelbuddy_1 = __importDefault(require("./english/novelbuddy"));
var novelfire_1 = __importDefault(require("./english/novelfire"));
var novelight_1 = __importDefault(require("./english/novelight"));
var novelhall_1 = __importDefault(require("./english/novelhall"));
var novelupdates_1 = __importDefault(require("./english/novelupdates"));
var pawread_1 = __importDefault(require("./english/pawread"));
var rainofsnow_1 = __importDefault(require("./english/rainofsnow"));
var readfrom_1 = __importDefault(require("./english/readfrom"));
var readlitenovel_1 = __importDefault(require("./english/readlitenovel"));
var reaperscans_1 = __importDefault(require("./english/reaperscans"));
var relibrary_1 = __importDefault(require("./english/relibrary"));
var royalroad_1 = __importDefault(require("./english/royalroad"));
var scribblehub_1 = __importDefault(require("./english/scribblehub"));
var vynovel_1 = __importDefault(require("./english/vynovel"));
var webnovel_1 = __importDefault(require("./english/webnovel"));
var wtrlab_1 = __importDefault(require("./english/wtrlab"));
var wuxiaworld_1 = __importDefault(require("./english/wuxiaworld"));
var StellarRealm_1 = __importDefault(require("./english/StellarRealm"));
var StorySeedling_1 = __importDefault(require("./english/StorySeedling"));
var NovelOnline_1 = __importDefault(require("./english/NovelOnline"));
// Import plugins from other languages
var komga_1 = __importDefault(require("./multi/komga"));
var kakuyomu_1 = __importDefault(require("./japanese/kakuyomu"));
var Syosetu_1 = __importDefault(require("./japanese/Syosetu"));
var linovelib_1 = __importDefault(require("./chinese/linovelib"));
var Quanben_1 = __importDefault(require("./chinese/Quanben"));
// Export all plugins as an array
var PLUGINS = [
    spacebattles_1.default,
    ao3_1.default,
    bestlightnovel_1.default,
    chrysanthemumgarden_1.default,
    divinedaolibrary_1.default,
    dreambigtl_1.default,
    earlynovel_1.default,
    faqwikius_1.default,
    fenrirrealm_1.default,
    fictionzone_1.default,
    foxteller_1.default,
    genesis_1.default,
    inkitt_1.default,
    lightnovelpub_1.default,
    lightnoveltranslation_1.default,
    lnmtl_1.default,
    mvlempyr_1.default,
    novelbuddy_1.default,
    novelfire_1.default,
    novelight_1.default,
    novelhall_1.default,
    novelupdates_1.default,
    pawread_1.default,
    rainofsnow_1.default,
    readfrom_1.default,
    readlitenovel_1.default,
    reaperscans_1.default,
    relibrary_1.default,
    royalroad_1.default,
    scribblehub_1.default,
    vynovel_1.default,
    webnovel_1.default,
    wtrlab_1.default,
    wuxiaworld_1.default,
    StellarRealm_1.default,
    StorySeedling_1.default,
    NovelOnline_1.default,
    komga_1.default,
    kakuyomu_1.default,
    Syosetu_1.default,
    linovelib_1.default,
    Quanben_1.default,
];
exports.default = PLUGINS;
