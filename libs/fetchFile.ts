import { Plugin } from "@typings/plugin";
import { NodeFetchParams, getNodeFetch } from "./nodeFetch";

const fetch = async (...args: NodeFetchParams) =>
    (await getNodeFetch())(...args);

const fetchFile: Plugin.fetchImage = async function (url, init) {
    if (!init) init = {};
    try {
        const res = await fetch(url, init);
        if (!res.ok) return undefined;
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer).toString("base64");
    } catch (e) {
        return undefined;
    }
};
export default  fetchFile;
module.exports = fetchFile;