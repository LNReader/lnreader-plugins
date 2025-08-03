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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
//has to be here cus this scoping moment
var parserData = { depth: 0 };
var MVLEMPYRPlugin = /** @class */ (function () {
    function MVLEMPYRPlugin() {
        this.id = 'mvlempyr.com';
        this.name = 'MVLEMPYR';
        this.icon = 'src/en/mvlempyr/icon.png';
        this.site = 'https://www.mvlempyr.com/';
        this.version = '1.0.9';
        this._chapSite = 'https://chap.heliosarchive.online/';
        this.filters = {
            order: {
                type: filterInputs_1.FilterTypes.Picker,
                value: 'reviewCount',
                label: 'Order by',
                options: [
                    { label: 'Latest Added', value: 'created' },
                    { label: 'Best Rated', value: 'avgReview' },
                    { label: 'Most Reviewed', value: 'reviewCount' },
                    { label: 'Chapter Count', value: 'chapterCount' },
                ],
            },
            // update genres and tags with this script if needed
            // console.log([...$0.querySelectorAll("a")].map(a=>{
            //     return [a.querySelector(".g-ttext").innerText, a.href.split("/tag/").pop()]
            // }).map(([a, b])=>`{label: '${a.replace('\'', '\\\'')}', value: '${b}'},`).join("\n"))
            genre: {
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                label: 'Genres',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fan-Fiction', value: 'fan-fiction' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
            },
            tag: {
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                label: 'Tags',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Abandoned Children', value: 'abandoned-children' },
                    { label: 'Ability Steal', value: 'ability-steal' },
                    { label: 'Absent Parents', value: 'absent-parents' },
                    { label: 'Abusive Characters', value: 'abusive-characters' },
                    { label: 'Academy', value: 'academy' },
                    { label: 'Accelerated Growth', value: 'accelerated-growth' },
                    { label: 'Acting', value: 'acting' },
                    { label: 'Adapted from Manga', value: 'adapted-from-manga' },
                    { label: 'Adapted from Manhua', value: 'adapted-from-manhua' },
                    { label: 'Adapted to Anime', value: 'adapted-to-anime' },
                    { label: 'Adapted to Drama', value: 'adapted-to-drama' },
                    { label: 'Adapted to Drama CD', value: 'adapted-to-drama-cd' },
                    { label: 'Adapted to Game', value: 'adapted-to-game' },
                    { label: 'Adapted to Manga', value: 'adapted-to-manga' },
                    { label: 'Adapted to Manhua', value: 'adapted-to-manhua' },
                    { label: 'Adapted to Manhwa', value: 'adapted-to-manhwa' },
                    { label: 'Adapted to Movie', value: 'adapted-to-movie' },
                    { label: 'Adapted to Visual Novel', value: 'adapted-to-visual-novel' },
                    { label: 'Adopted Children', value: 'adopted-children' },
                    { label: 'Adopted Protagonist', value: 'adopted-protagonist' },
                    { label: 'Adultery', value: 'adultery' },
                    { label: 'Advanced technology', value: 'advanced-technology' },
                    { label: 'Adventurers', value: 'adventurers' },
                    { label: 'Affair', value: 'affair' },
                    { label: 'Age Progression', value: 'age-progression' },
                    { label: 'Age Regression', value: 'age-regression' },
                    { label: 'Aggressive Characters', value: 'aggressive-characters' },
                    { label: 'Alchemy', value: 'alchemy' },
                    { label: 'Aliens', value: 'aliens' },
                    { label: 'All-Girls School', value: 'all-girls-school' },
                    { label: 'Alternate World', value: 'alternate-world' },
                    { label: 'American Comics', value: 'american-comics' },
                    { label: 'Amnesia', value: 'amnesia' },
                    { label: 'Amusement Park', value: 'amusement-park' },
                    { label: 'An*l', value: 'an-l' },
                    { label: 'Ancient China', value: 'ancient-china' },
                    { label: 'Ancient Times', value: 'ancient-times' },
                    { label: 'Androgynous Characters', value: 'androgynous-characters' },
                    { label: 'Androids', value: 'androids' },
                    { label: 'Angels', value: 'angels' },
                    { label: 'Animal Characteristics', value: 'animal-characteristics' },
                    { label: 'Animal Rearing', value: 'animal-rearing' },
                    { label: 'Anti-Heo', value: 'anti-heo' },
                    { label: 'Anti-Magic', value: 'anti-magic' },
                    { label: 'Anti-social Protagonist', value: 'anti-social-protagonist' },
                    { label: 'Antihero Protagonist', value: 'antihero-protagonist' },
                    { label: 'Antique Shop', value: 'antique-shop' },
                    { label: 'Apartment Life', value: 'apartment-life' },
                    { label: 'Apathetic Protagonist', value: 'apathetic-protagonist' },
                    { label: 'Apocalypse', value: 'apocalypse' },
                    { label: 'Appearance Changes', value: 'appearance-changes' },
                    {
                        label: 'Appearance Different from Actual Age',
                        value: 'appearance-different-from-actual-age',
                    },
                    { label: 'Archery', value: 'archery' },
                    { label: 'Aristocracy', value: 'aristocracy' },
                    { label: 'Arms Dealers', value: 'arms-dealers' },
                    { label: 'Army', value: 'army' },
                    { label: 'Army Building', value: 'army-building' },
                    { label: 'Arranged Marriage', value: 'arranged-marriage' },
                    { label: 'Arrogant Characters', value: 'arrogant-characters' },
                    { label: 'Artifact Crafting', value: 'artifact-crafting' },
                    { label: 'Artifacts', value: 'artifacts' },
                    { label: 'Artificial Intelligence', value: 'artificial-intelligence' },
                    { label: 'Artists', value: 'artists' },
                    { label: 'Assassins', value: 'assassins' },
                    { label: 'Astrologers', value: 'astrologers' },
                    { label: 'Autism', value: 'autism' },
                    { label: 'Automatons', value: 'automatons' },
                    {
                        label: 'Average-looking Protagonist',
                        value: 'average-looking-protagonist',
                    },
                    { label: 'Award-winning Work', value: 'award-winning-work' },
                    { label: 'Awkward Protagonist', value: 'awkward-protagonist' },
                    { label: 'BDSM', value: 'bdsm' },
                    { label: 'Bands', value: 'bands' },
                    { label: 'Based on a Movie', value: 'based-on-a-movie' },
                    { label: 'Based on a Song', value: 'based-on-a-song' },
                    { label: 'Based on a TV Show', value: 'based-on-a-tv-show' },
                    { label: 'Based on a Video Game', value: 'based-on-a-video-game' },
                    { label: 'Based on a Visual Novel', value: 'based-on-a-visual-novel' },
                    { label: 'Based on an Anime', value: 'based-on-an-anime' },
                    { label: 'Battle Academy', value: 'battle-academy' },
                    { label: 'Battle Competition', value: 'battle-competition' },
                    { label: 'Beast Companions', value: 'beast-companions' },
                    { label: 'Beastkin', value: 'beastkin' },
                    { label: 'Beasts', value: 'beasts' },
                    { label: 'Beautiful Female Lead', value: 'beautiful-female-lead' },
                    { label: 'Bestiality', value: 'bestiality' },
                    { label: 'Betrayal', value: 'betrayal' },
                    { label: 'Bickering Couple', value: 'bickering-couple' },
                    { label: 'Biochip', value: 'biochip' },
                    { label: 'Bisexual Protagonist', value: 'bisexual-protagonist' },
                    { label: 'Black Belly', value: 'black-belly' },
                    { label: 'Blackmail', value: 'blackmail' },
                    { label: 'Blacksmith', value: 'blacksmith' },
                    { label: 'Blind Dates', value: 'blind-dates' },
                    { label: 'Blind Protagonist', value: 'blind-protagonist' },
                    { label: 'Blood Manipulation', value: 'blood-manipulation' },
                    { label: 'Bloodlines', value: 'bloodlines' },
                    { label: 'Body Swap', value: 'body-swap' },
                    { label: 'Body Tempering', value: 'body-tempering' },
                    { label: 'Body-double', value: 'body-double' },
                    { label: 'Bodyguards', value: 'bodyguards' },
                    { label: 'Books', value: 'books' },
                    { label: 'Bookworm', value: 'bookworm' },
                    {
                        label: 'Boss-Subordinate Relationship',
                        value: 'boss-subordinate-relationship',
                    },
                    { label: 'Brainwashing', value: 'brainwashing' },
                    { label: 'Breast Fetish', value: 'breast-fetish' },
                    { label: 'Broken Engagement', value: 'broken-engagement' },
                    { label: 'Brother Complex', value: 'brother-complex' },
                    { label: 'Brotherhood', value: 'brotherhood' },
                    { label: 'Buddhism', value: 'buddhism' },
                    { label: 'Bullying', value: 'bullying' },
                    { label: 'Business Management', value: 'business-management' },
                    { label: 'Businessmen', value: 'businessmen' },
                    { label: 'Butlers', value: 'butlers' },
                    { label: 'C*nnilingus', value: 'c-nnilingus' },
                    { label: 'Calm Protagonist', value: 'calm-protagonist' },
                    { label: 'Cannibalism', value: 'cannibalism' },
                    { label: 'Card Games', value: 'card-games' },
                    { label: 'Carefree Protagonist', value: 'carefree-protagonist' },
                    { label: 'Caring Protagonist', value: 'caring-protagonist' },
                    { label: 'Cautious Protagonist', value: 'cautious-protagonist' },
                    { label: 'Celebrities', value: 'celebrities' },
                    { label: 'Character Growth', value: 'character-growth' },
                    { label: 'Charismatic Protagonist', value: 'charismatic-protagonist' },
                    { label: 'Charming Protagonist', value: 'charming-protagonist' },
                    { label: 'Chat Rooms', value: 'chat-rooms' },
                    { label: 'Cheats', value: 'cheats' },
                    { label: 'Chefs', value: 'chefs' },
                    { label: 'Child Abuse', value: 'child-abuse' },
                    { label: 'Child Protagonist', value: 'child-protagonist' },
                    { label: 'Childcare', value: 'childcare' },
                    { label: 'Childhood Friends', value: 'childhood-friends' },
                    { label: 'Childhood Love', value: 'childhood-love' },
                    { label: 'Childhood Promise', value: 'childhood-promise' },
                    { label: 'Childish Protagonist', value: 'childish-protagonist' },
                    { label: 'Chuunibyou', value: 'chuunibyou' },
                    { label: 'Clan Building', value: 'clan-building' },
                    { label: 'Classic', value: 'classic' },
                    { label: 'Clever Protagonist', value: 'clever-protagonist' },
                    { label: 'Clingy Lover', value: 'clingy-lover' },
                    { label: 'Clones', value: 'clones' },
                    { label: 'Clubs', value: 'clubs' },
                    { label: 'Clumsy Love Interests', value: 'clumsy-love-interests' },
                    { label: 'Co-Workers', value: 'co-workers' },
                    { label: 'Cohabitation', value: 'cohabitation' },
                    { label: 'Cold Love Interests', value: 'cold-love-interests' },
                    { label: 'Cold Protagonist', value: 'cold-protagonist' },
                    {
                        label: 'Collection of Short Stories',
                        value: 'collection-of-short-stories',
                    },
                    { label: 'College/University', value: 'college-university' },
                    { label: 'Coma', value: 'coma' },
                    { label: 'Comedic Undertone', value: 'comedic-undertone' },
                    { label: 'Coming of Age', value: 'coming-of-age' },
                    {
                        label: 'Complex Family Relationships',
                        value: 'complex-family-relationships',
                    },
                    { label: 'Conditional Power', value: 'conditional-power' },
                    { label: 'Confident Protagonist', value: 'confident-protagonist' },
                    { label: 'Confinement', value: 'confinement' },
                    { label: 'Conflicting Loyalties', value: 'conflicting-loyalties' },
                    { label: 'Contracts', value: 'contracts' },
                    { label: 'Cooking', value: 'cooking' },
                    { label: 'Corruption', value: 'corruption' },
                    { label: 'Cosmic Wars', value: 'cosmic-wars' },
                    { label: 'Cosplay', value: 'cosplay' },
                    { label: 'Couple Growth', value: 'couple-growth' },
                    { label: 'Court Official', value: 'court-official' },
                    { label: 'Cousins', value: 'cousins' },
                    { label: 'Cowardly Protagonist', value: 'cowardly-protagonist' },
                    { label: 'Crafting', value: 'crafting' },
                    { label: 'Crime', value: 'crime' },
                    { label: 'Criminals', value: 'criminals' },
                    { label: 'Cross-dressing', value: 'cross-dressing' },
                    { label: 'Crossover', value: 'crossover' },
                    { label: 'Cruel Characters', value: 'cruel-characters' },
                    { label: 'Cryostasis', value: 'cryostasis' },
                    { label: 'Cultivation', value: 'cultivation' },
                    { label: 'Cunning Protagonist', value: 'cunning-protagonist' },
                    { label: 'Curious Protagonist', value: 'curious-protagonist' },
                    { label: 'Curses', value: 'curses' },
                    { label: 'Cute Children', value: 'cute-children' },
                    { label: 'Cute Protagonist', value: 'cute-protagonist' },
                    { label: 'Cute Story', value: 'cute-story' },
                    { label: 'DC', value: 'dc' },
                    { label: 'Dancers', value: 'dancers' },
                    { label: 'Dao Companion', value: 'dao-companion' },
                    { label: 'Dao Comprehension', value: 'dao-comprehension' },
                    { label: 'Daoism', value: 'daoism' },
                    { label: 'Dark', value: 'dark' },
                    { label: 'Dead Protagonist', value: 'dead-protagonist' },
                    { label: 'Death', value: 'death' },
                    { label: 'Death of Loved Ones', value: 'death-of-loved-ones' },
                    { label: 'Debts', value: 'debts' },
                    { label: 'Delinquents', value: 'delinquents' },
                    { label: 'Delusions', value: 'delusions' },
                    { label: 'Demi-Humans', value: 'demi-humans' },
                    { label: 'Demon Lord', value: 'demon-lord' },
                    {
                        label: 'Demonic Cultivation Technique',
                        value: 'demonic-cultivation-technique',
                    },
                    { label: 'Demons', value: 'demons' },
                    { label: 'Dense Protagonist', value: 'dense-protagonist' },
                    { label: 'Depictions of Cruelty', value: 'depictions-of-cruelty' },
                    { label: 'Depression', value: 'depression' },
                    { label: 'Destiny', value: 'destiny' },
                    { label: 'Detectives', value: 'detectives' },
                    { label: 'Determined Protagonist', value: 'determined-protagonist' },
                    { label: 'Devoted Love Interests', value: 'devoted-love-interests' },
                    { label: 'Different Social Status', value: 'different-social-status' },
                    { label: 'Disabilities', value: 'disabilities' },
                    { label: 'Discrimination', value: 'discrimination' },
                    { label: 'Disfigurement', value: 'disfigurement' },
                    { label: 'Dishonest Protagonist', value: 'dishonest-protagonist' },
                    { label: 'Distrustful Protagonist', value: 'distrustful-protagonist' },
                    { label: 'Divination', value: 'divination' },
                    { label: 'Divine Protection', value: 'divine-protection' },
                    { label: 'Divorce', value: 'divorce' },
                    { label: 'Doctors', value: 'doctors' },
                    { label: 'Dolls/Puppets', value: 'dolls-puppets' },
                    { label: 'Domestic Affairs', value: 'domestic-affairs' },
                    { label: 'Doting Love Interests', value: 'doting-love-interests' },
                    { label: 'Doting Older Siblings', value: 'doting-older-siblings' },
                    { label: 'Doting Parents', value: 'doting-parents' },
                    { label: 'Dragon Ball', value: 'dragon-ball' },
                    { label: 'Dragon Riders', value: 'dragon-riders' },
                    { label: 'Dragon Slayers', value: 'dragon-slayers' },
                    { label: 'Dragons', value: 'dragons' },
                    { label: 'Dreams', value: 'dreams' },
                    { label: 'Drugs', value: 'drugs' },
                    { label: 'Druids', value: 'druids' },
                    { label: 'Dungeon Master', value: 'dungeon-master' },
                    { label: 'Dungeons', value: 'dungeons' },
                    { label: 'Dwarfs', value: 'dwarfs' },
                    { label: 'Dystopia', value: 'dystopia' },
                    { label: 'Early Romance', value: 'early-romance' },
                    { label: 'Earth Invasion', value: 'earth-invasion' },
                    { label: 'Easy Going Life', value: 'easy-going-life' },
                    { label: 'Economics', value: 'economics' },
                    { label: 'Editors', value: 'editors' },
                    { label: 'Eidetic Memory', value: 'eidetic-memory' },
                    { label: 'Elderly Protagonist', value: 'elderly-protagonist' },
                    { label: 'Elemental Magic', value: 'elemental-magic' },
                    { label: 'Elves', value: 'elves' },
                    {
                        label: 'Emotionally Weak Protagonist',
                        value: 'emotionally-weak-protagonist',
                    },
                    { label: 'Empires', value: 'empires' },
                    { label: 'Enemies Become Allies', value: 'enemies-become-allies' },
                    { label: 'Enemies Become Lovers', value: 'enemies-become-lovers' },
                    { label: 'Engagement', value: 'engagement' },
                    { label: 'Engineer', value: 'engineer' },
                    { label: 'Enlightenment', value: 'enlightenment' },
                    { label: 'Episodic', value: 'episodic' },
                    { label: 'Eunuch', value: 'eunuch' },
                    { label: 'European Ambience', value: 'european-ambience' },
                    { label: 'Evil Gods', value: 'evil-gods' },
                    { label: 'Evil Organizations', value: 'evil-organizations' },
                    { label: 'Evil Protagonist', value: 'evil-protagonist' },
                    { label: 'Evil Religions', value: 'evil-religions' },
                    { label: 'Evolution', value: 'evolution' },
                    { label: 'Exhibitionism', value: 'exhibitionism' },
                    { label: 'Exorcism', value: 'exorcism' },
                    { label: 'Eye Powers', value: 'eye-powers' },
                    { label: 'F*llatio', value: 'f-llatio' },
                    { label: 'Face slapping', value: 'face-slapping' },
                    { label: 'Fairies', value: 'fairies' },
                    { label: 'Fallen Angels', value: 'fallen-angels' },
                    { label: 'Fallen Nobility', value: 'fallen-nobility' },
                    { label: 'Familial Love', value: 'familial-love' },
                    { label: 'Familiars', value: 'familiars' },
                    { label: 'Family', value: 'family' },
                    { label: 'Family Business', value: 'family-business' },
                    { label: 'Family Conflict', value: 'family-conflict' },
                    { label: 'Famous Parents', value: 'famous-parents' },
                    { label: 'Famous Protagonist', value: 'famous-protagonist' },
                    { label: 'Fanaticism', value: 'fanaticism' },
                    { label: 'Fanfiction', value: 'fanfiction' },
                    { label: 'Fantasy Creatures', value: 'fantasy-creatures' },
                    { label: 'Fantasy World', value: 'fantasy-world' },
                    { label: 'Farming', value: 'farming' },
                    { label: 'Fast Cultivation', value: 'fast-cultivation' },
                    { label: 'Fast Learner', value: 'fast-learner' },
                    { label: 'Fat Protagonist', value: 'fat-protagonist' },
                    { label: 'Fat to Fit', value: 'fat-to-fit' },
                    { label: 'Fated Lovers', value: 'fated-lovers' },
                    { label: 'Fearless Protagonist', value: 'fearless-protagonist' },
                    { label: 'Female Master', value: 'female-master' },
                    { label: 'Female Protagonist', value: 'female-protagonist' },
                    { label: 'Female to Male', value: 'female-to-male' },
                    { label: 'Feng Shui', value: 'feng-shui' },
                    { label: 'Firearms', value: 'firearms' },
                    { label: 'First Love', value: 'first-love' },
                    { label: 'First-time Interc**rse', value: 'first-time-interc-rse' },
                    { label: 'Flashbacks', value: 'flashbacks' },
                    { label: 'Fleet Battles', value: 'fleet-battles' },
                    { label: 'Folklore', value: 'folklore' },
                    {
                        label: 'Forced Living Arrangements',
                        value: 'forced-living-arrangements',
                    },
                    { label: 'Forced Marriage', value: 'forced-marriage' },
                    {
                        label: 'Forced into a Relationship',
                        value: 'forced-into-a-relationship',
                    },
                    { label: 'Forgetful Protagonist', value: 'forgetful-protagonist' },
                    { label: 'Former Hero', value: 'former-hero' },
                    { label: 'Fox Spirits', value: 'fox-spirits' },
                    { label: 'Friends Become Enemies', value: 'friends-become-enemies' },
                    { label: 'Friendship', value: 'friendship' },
                    { label: 'Fujoshi', value: 'fujoshi' },
                    { label: 'Futanari', value: 'futanari' },
                    { label: 'Futuristic Setting', value: 'futuristic-setting' },
                    { label: 'Galge', value: 'galge' },
                    { label: 'Gambling', value: 'gambling' },
                    { label: 'Game Elements', value: 'game-elements' },
                    { label: 'Game Ranking System', value: 'game-ranking-system' },
                    { label: 'Gamers', value: 'gamers' },
                    { label: 'Gangs', value: 'gangs' },
                    { label: 'Gate to Another World', value: 'gate-to-another-world' },
                    { label: 'Genderless Protagonist', value: 'genderless-protagonist' },
                    { label: 'Generals', value: 'generals' },
                    { label: 'Genetic Modifications', value: 'genetic-modifications' },
                    { label: 'Genies', value: 'genies' },
                    { label: 'Genius Protagonist', value: 'genius-protagonist' },
                    { label: 'Ghosts', value: 'ghosts' },
                    { label: 'Gladiators', value: 'gladiators' },
                    {
                        label: 'Glasses-wearing Love Interests',
                        value: 'glasses-wearing-love-interests',
                    },
                    {
                        label: 'Glasses-wearing Protagonist',
                        value: 'glasses-wearing-protagonist',
                    },
                    { label: 'Goblins', value: 'goblins' },
                    { label: 'God Protagonist', value: 'god-protagonist' },
                    { label: 'God-human Relationship', value: 'god-human-relationship' },
                    { label: 'Goddesses', value: 'goddesses' },
                    { label: 'Godly Powers', value: 'godly-powers' },
                    { label: 'Gods', value: 'gods' },
                    { label: 'Golems', value: 'golems' },
                    { label: 'Gore', value: 'gore' },
                    { label: 'Grave Keepers', value: 'grave-keepers' },
                    { label: 'Grinding', value: 'grinding' },
                    { label: 'Guardian Relationship', value: 'guardian-relationship' },
                    { label: 'Guilds', value: 'guilds' },
                    { label: 'Gunfighters', value: 'gunfighters' },
                    { label: 'H*ndjob', value: 'h-ndjob' },
                    { label: 'Hackers', value: 'hackers' },
                    { label: 'Half-human Protagonist', value: 'half-human-protagonist' },
                    { label: 'Handsome Male Lead', value: 'handsome-male-lead' },
                    {
                        label: 'Hard-Working Protagonist',
                        value: 'hard-working-protagonist',
                    },
                    {
                        label: 'Harem-seeking Protagonist',
                        value: 'harem-seeking-protagonist',
                    },
                    { label: 'Harry Potter', value: 'harry-potter' },
                    { label: 'Harsh Training', value: 'harsh-training' },
                    { label: 'Hated Protagonist', value: 'hated-protagonist' },
                    { label: 'Healers', value: 'healers' },
                    { label: 'Heartwarming', value: 'heartwarming' },
                    { label: 'Heaven', value: 'heaven' },
                    { label: 'Heavenly Tribulation', value: 'heavenly-tribulation' },
                    { label: 'Hell', value: 'hell' },
                    { label: 'Helpful Protagonist', value: 'helpful-protagonist' },
                    { label: 'Herbalist', value: 'herbalist' },
                    { label: 'Heroes', value: 'heroes' },
                    { label: 'Heterochromia', value: 'heterochromia' },
                    { label: 'Hidden Abilities', value: 'hidden-abilities' },
                    { label: 'Hiding True Abilities', value: 'hiding-true-abilities' },
                    { label: 'Hiding True Identity', value: 'hiding-true-identity' },
                    { label: 'Hikikomori', value: 'hikikomori' },
                    { label: 'Hollywood', value: 'hollywood' },
                    { label: 'Homunculus', value: 'homunculus' },
                    { label: 'Honest Protagonist', value: 'honest-protagonist' },
                    { label: 'Hospital', value: 'hospital' },
                    { label: 'Hot-blooded Protagonist', value: 'hot-blooded-protagonist' },
                    { label: 'Human Experimentation', value: 'human-experimentation' },
                    { label: 'Human Weapon', value: 'human-weapon' },
                    {
                        label: 'Human-Nonhuman Relationship',
                        value: 'human-nonhuman-relationship',
                    },
                    { label: 'Humanoid Protagonist', value: 'humanoid-protagonist' },
                    { label: 'Hunter x Hunter', value: 'hunter-x-hunter' },
                    { label: 'Hunters', value: 'hunters' },
                    { label: 'Hypnotism', value: 'hypnotism' },
                    { label: 'Identity Crisis', value: 'identity-crisis' },
                    { label: 'Imaginary Friend', value: 'imaginary-friend' },
                    { label: 'Immortals', value: 'immortals' },
                    { label: 'Imperial Harem', value: 'imperial-harem' },
                    { label: 'Incest', value: 'incest' },
                    { label: 'Incubus', value: 'incubus' },
                    { label: 'Indecisive Protagonist', value: 'indecisive-protagonist' },
                    { label: 'Industrialization', value: 'industrialization' },
                    { label: 'Inferiority Complex', value: 'inferiority-complex' },
                    { label: 'Inheritance', value: 'inheritance' },
                    { label: 'Inscriptions', value: 'inscriptions' },
                    { label: 'Insects', value: 'insects' },
                    {
                        label: 'Interconnected Storylines',
                        value: 'interconnected-storylines',
                    },
                    { label: 'Interdimensional Travel', value: 'interdimensional-travel' },
                    { label: 'Introverted Protagonist', value: 'introverted-protagonist' },
                    { label: 'Investigations', value: 'investigations' },
                    { label: 'Invisibility', value: 'invisibility' },
                    { label: 'JSDF', value: 'jsdf' },
                    { label: 'Jack of All Trades', value: 'jack-of-all-trades' },
                    { label: 'Jealousy', value: 'jealousy' },
                    { label: 'Jiangshi', value: 'jiangshi' },
                    { label: 'Jobless Class', value: 'jobless-class' },
                    { label: 'Jujutsu Kaisen', value: 'jujutsu-kaisen' },
                    { label: 'Kidnappings', value: 'kidnappings' },
                    { label: 'Kind Love Interests', value: 'kind-love-interests' },
                    { label: 'Kingdom Building', value: 'kingdom-building' },
                    { label: 'Kingdoms', value: 'kingdoms' },
                    { label: 'Knights', value: 'knights' },
                    { label: 'Kuudere', value: 'kuudere' },
                    { label: 'Lack of Common Sense', value: 'lack-of-common-sense' },
                    { label: 'Language Barrier', value: 'language-barrier' },
                    { label: 'Late Romance', value: 'late-romance' },
                    { label: 'Lawyers', value: 'lawyers' },
                    { label: 'Lazy Protagonist', value: 'lazy-protagonist' },
                    { label: 'Leadership', value: 'leadership' },
                    { label: 'Legends', value: 'legends' },
                    { label: 'Level System', value: 'level-system' },
                    { label: 'Library', value: 'library' },
                    { label: 'Limited Lifespan', value: 'limited-lifespan' },
                    { label: 'Living Abroad', value: 'living-abroad' },
                    { label: 'Living Alone', value: 'living-alone' },
                    { label: 'Loli', value: 'loli' },
                    { label: 'Loneliness', value: 'loneliness' },
                    { label: 'Loner Protagonist', value: 'loner-protagonist' },
                    { label: 'Long Separations', value: 'long-separations' },
                    {
                        label: 'Long-distance Relationship',
                        value: 'long-distance-relationship',
                    },
                    { label: 'Lost Civilizations', value: 'lost-civilizations' },
                    { label: 'Lottery', value: 'lottery' },
                    {
                        label: 'Love Interest Falls in Love First',
                        value: 'love-interest-falls-in-love-first',
                    },
                    { label: 'Love Rivals', value: 'love-rivals' },
                    { label: 'Love Triangles', value: 'love-triangles' },
                    { label: 'Love at First Sight', value: 'love-at-first-sight' },
                    { label: 'Lovers Reunited', value: 'lovers-reunited' },
                    { label: 'Low-key Protagonist', value: 'low-key-protagonist' },
                    { label: 'Loyal Subordinates', value: 'loyal-subordinates' },
                    { label: 'Lucky Protagonist', value: 'lucky-protagonist' },
                    { label: 'M*sturbation', value: 'm-sturbation' },
                    { label: 'MMORPG', value: 'mmorpg' },
                    { label: 'Mafia', value: 'mafia' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Magic Beasts', value: 'magic-beasts' },
                    { label: 'Magic Formations', value: 'magic-formations' },
                    { label: 'Magical Girls', value: 'magical-girls' },
                    { label: 'Magical Space', value: 'magical-space' },
                    { label: 'Magical Technology', value: 'magical-technology' },
                    { label: 'Maids', value: 'maids' },
                    { label: 'Male Protagonist', value: 'male-protagonist' },
                    { label: 'Male Yandere', value: 'male-yandere' },
                    { label: 'Male to Female', value: 'male-to-female' },
                    { label: 'Management', value: 'management' },
                    { label: 'Mangaka', value: 'mangaka' },
                    { label: 'Manipulative Characters', value: 'manipulative-characters' },
                    { label: 'Manly Gay Couple', value: 'manly-gay-couple' },
                    { label: 'Marriage', value: 'marriage' },
                    { label: 'Marriage of Convenience', value: 'marriage-of-convenience' },
                    { label: 'Martial Spirits', value: 'martial-spirits' },
                    { label: 'Marvel', value: 'marvel' },
                    { label: 'Masochistic Characters', value: 'masochistic-characters' },
                    {
                        label: 'Master-Disciple Relationship',
                        value: 'master-disciple-relationship',
                    },
                    {
                        label: 'Master-Servant Relationship',
                        value: 'master-servant-relationship',
                    },
                    { label: 'Matriarchy', value: 'matriarchy' },
                    { label: 'Mature Protagonist', value: 'mature-protagonist' },
                    { label: 'Medical Knowledge', value: 'medical-knowledge' },
                    { label: 'Medieval', value: 'medieval' },
                    { label: 'Mercenaries', value: 'mercenaries' },
                    { label: 'Merchants', value: 'merchants' },
                    { label: 'Military', value: 'military' },
                    { label: 'Mind Break', value: 'mind-break' },
                    { label: 'Mind Control', value: 'mind-control' },
                    { label: 'Misandry', value: 'misandry' },
                    { label: 'Mismatched Couple', value: 'mismatched-couple' },
                    { label: 'Misunderstandings', value: 'misunderstandings' },
                    { label: 'Mob Protagonist', value: 'mob-protagonist' },
                    { label: 'Models', value: 'models' },
                    { label: 'Modern Day', value: 'modern-day' },
                    { label: 'Modern Knowledge', value: 'modern-knowledge' },
                    { label: 'Money Grubber', value: 'money-grubber' },
                    { label: 'Monster Girls', value: 'monster-girls' },
                    { label: 'Monster Society', value: 'monster-society' },
                    { label: 'Monster Tamer', value: 'monster-tamer' },
                    { label: 'Monsters', value: 'monsters' },
                    { label: 'Movies', value: 'movies' },
                    { label: 'Mpreg', value: 'mpreg' },
                    { label: 'Multiple Identities', value: 'multiple-identities' },
                    { label: 'Multiple POV', value: 'multiple-pov' },
                    { label: 'Multiple Personalities', value: 'multiple-personalities' },
                    { label: 'Multiple Protagonists', value: 'multiple-protagonists' },
                    { label: 'Multiple Realms', value: 'multiple-realms' },
                    {
                        label: 'Multiple Reincarnated Individuals',
                        value: 'multiple-reincarnated-individuals',
                    },
                    { label: 'Multiple Timelines', value: 'multiple-timelines' },
                    {
                        label: 'Multiple Transported Individuals',
                        value: 'multiple-transported-individuals',
                    },
                    { label: 'Murders', value: 'murders' },
                    { label: 'Music', value: 'music' },
                    { label: 'Mutated Creatures', value: 'mutated-creatures' },
                    { label: 'Mutations', value: 'mutations' },
                    { label: 'Mute Character', value: 'mute-character' },
                    {
                        label: 'Mysterious Family Background',
                        value: 'mysterious-family-background',
                    },
                    { label: 'Mysterious Illness', value: 'mysterious-illness' },
                    { label: 'Mysterious Past', value: 'mysterious-past' },
                    { label: 'Mystery Solving', value: 'mystery-solving' },
                    { label: 'Mythical Beasts', value: 'mythical-beasts' },
                    { label: 'Mythology', value: 'mythology' },
                    { label: 'Naive Protagonist', value: 'naive-protagonist' },
                    {
                        label: 'Narcissistic Protagonist',
                        value: 'narcissistic-protagonist',
                    },
                    { label: 'Naruto', value: 'naruto' },
                    { label: 'Nationalism', value: 'nationalism' },
                    { label: 'Near-Death Experience', value: 'near-death-experience' },
                    { label: 'Necromancer', value: 'necromancer' },
                    { label: 'Neet', value: 'neet' },
                    { label: 'Netorare', value: 'netorare' },
                    { label: 'Netorase', value: 'netorase' },
                    { label: 'Netori', value: 'netori' },
                    { label: 'Nightmares', value: 'nightmares' },
                    { label: 'Ninjas', value: 'ninjas' },
                    { label: 'Nobles', value: 'nobles' },
                    {
                        label: 'Non-humanoid Protagonist',
                        value: 'non-humanoid-protagonist',
                    },
                    { label: 'Non-linear Storytelling', value: 'non-linear-storytelling' },
                    { label: 'Not-harem', value: 'not-harem' },
                    { label: 'Nudity', value: 'nudity' },
                    { label: 'Nurses', value: 'nurses' },
                    { label: 'Obsessive Love', value: 'obsessive-love' },
                    { label: 'Office Romance', value: 'office-romance' },
                    { label: 'Older Love Interests', value: 'older-love-interests' },
                    { label: 'Omegaverse', value: 'omegaverse' },
                    { label: 'One Piece', value: 'one-piece' },
                    { label: 'Oneshot', value: 'oneshot' },
                    { label: 'Online Romance', value: 'online-romance' },
                    { label: 'Onmyouji', value: 'onmyouji' },
                    { label: 'Or*y', value: 'or-y' },
                    { label: 'Orcs', value: 'orcs' },
                    { label: 'Organized Crime', value: 'organized-crime' },
                    { label: 'Orphans', value: 'orphans' },
                    { label: 'Otaku', value: 'otaku' },
                    { label: 'Otome Game', value: 'otome-game' },
                    { label: 'Outcasts', value: 'outcasts' },
                    { label: 'Outdoor Interc**rse', value: 'outdoor-interc-rse' },
                    { label: 'Outer Space', value: 'outer-space' },
                    { label: 'Overpowered Protagonist', value: 'overpowered-protagonist' },
                    { label: 'Overprotective Siblings', value: 'overprotective-siblings' },
                    { label: 'Pacifist Protagonist', value: 'pacifist-protagonist' },
                    { label: 'Paizuri', value: 'paizuri' },
                    { label: 'Parallel Worlds', value: 'parallel-worlds' },
                    { label: 'Parasites', value: 'parasites' },
                    { label: 'Parent Complex', value: 'parent-complex' },
                    { label: 'Parody', value: 'parody' },
                    { label: 'Part-Time Job', value: 'part-time-job' },
                    { label: 'Past Plays a Big Role', value: 'past-plays-a-big-role' },
                    { label: 'Past Trauma', value: 'past-trauma' },
                    { label: 'Pe*verted Protagonist', value: 'pe-verted-protagonist' },
                    {
                        label: 'Persistent Love Interests',
                        value: 'persistent-love-interests',
                    },
                    { label: 'Personality Changes', value: 'personality-changes' },
                    { label: 'Pets', value: 'pets' },
                    { label: 'Pharmacist', value: 'pharmacist' },
                    { label: 'Philosophical', value: 'philosophical' },
                    { label: 'Phobias', value: 'phobias' },
                    { label: 'Phoenixes', value: 'phoenixes' },
                    { label: 'Photography', value: 'photography' },
                    { label: 'Pill Based Cultivation', value: 'pill-based-cultivation' },
                    { label: 'Pill Concocting', value: 'pill-concocting' },
                    { label: 'Pilots', value: 'pilots' },
                    { label: 'Pirates', value: 'pirates' },
                    { label: 'Playboys', value: 'playboys' },
                    { label: 'Playful Protagonist', value: 'playful-protagonist' },
                    { label: 'Poetry', value: 'poetry' },
                    { label: 'Poisons', value: 'poisons' },
                    { label: 'Police', value: 'police' },
                    { label: 'Polite Protagonist', value: 'polite-protagonist' },
                    { label: 'Politics', value: 'politics' },
                    { label: 'Polyandry', value: 'polyandry' },
                    { label: 'Polygamy', value: 'polygamy' },
                    { label: 'Poor Protagonist', value: 'poor-protagonist' },
                    { label: 'Poor to Rich', value: 'poor-to-rich' },
                    { label: 'Popular Love Interests', value: 'popular-love-interests' },
                    { label: 'Possession', value: 'possession' },
                    { label: 'Possessive Characters', value: 'possessive-characters' },
                    { label: 'Post-apocalyptic', value: 'post-apocalyptic' },
                    { label: 'Power Couple', value: 'power-couple' },
                    { label: 'Power Struggle', value: 'power-struggle' },
                    { label: 'Pragmatic Protagonist', value: 'pragmatic-protagonist' },
                    { label: 'Precognition', value: 'precognition' },
                    { label: 'Pregnancy', value: 'pregnancy' },
                    { label: 'Pretend Lovers', value: 'pretend-lovers' },
                    { label: 'Previous Life Talent', value: 'previous-life-talent' },
                    { label: 'Priestesses', value: 'priestesses' },
                    { label: 'Priests', value: 'priests' },
                    { label: 'Prison', value: 'prison' },
                    { label: 'Proactive Protagonist', value: 'proactive-protagonist' },
                    { label: 'Programmer', value: 'programmer' },
                    { label: 'Prophecies', value: 'prophecies' },
                    { label: 'Prostit**es', value: 'prostit-es' },
                    {
                        label: 'Protagonist Falls in Love First',
                        value: 'protagonist-falls-in-love-first',
                    },
                    {
                        label: 'Protagonist Strong from the Start',
                        value: 'protagonist-strong-from-the-start',
                    },
                    {
                        label: 'Protagonist with Multiple Bodies',
                        value: 'protagonist-with-multiple-bodies',
                    },
                    { label: 'Psychic Powers', value: 'psychic-powers' },
                    { label: 'Psychopaths', value: 'psychopaths' },
                    { label: 'Puppeteers', value: 'puppeteers' },
                    { label: 'Quiet Characters', value: 'quiet-characters' },
                    { label: 'Quirky Characters', value: 'quirky-characters' },
                    { label: 'R*pe', value: 'r-pe' },
                    {
                        label: 'R*pe Victim Becomes Lover',
                        value: 'r-pe-victim-becomes-lover',
                    },
                    { label: 'R-15', value: 'r-15' },
                    { label: 'R-18', value: 'r-18' },
                    { label: 'Race Change', value: 'race-change' },
                    { label: 'Racism', value: 'racism' },
                    { label: 'Rebellion', value: 'rebellion' },
                    {
                        label: 'Reincarnated as a Monster',
                        value: 'reincarnated-as-a-monster',
                    },
                    {
                        label: 'Reincarnated as an Object',
                        value: 'reincarnated-as-an-object',
                    },
                    {
                        label: 'Reincarnated in Another World',
                        value: 'reincarnated-in-another-world',
                    },
                    {
                        label: 'Reincarnated in a Game World',
                        value: 'reincarnated-in-a-game-world',
                    },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Religions', value: 'religions' },
                    { label: 'Reluctant Protagonist', value: 'reluctant-protagonist' },
                    { label: 'Reporters', value: 'reporters' },
                    { label: 'Restaurant', value: 'restaurant' },
                    { label: 'Resurrection', value: 'resurrection' },
                    {
                        label: 'Returning from Another World',
                        value: 'returning-from-another-world',
                    },
                    { label: 'Revenge', value: 'revenge' },
                    { label: 'Reverse Harem', value: 'reverse-harem' },
                    { label: 'Reverse R*pe', value: 'reverse-r-pe' },
                    { label: 'Reversible Couple', value: 'reversible-couple' },
                    { label: 'Rich to Poor', value: 'rich-to-poor' },
                    { label: 'Righteous Protagonist', value: 'righteous-protagonist' },
                    { label: 'Rivalry', value: 'rivalry' },
                    { label: 'Romantic Subplot', value: 'romantic-subplot' },
                    { label: 'Roommates', value: 'roommates' },
                    { label: 'Royalty', value: 'royalty' },
                    { label: 'Ruthless Protagonist', value: 'ruthless-protagonist' },
                    { label: 'S*ave Harem', value: 's-ave-harem' },
                    { label: 'S*ave Protagonist', value: 's-ave-protagonist' },
                    { label: 'S*aves', value: 's-aves' },
                    { label: 'S*x Friends', value: 's-x-friends' },
                    { label: 'S*x S*aves', value: 's-x-s-aves' },
                    { label: 'S*xual Abuse', value: 's-xual-abuse' },
                    {
                        label: 'S*xual Cultivation Technique',
                        value: 's-xual-cultivation-technique',
                    },
                    { label: 'Sadistic Characters', value: 'sadistic-characters' },
                    { label: 'Saints', value: 'saints' },
                    { label: 'Salaryman', value: 'salaryman' },
                    { label: 'Samurai', value: 'samurai' },
                    { label: 'Saving the World', value: 'saving-the-world' },
                    {
                        label: 'Schemes And Conspiracies',
                        value: 'schemes-and-conspiracies',
                    },
                    { label: 'Schizophrenia', value: 'schizophrenia' },
                    { label: 'Scientists', value: 'scientists' },
                    { label: 'Sculptors', value: 'sculptors' },
                    { label: 'Sealed Power', value: 'sealed-power' },
                    { label: 'Second Chance', value: 'second-chance' },
                    { label: 'Secret Crush', value: 'secret-crush' },
                    { label: 'Secret Identity', value: 'secret-identity' },
                    { label: 'Secret Organizations', value: 'secret-organizations' },
                    { label: 'Secret Relationship', value: 'secret-relationship' },
                    { label: 'Secretive Protagonist', value: 'secretive-protagonist' },
                    { label: 'Secrets', value: 'secrets' },
                    { label: 'Sect Development', value: 'sect-development' },
                    { label: 'Seduction', value: 'seduction' },
                    {
                        label: "Seeing Things Other Humans Can't",
                        value: 'seeing-things-other-humans-cant',
                    },
                    { label: 'Selfish Protagonist', value: 'selfish-protagonist' },
                    { label: 'Selfless Protagonist', value: 'selfless-protagonist' },
                    { label: 'Seme Protagonist', value: 'seme-protagonist' },
                    {
                        label: 'Senpai-Kouhai Relationship',
                        value: 'senpai-kouhai-relationship',
                    },
                    { label: 'Sentient Objects', value: 'sentient-objects' },
                    { label: 'Sentimental Protagonist', value: 'sentimental-protagonist' },
                    { label: 'Serial Killers', value: 'serial-killers' },
                    { label: 'Servants', value: 'servants' },
                    { label: 'Seven Deadly Sins', value: 'seven-deadly-sins' },
                    { label: 'Seven Virtues', value: 'seven-virtues' },
                    { label: 'Shameless Protagonist', value: 'shameless-protagonist' },
                    { label: 'Shapeshifters', value: 'shapeshifters' },
                    { label: 'Sharing A Body', value: 'sharing-a-body' },
                    {
                        label: 'Sharp-tongued Characters',
                        value: 'sharp-tongued-characters',
                    },
                    { label: 'Shield User', value: 'shield-user' },
                    { label: 'Shikigami', value: 'shikigami' },
                    { label: 'Short Story', value: 'short-story' },
                    { label: 'Shota', value: 'shota' },
                    { label: 'Shoujo-Ai Subplot', value: 'shoujo-ai-subplot' },
                    { label: 'Shounen-Ai Subplot', value: 'shounen-ai-subplot' },
                    { label: 'Showbiz', value: 'showbiz' },
                    { label: 'Shy Characters', value: 'shy-characters' },
                    { label: 'Sibling Rivalry', value: 'sibling-rivalry' },
                    { label: "Sibling's Care", value: 'siblings-care' },
                    { label: 'Siblings', value: 'siblings' },
                    {
                        label: 'Siblings Not Related by Blood',
                        value: 'siblings-not-related-by-blood',
                    },
                    { label: 'Sickly Characters', value: 'sickly-characters' },
                    { label: 'Sign Language', value: 'sign-language' },
                    { label: 'Singers', value: 'singers' },
                    { label: 'Single Parent', value: 'single-parent' },
                    { label: 'Sister Complex', value: 'sister-complex' },
                    { label: 'Skill Assimilation', value: 'skill-assimilation' },
                    { label: 'Skill Books', value: 'skill-books' },
                    { label: 'Skill Creation', value: 'skill-creation' },
                    { label: 'Sleeping', value: 'sleeping' },
                    { label: 'Slow Growth at Start', value: 'slow-growth-at-start' },
                    { label: 'Slow Romance', value: 'slow-romance' },
                    { label: 'Smart Couple', value: 'smart-couple' },
                    { label: 'Social Outcasts', value: 'social-outcasts' },
                    { label: 'Soldiers', value: 'soldiers' },
                    { label: 'Soul Power', value: 'soul-power' },
                    { label: 'Souls', value: 'souls' },
                    { label: 'Spatial Manipulation', value: 'spatial-manipulation' },
                    { label: 'Spear Wielder', value: 'spear-wielder' },
                    { label: 'Special Abilities', value: 'special-abilities' },
                    { label: 'Spies', value: 'spies' },
                    { label: 'Spirit Advisor', value: 'spirit-advisor' },
                    { label: 'Spirit Users', value: 'spirit-users' },
                    { label: 'Spirits', value: 'spirits' },
                    { label: 'Stalkers', value: 'stalkers' },
                    { label: 'Stockholm Syndrome', value: 'stockholm-syndrome' },
                    { label: 'Stoic Characters', value: 'stoic-characters' },
                    { label: 'Store Owner', value: 'store-owner' },
                    { label: 'Straight Seme', value: 'straight-seme' },
                    { label: 'Straight Uke', value: 'straight-uke' },
                    { label: 'Strategic Battles', value: 'strategic-battles' },
                    { label: 'Strategist', value: 'strategist' },
                    {
                        label: 'Strength-based Social Hierarchy',
                        value: 'strength-based-social-hierarchy',
                    },
                    { label: 'Strong Background', value: 'strong-background' },
                    { label: 'Strong Love Interests', value: 'strong-love-interests' },
                    { label: 'Strong to Stronger', value: 'strong-to-stronger' },
                    { label: 'Stubborn Protagonist', value: 'stubborn-protagonist' },
                    { label: 'Student Council', value: 'student-council' },
                    {
                        label: 'Student-Teacher Relationship',
                        value: 'student-teacher-relationship',
                    },
                    { label: 'Succubus', value: 'succubus' },
                    { label: 'Sudden Strength Gain', value: 'sudden-strength-gain' },
                    { label: 'Sudden Wealth', value: 'sudden-wealth' },
                    { label: 'Suicides', value: 'suicides' },
                    { label: 'Summoned Hero', value: 'summoned-hero' },
                    { label: 'Summoning Magic', value: 'summoning-magic' },
                    { label: 'Survival', value: 'survival' },
                    { label: 'Survival Game', value: 'survival-game' },
                    { label: 'Sword And Magic', value: 'sword-and-magic' },
                    { label: 'Sword Wielder', value: 'sword-wielder' },
                    { label: 'System', value: 'system' },
                    { label: 'System Administrator', value: 'system-administrator' },
                    { label: 'Teachers', value: 'teachers' },
                    { label: 'Teamwork', value: 'teamwork' },
                    { label: 'Technological Gap', value: 'technological-gap' },
                    { label: 'Tentacles', value: 'tentacles' },
                    { label: 'Terminal Illness', value: 'terminal-illness' },
                    { label: 'Territory Management', value: 'territory-management' },
                    { label: 'Terrorists', value: 'terrorists' },
                    { label: 'Thieves', value: 'thieves' },
                    { label: 'Threesome', value: 'threesome' },
                    { label: 'Thriller', value: 'thriller' },
                    { label: 'Time Loop', value: 'time-loop' },
                    { label: 'Time Manipulation', value: 'time-manipulation' },
                    { label: 'Time Paradox', value: 'time-paradox' },
                    { label: 'Time Skip', value: 'time-skip' },
                    { label: 'Time Travel', value: 'time-travel' },
                    { label: 'Timid Protagonist', value: 'timid-protagonist' },
                    { label: 'Tomboyish Female Lead', value: 'tomboyish-female-lead' },
                    { label: 'Torture', value: 'torture' },
                    { label: 'Toys', value: 'toys' },
                    { label: 'Tragic Past', value: 'tragic-past' },
                    { label: 'Transformation Ability', value: 'transformation-ability' },
                    { label: 'Transmigration', value: 'transmigration' },
                    { label: 'Transplanted Memories', value: 'transplanted-memories' },
                    {
                        label: 'Transported Modern Structure',
                        value: 'transported-modern-structure',
                    },
                    {
                        label: 'Transported into a Game World',
                        value: 'transported-into-a-game-world',
                    },
                    {
                        label: 'Transported to Another World',
                        value: 'transported-to-another-world',
                    },
                    { label: 'Trap', value: 'trap' },
                    { label: 'Tribal Society', value: 'tribal-society' },
                    { label: 'Trickster', value: 'trickster' },
                    { label: 'Tsundere', value: 'tsundere' },
                    { label: 'Twins', value: 'twins' },
                    { label: 'Twisted Personality', value: 'twisted-personality' },
                    { label: 'Ugly Protagonist', value: 'ugly-protagonist' },
                    { label: 'Ugly to Beautiful', value: 'ugly-to-beautiful' },
                    { label: 'Unconditional Love', value: 'unconditional-love' },
                    {
                        label: 'Underestimated Protagonist',
                        value: 'underestimated-protagonist',
                    },
                    {
                        label: 'Unique Cultivation Technique',
                        value: 'unique-cultivation-technique',
                    },
                    { label: 'Unique Weapon User', value: 'unique-weapon-user' },
                    { label: 'Unique Weapons', value: 'unique-weapons' },
                    { label: 'Unlimited Flow', value: 'unlimited-flow' },
                    { label: 'Unlucky Protagonist', value: 'unlucky-protagonist' },
                    { label: 'Unreliable Narrator', value: 'unreliable-narrator' },
                    { label: 'Unrequited Love', value: 'unrequited-love' },
                    { label: 'Valkyries', value: 'valkyries' },
                    { label: 'Vampires', value: 'vampires' },
                    { label: 'Villain', value: 'villain' },
                    { label: 'Villainess Noble Girls', value: 'villainess-noble-girls' },
                    { label: 'Virtual Reality', value: 'virtual-reality' },
                    { label: 'Vocaloid', value: 'vocaloid' },
                    { label: 'Voice Actors', value: 'voice-actors' },
                    { label: 'Voyeurism', value: 'voyeurism' },
                    { label: 'Waiters', value: 'waiters' },
                    { label: 'War Records', value: 'war-records' },
                    { label: 'Wars', value: 'wars' },
                    { label: 'Weak Protagonist', value: 'weak-protagonist' },
                    { label: 'Weak to Strong', value: 'weak-to-strong' },
                    { label: 'Wealthy Characters', value: 'wealthy-characters' },
                    { label: 'Werebeasts', value: 'werebeasts' },
                    { label: 'Wishes', value: 'wishes' },
                    { label: 'Witches', value: 'witches' },
                    { label: 'Wizards', value: 'wizards' },
                    { label: 'World Hopping', value: 'world-hopping' },
                    { label: 'World Travel', value: 'world-travel' },
                    { label: 'World Tree', value: 'world-tree' },
                    { label: 'Writers', value: 'writers' },
                    { label: 'Yandere', value: 'yandere' },
                    { label: 'Youkai', value: 'youkai' },
                    { label: 'Younger Brothers', value: 'younger-brothers' },
                    { label: 'Younger Love Interests', value: 'younger-love-interests' },
                    { label: 'Younger Sisters', value: 'younger-sisters' },
                    { label: 'Zombies', value: 'zombies' },
                    { label: 'e-Sports', value: 'e-sports' },
                ],
            },
        };
    }
    MVLEMPYRPlugin.prototype.checkCaptcha = function (loadedCheerio) {
        var title = loadedCheerio('title').text();
        if (title === 'Attention Required! | Cloudflare' ||
            title === 'Just a moment...')
            throw new Error('Captcha error, please open in webview');
    };
    MVLEMPYRPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var data, filtered, sortKey, sorted;
            var _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getAllNovels()];
                    case 1:
                        data = _d.sent();
                        filtered = data.filter(function (novel) {
                            // @ts-ignore
                            for (var _i = 0, _a = filters.genre.value.exclude; _i < _a.length; _i++) {
                                var genre = _a[_i];
                                if (novel.genres.includes(genre)) {
                                    return false;
                                }
                            }
                            // @ts-ignore
                            for (var _b = 0, _c = filters.genre.value.include; _b < _c.length; _b++) {
                                var genre = _c[_b];
                                if (!novel.genres.includes(genre)) {
                                    return false;
                                }
                            }
                            // @ts-ignore
                            for (var _d = 0, _e = filters.tag.value.exclude; _d < _e.length; _d++) {
                                var tag = _e[_d];
                                if (novel.tags.includes(tag)) {
                                    return false;
                                }
                            }
                            // @ts-ignore
                            for (var _f = 0, _g = filters.tag.value.include; _f < _g.length; _f++) {
                                var tag = _g[_f];
                                if (!novel.tags.includes(tag)) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        sortKey = ((_c = filters === null || filters === void 0 ? void 0 : filters.order) === null || _c === void 0 ? void 0 : _c.value) || 'reviewCount';
                        sorted = filtered.sort(function (a, b) { return b[sortKey] - a[sortKey]; });
                        return [2 /*return*/, this.paginate(sorted, pageNo)];
                }
            });
        });
    };
    MVLEMPYRPlugin.prototype.convertNovelId = function (e) {
        var t = 1999999997n;
        var u = 1n, c = 7n % t, d = e;
        for (; d > 0; (1n & d) === 1n && (u = (u * c) % t), c = (c * c) % t, d >>= 1n)
            ;
        return u;
    };
    MVLEMPYRPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, code, newNovelId, firstPostsReq, pages, posts, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        this.checkCaptcha(loadedCheerio);
                        code = loadedCheerio('#novel-code').text();
                        newNovelId = this.convertNovelId(BigInt(parseInt(code)));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this._chapSite +
                                'wp-json/wp/v2/posts?tags=' +
                                newNovelId +
                                '&per_page=500&page=1')];
                    case 3:
                        firstPostsReq = _b.sent();
                        pages = parseInt(firstPostsReq.headers.get('X-Wp-Totalpages')) || 1;
                        return [4 /*yield*/, firstPostsReq.json()];
                    case 4:
                        _a = [[
                                _b.sent()
                            ]];
                        return [4 /*yield*/, Promise.all(new Array(pages - 1)
                                .fill(0)
                                .map(function (_, i) { return i + 2; })
                                .map(function (page) {
                                return (0, fetch_1.fetchApi)(_this._chapSite +
                                    'wp-json/wp/v2/posts?tags=' +
                                    newNovelId +
                                    '&per_page=500&page=' +
                                    page).then(function (res) { return res.json(); });
                            }))];
                    case 5:
                        posts = __spreadArray.apply(void 0, _a.concat([(_b.sent()), true])).flat();
                        return [2 /*return*/, {
                                path: novelPath,
                                name: loadedCheerio('h1.novel-title').text() || 'Untitled',
                                cover: loadedCheerio('img.novel-image').attr('src'),
                                summary: loadedCheerio('div.synopsis.w-richtext').text().trim(),
                                chapters: posts
                                    .map(function (chap) { return ({
                                    name: chap.acf.ch_name,
                                    path: 'chapter/' + chap.acf.novel_code + '-' + chap.acf.chapter_number,
                                    releaseTime: chap.date,
                                    chapterNumber: chap.acf.chapter_number,
                                }); })
                                    .reverse(),
                                status: loadedCheerio('.novelstatustextlarge').text(),
                                author: loadedCheerio('div.additionalinfo.tm10 > div.textwrapper:nth-child(1)')
                                    .toArray()
                                    .filter(function (e) {
                                    return (e.children.length == 2 &&
                                        e.children[0].children[0].data === 'Author:');
                                })[0].children[1].children[0].data,
                                genres: loadedCheerio('.genre-tags')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .toArray()
                                    .join(','),
                            }];
                }
            });
        });
    };
    MVLEMPYRPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        this.checkCaptcha(loadedCheerio);
                        return [2 /*return*/, loadedCheerio('#chapter').html() || ''];
                }
            });
        });
    };
    MVLEMPYRPlugin.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var allNovels, searchResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllNovels()];
                    case 1:
                        allNovels = _a.sent();
                        searchResults = allNovels.filter(function (novel) {
                            return novel.name.toLowerCase().includes(searchTerm.toLowerCase());
                        });
                        return [2 /*return*/, this.paginate(searchResults, page)];
                }
            });
        });
    };
    MVLEMPYRPlugin.prototype.paginate = function (data, page) {
        var startIndex = (page - 1) * 20;
        var endIndex = startIndex + 20;
        return data.slice(startIndex, endIndex);
    };
    MVLEMPYRPlugin.prototype.getAllNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._allNovelsPromise) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._allNovelsPromise];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (this._allNovels) {
                            return [2 /*return*/, this._allNovels];
                        }
                        this._allNovelsPromise = this.loadAll();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, , 5, 6]);
                        _a = this;
                        return [4 /*yield*/, this._allNovelsPromise];
                    case 4:
                        _a._allNovels = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this._allNovelsPromise = undefined;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, this._allNovels];
                }
            });
        });
    };
    MVLEMPYRPlugin.prototype.loadAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this._chapSite + 'wp-json/wp/v2/mvl-novels?per_page=10000').then(function (r) { return r.json(); })];
                    case 1:
                        data = _a.sent();
                        // @ts-ignore
                        return [2 /*return*/, data.map(function (novel) {
                                return {
                                    name: novel.name,
                                    path: 'novel/' + novel.slug,
                                    cover: "https://assets.mvlempyr.app/images/600/".concat(novel['novel-code'], ".webp"),
                                    avgReview: novel['average-review'],
                                    reviewCount: novel['total-reviews'],
                                    chapterCount: novel['total-chapters'],
                                    created: new Date(novel['createdOn']).getTime(),
                                    genres: novel.genre,
                                    tags: novel.tags,
                                };
                            })];
                }
            });
        });
    };
    return MVLEMPYRPlugin;
}());
exports.default = new MVLEMPYRPlugin();
