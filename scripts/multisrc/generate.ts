import path from "path";
import fs from "fs";

type GeneratedScript = {
    lang: string;
    sourceName: string;
    pluginScript: string;
};

export type ScrpitGeneratorFunction = () => GeneratedScript[];

const isScriptGenerator = (s: unknown): s is ScrpitGeneratorFunction => {
    return !!s && typeof s === "function";
};

const generate = async (name: string): Promise<boolean> => {
    const generateAll: ScrpitGeneratorFunction | unknown =
        require(`./${name}/generator`).generateAll;
    if (!isScriptGenerator(generateAll)) return false;

    const sources = generateAll();

    for (let source of sources) {
        const { lang, sourceName, pluginScript } = source;
        const filename = sourceName.replace(/[\s-\.]+/g, "") + `[${name}].ts`;
        const pluginsDir = path.join(
            path.dirname(path.dirname(__dirname)),
            "plugins"
        );
        const filePath = path.join(pluginsDir, lang.toLowerCase(), filename);
        fs.writeFileSync(filePath, pluginScript, { encoding: "utf-8" });
    }
    return true;
};

const run = async () => {
    const sources = fs
        .readdirSync(__dirname)
        .filter((name) =>
            fs.lstatSync(path.join(__dirname, name)).isDirectory()
        );

    for (let name of sources) {
        const success = await generate(name);
        if (success) console.log(name + " OK");
    }
};

run();
