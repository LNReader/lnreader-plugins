$current=$(git rev-parse --abbrev-ref HEAD)
$dist='dist'
$exists=$(git show-ref refs/heads/$dist)

echo $current
echo $exists

if  ($exists){
    git checkout $dist
}else{
    ## Make a new one
    git checkout -b $dist
}

if(-Not $?){
    # If checkout failed
    echo "=========="
    echo "Could not checkout branch dist! See the error above and fix it!"
    exit 1
}

git merge $current --strategy-option theirs

npm run generate
npm run json
git add .
git add -f .dist .js/plugins
git commit -m "Update plugins host"
git push -f origin $dist

git checkout $current

