import { ScrpitGeneratorFunction } from "../generate";
import list from "./sources.json";

type sourceData = (typeof list)[number];

export const generateAll: ScrpitGeneratorFunction = function () {
    return list.map((source) => {
        return generator(source);
    });
};

const generator = function generator(sourceJson: sourceData) {
    return {
        lang: "",
        sourceName: "",
        pluginScript: "",
    };
};
