const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchFile(url, init){
    if(!init) init = {};
    try{
        const res = await fetch(url, init);
        if(!res.ok) return undefined;
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer).toString('base64');
    }catch(e){
        return undefined;
    }
}

module.exports = fetchFile;