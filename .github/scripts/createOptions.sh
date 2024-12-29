current=`git rev-parse --abbrev-ref HEAD`
version=`node -e "console.log(require('./package.json').version);"`
dist="plugins/v$version"

# PLUGIN_JSON=$(curl -s https://raw.githubusercontent.com/LNReader/lnreader-plugins/plugins/v3.0.0/.dist/plugins.min.json | jq '.[] | {(.id): .name}')
PLUGIN_CSV=$(curl -s https://raw.githubusercontent.com/LNReader/lnreader-plugins/{$dist}/.dist/plugins.min.json | jq '[.[] | {(.name + " Id: " + .id): .id}]' | jq 'reduce .[] as $item ({}; . * $item)')

# $(echo "$PLUGIN_CSV"|jq  'keys[]' | jq -R -s -c 'split("\n") | map(select(. != ""))')
KEYS=$(echo $PLUGIN_CSV | jq 'keys_unsorted')
# echo "$KEYS"
node -e "const fs = require('fs');const filePath = '.github/scripts/blank_report_issue.yml';const rawText = fs.readFileSync(filePath, 'utf8');const text = $KEYS.join('\"\n        - \"');fs.writeFileSync('.github/ISSUE_TEMPLATE/report_issue.yml', rawText.replace(/{#CHANGE#}/g,'- \"'+ text +'\"'));" 
# OUTPUT=$(yq -iy '.body[0].type.attributes.options = "$KEYS"' .github/ISSUE_TEMPLATE/report_issue.yml )

# echo "$OUTPUT" 
# git checkout --orphan $dist

# if [ $? -eq 1 ]; then
#     # If checkout failed
#     echo "=========="
#     echo "Could not checkout branch dist! See the error above and fix it!"
#     exit 1
# fi

# git reset
# rm -rf .js
# npm run clearMultisrc
# npm run generate
# npx tsc --project tsconfig.production.json
# npm run json
# git add -f public/static .dist .js/src/plugins total.svg
# git commit -m "chore: Publish Plugins"
# git push -f origin $dist

# git checkout -f $current

