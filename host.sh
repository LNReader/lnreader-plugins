current=`git rev-parse --abbrev-ref HEAD`
dist=dist
exists=`git show-ref refs/heads//$dist`
if [ -n "$exists" ]; then
    git checkout $dist
else
    git checkout -b $dist
fi

git merge $current --strategy-option theirs

npm run generate
npm run json
git add -f .dist git add .js/plugins
git commit -m "Host plugins"
git push -f origin dist

git checkout $current