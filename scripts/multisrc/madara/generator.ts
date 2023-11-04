import { ScrpitGeneratorFunction } from "../generate";
import list from "./sources.json";
import { MadaraMetadata } from "./template";
import { readFileSync } from 'fs';
import path from "path";


export const generateAll: ScrpitGeneratorFunction = function () {
    return list.map((metadata: MadaraMetadata) => {
        return generator(metadata);
    });
};

const generator = function generator(metadata: MadaraMetadata) {
    const lang = metadata.options?.lang || "English";

    const madaraTemplate = readFileSync(path.join(__dirname, 'template.ts'), {encoding: 'utf-8'});
    const pluginScript = `
${madaraTemplate}
const plugin = new MadaraPlugin(${JSON.stringify(metadata)});
export default plugin;
    `
    return {
        lang,
        filename: metadata.sourceName,
        pluginScript,
    };
};
