current=`git rev-parse --abbrev-ref HEAD`
version=`node -e "console.log(require('./package.json').version);"`
dist="plugins/v$version"
exists=`git show-ref refs/heads/$dist`

if [ -n "$exists" ]; then
    git branch -D $dist
fi

git checkout --orphan $dist

if [ $? -eq 1 ]; then
    # If checkout failed
    echo "=========="
    echo "Could not checkout branch dist! See the error above and fix it!"
    exit 1
fi

git reset
rm -rf .js
npm run clearMultisrc
npm run generate
npx tsc -m node16
npm run json
git add -f public/icons .dist .js/src/plugins total.svg
git commit -m "Host plugins"
git push -f origin $dist

git checkout -f $current

