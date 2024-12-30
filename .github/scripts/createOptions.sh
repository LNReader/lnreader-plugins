version=`node -e "console.log(require('./package.json').version);"`
dist="plugins/v$version"

PLUGINS=$(curl -s https://raw.githubusercontent.com/LNReader/lnreader-plugins/{$dist}/.dist/plugins.min.json | jq '[.[] | {(.name): .id}]' | jq 'reduce .[] as $item ({}; . * $item)')

KEYS=$(echo $PLUGINS | jq 'keys_unsorted')

node -e "
    const fs = require('fs');
    const rawText = fs.readFileSync('.github/scripts/blank_report_issue.yml', 'utf8');
    const newKeys = $KEYS;
    let savedKeys = [];
    try {
        let keys = JSON.parse(fs.readFileSync('.github/scripts/keys.json', 'utf8'));
        savedKeys = Object.keys(keys);
    } catch(err) {console.log(err)}
    if(!sameKeys(newKeys, savedKeys) && Array.isArray(newKeys)) {
        const text = newKeys.join('\n        - ');
        fs.writeFileSync('.github/ISSUE_TEMPLATE/report_issue.yml', rawText.replace(/{#CHANGE#}/g,'- '+ text ));
        fs.writeFileSync('.github/scripts/keys.json', JSON.stringify($PLUGINS));
    }
    function sameKeys(a, b) {
        return a.length === b.length && a.every(value => b.includes(value));
    }
    " 
