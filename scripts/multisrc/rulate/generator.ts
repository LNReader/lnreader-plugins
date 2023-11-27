import { FilterInputs } from "../../../libs/filterInputs";
import { ScrpitGeneratorFunction } from "../generate";
import list from "./sources.json";
import { RulateMetadata } from "./template";
import { readFileSync } from "fs";
import path from "path";

export const generateAll: ScrpitGeneratorFunction = function () {
  return list.map((metadata: RulateMetadata) => {
    return generator(metadata);
  });
};

const generator = function generator(metadata: RulateMetadata) {
  const rulateTemplate = readFileSync(path.join(__dirname, "template.ts"), {
    encoding: "utf-8",
  });
  metadata.filters = metadata.filters?.map((filter: any) => ({
    ...filter,
    inputType: FilterInputs[filter.inputType],
  }));

  const pluginScript = `
	${rulateTemplate}
const plugin = new RulatePlugin(${JSON.stringify(metadata)});
export default plugin;
    `.trim();

  return {
    lang: "russian",
    filename: metadata.sourceName,
    pluginScript,
  };
};
