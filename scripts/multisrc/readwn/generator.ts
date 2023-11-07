import { FilterInputs } from "../../../libs/filterInputs";
import { ScrpitGeneratorFunction } from "../generate";
import list from "./sources.json";
import { ReadwnMetadata } from "./template";
import { readFileSync } from "fs";
import path from "path";

export const generateAll: ScrpitGeneratorFunction = function () {
  return list.map((metadata: ReadwnMetadata) => {
    return generator(metadata);
  });
};

const generator = function generator(metadata: ReadwnMetadata) {
  const rulateTemplate = readFileSync(path.join(__dirname, "template.ts"), {
    encoding: "utf-8",
  });
  metadata.filters = metadata.filters?.map((filter: any) => ({
    ...filter,
    inputType: FilterInputs[filter.inputType],
  }));

  const pluginScript = `
	${rulateTemplate}
const plugin = new ReadwnPlugin(${JSON.stringify(metadata)});
export default plugin;
    `.trim();

  return {
    lang: "english",
    filename: metadata.sourceName,
    pluginScript,
  };
};
