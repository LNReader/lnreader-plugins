import { Plugin } from '@/types/plugin';

// Backward compatibility imports for 3.0.0 - TODO: Remove in 4.0.0
import { Parser } from 'htmlparser2';
import { load } from 'cheerio';
import dayjs from 'dayjs';
import { encode, decode } from 'urlencode';
import { NovelStatus } from '@libs/novelStatus';
import { defaultCover } from '@libs/defaultCover';
import { fetchApi, fetchText, fetchProto } from '@libs/fetch';
import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
import { FilterTypes } from '@libs/filterInputs';
import { storage } from '@libs/storage';

import p_0 from '@plugins/arabic/dilartube';
import p_1 from '@plugins/arabic/rewayatclub';
import p_2 from '@plugins/arabic/sunovels';
import p_3 from '@plugins/chinese/69shu';
import p_4 from '@plugins/chinese/69xinshu';
import p_5 from '@plugins/chinese/Quanben';
import p_6 from '@plugins/chinese/ixdzs8';
import p_7 from '@plugins/chinese/linovel';
import p_8 from '@plugins/chinese/linovelib';
import p_9 from '@plugins/chinese/linovelib_tw';
import p_10 from '@plugins/chinese/novel543';
import p_11 from '@plugins/english/NovelOnline';
import p_12 from '@plugins/english/StorySeedling';
import p_13 from '@plugins/english/ao3';
import p_14 from '@plugins/english/bestlightnovel';
import p_15 from '@plugins/english/chrysanthemumgarden';
import p_16 from '@plugins/english/divinedaolibrary';
import p_17 from '@plugins/english/dreambigtl';
import p_18 from '@plugins/english/earlynovel';
import p_19 from '@plugins/english/faqwikius';
import p_20 from '@plugins/english/fenrirrealm';
import p_21 from '@plugins/english/fictionzone';
import p_22 from '@plugins/english/foxteller';
import p_23 from '@plugins/english/genesis';
import p_24 from '@plugins/english/inkitt';
import p_25 from '@plugins/english/kdtnovels';
import p_26 from '@plugins/english/lightnovelpub';
import p_27 from '@plugins/english/lightnoveltranslation';
import p_28 from '@plugins/english/lnmtl';
import p_29 from '@plugins/english/mtlreader';
import p_30 from '@plugins/english/mvlempyr';
import p_31 from '@plugins/english/novelbuddy';
import p_32 from '@plugins/english/novelfire';
import p_33 from '@plugins/english/novelhall';
import p_34 from '@plugins/english/novelight';
import p_35 from '@plugins/english/novelupdates';
import p_36 from '@plugins/english/pawread';
import p_37 from '@plugins/english/rainofsnow';
import p_38 from '@plugins/english/readfrom';
import p_39 from '@plugins/english/readlitenovel';
import p_40 from '@plugins/english/reaperscans';
import p_41 from '@plugins/english/relibrary';
import p_42 from '@plugins/english/royalroad';
import p_43 from '@plugins/english/scribblehub';
import p_44 from '@plugins/english/vynovel';
import p_45 from '@plugins/english/webnovel';
import p_46 from '@plugins/english/wtrlab';
import p_47 from '@plugins/english/wuxiaworld';
import p_48 from '@plugins/french/chireads';
import p_49 from '@plugins/french/harkeneliwood';
import p_50 from '@plugins/french/kisswood';
import p_51 from '@plugins/french/noveldeglace';
import p_52 from '@plugins/french/novhell';
import p_53 from '@plugins/french/phenixscans';
import p_54 from '@plugins/french/warriorlegendtrad';
import p_55 from '@plugins/french/wuxialnscantrad';
import p_56 from '@plugins/french/xiaowaz';
import p_57 from '@plugins/indonesian/indowebnovel';
import p_58 from '@plugins/indonesian/novelringan';
import p_59 from '@plugins/indonesian/sakuranovel';
import p_60 from '@plugins/japanese/Syosetu';
import p_61 from '@plugins/japanese/kakuyomu';
import p_62 from '@plugins/korean/Agitoon';
import p_63 from '@plugins/multi/komga';
import p_64 from '@plugins/polish/novelki';
import p_65 from '@plugins/portuguese/blogdoamonnovels';
import p_66 from '@plugins/portuguese/novelmania';
import p_67 from '@plugins/portuguese/tsundoku';
import p_68 from '@plugins/russian/LitSpace';
import p_69 from '@plugins/russian/authortoday';
import p_70 from '@plugins/russian/bookriver';
import p_71 from '@plugins/russian/ficbook';
import p_72 from '@plugins/russian/jaomix';
import p_73 from '@plugins/russian/neobook';
import p_74 from '@plugins/russian/novelOvh';
import p_75 from '@plugins/russian/novelTL';
import p_76 from '@plugins/russian/ranobehub';
import p_77 from '@plugins/russian/ranobelib';
import p_78 from '@plugins/russian/ranoberf';
import p_79 from '@plugins/russian/renovels';
import p_80 from '@plugins/russian/ruvers';
import p_81 from '@plugins/russian/topliba';
import p_82 from '@plugins/russian/zelluloza';
import p_83 from '@plugins/spanish/hasutl';
import p_84 from '@plugins/spanish/novelasligera';
import p_85 from '@plugins/spanish/novelawuxia';
import p_86 from '@plugins/spanish/oasistranslations';
import p_87 from '@plugins/spanish/skynovels';
import p_88 from '@plugins/spanish/tunovelaligera';
import p_89 from '@plugins/spanish/yukitls';
import p_90 from '@plugins/turkish/MangaTR';
import p_91 from '@plugins/turkish/epiknovel';
import p_92 from '@plugins/ukrainian/bakainua';
import p_93 from '@plugins/ukrainian/smakolykytl';
import p_94 from '@plugins/ukrainian/uaranobeclub';
import p_95 from '@plugins/vietnamese/LNHako';
import p_96 from '@plugins/vietnamese/Truyenconect';
import p_97 from '@plugins/vietnamese/lightnovelvn';
import p_98 from '@plugins/vietnamese/nettruyen';
import p_99 from '@plugins/vietnamese/truyenchu';
import p_100 from '@plugins/vietnamese/truyenfull';

const PLUGINS: Plugin.PluginBase[] = [
  p_0,
  p_1,
  p_2,
  p_3,
  p_4,
  p_5,
  p_6,
  p_7,
  p_8,
  p_9,
  p_10,
  p_11,
  p_12,
  p_13,
  p_14,
  p_15,
  p_16,
  p_17,
  p_18,
  p_19,
  p_20,
  p_21,
  p_22,
  p_23,
  p_24,
  p_25,
  p_26,
  p_27,
  p_28,
  p_29,
  p_30,
  p_31,
  p_32,
  p_33,
  p_34,
  p_35,
  p_36,
  p_37,
  p_38,
  p_39,
  p_40,
  p_41,
  p_42,
  p_43,
  p_44,
  p_45,
  p_46,
  p_47,
  p_48,
  p_49,
  p_50,
  p_51,
  p_52,
  p_53,
  p_54,
  p_55,
  p_56,
  p_57,
  p_58,
  p_59,
  p_60,
  p_61,
  p_62,
  p_63,
  p_64,
  p_65,
  p_66,
  p_67,
  p_68,
  p_69,
  p_70,
  p_71,
  p_72,
  p_73,
  p_74,
  p_75,
  p_76,
  p_77,
  p_78,
  p_79,
  p_80,
  p_81,
  p_82,
  p_83,
  p_84,
  p_85,
  p_86,
  p_87,
  p_88,
  p_89,
  p_90,
  p_91,
  p_92,
  p_93,
  p_94,
  p_95,
  p_96,
  p_97,
  p_98,
  p_99,
  p_100,
];
export default PLUGINS;

/**
 * Backward compatibility for 3.0.0 - Package exports with old aliased paths
 * TODO: Remove in 4.0.0
 *
 * Note: @libs/storage is handled specially by the App and provides
 * plugin-specific storage instances at runtime
 */
export const packages: Record<string, any> = {
  'htmlparser2': { Parser },
  'cheerio': { load },
  'dayjs': dayjs,
  'urlencode': { encode, decode },
  '@libs/novelStatus': { NovelStatus },
  '@libs/fetch': { fetchApi, fetchText, fetchProto },
  '@libs/isAbsoluteUrl': { isUrlAbsolute },
  '@libs/filterInputs': { FilterTypes },
  '@libs/defaultCover': { defaultCover },
  '@libs/storage': { storage },
};
