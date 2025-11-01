#!/bin/bash

if [ -z "$GITHUB_STEP_SUMMARY" ]; then
    GITHUB_STEP_SUMMARY="/dev/stdout"
fi

current=`git rev-parse --abbrev-ref HEAD`
version=`node -e "console.log(require('./package.json').version);"`

if [ "$current" -eq "master"]; then
    dist="plugins/v$version"
else
    dist="dist/$current/v$version"
fi

echo "Publishing plugins: $current -> $dist (v$version)"

exists=`git show-ref refs/heads/$dist`

if [ -n "$exists" ]; then
    git branch -D $dist
fi

git checkout --orphan $dist 2>&1

if [ $? -eq 1 ]; then
    echo "❌ ERROR: Failed to create branch $dist"
    exit 1
fi

git reset
rm -rf .js
npm run clean:multisrc
npm run build:multisrc
echo "Compiling TypeScript..."
npx tsc --project tsconfig.production.json
npm run build:manifest

if [ ! -d ".dist" ] || [ -z "$(ls -A .dist)" ]; then
    echo "❌ ERROR: Manifest generation failed - .dist is missing or empty"
    exit 1
fi

# Copy plugins to legacy path (.js/src/plugins) for backward compatibility
echo "Copying .js/plugins -> .js/src/plugins"
mkdir -p .js/src
cp -r .js/plugins .js/src/plugins
git add -f public/static .dist .js/src/plugins total.svg
git commit -m "chore: Publish Plugins"
git push -f origin $dist 2>&1
git checkout -f $current 2>&1
echo "✅ Published to $dist"

