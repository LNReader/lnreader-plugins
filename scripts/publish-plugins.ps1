$current=$(git rev-parse --abbrev-ref HEAD)
$version=$(node -e "console.log(require('./package.json').version);")
$dist="plugins/v$($version)"

echo "Publishing plugins: $current -> $dist (v$version)"

$exists=$(git show-ref refs/heads/$dist)

if  ($exists){
    git branch -D $dist
}

git checkout --orphan $dist

if(-Not $?){
    echo "❌ ERROR: Failed to create branch $dist"
    exit 1
}

git reset
rm -r -fo .js
npm run clean:multisrc
npm run build:multisrc
echo "Compiling TypeScript..."
npx tsc --project tsconfig.production.json
npm run build:manifest

if (-not (Test-Path .dist) -or -not (Get-ChildItem -Path .dist -Force)) {
    echo "❌ ERROR: Manifest generation failed - .dist is missing or empty"
    exit 1
}

# Copy plugins to legacy path (.js/src/plugins) for backward compatibility
echo "Copying .js/plugins -> .js/src/plugins"
New-Item -ItemType Directory -Force -Path .js/src | Out-Null
Copy-Item -Path .js/plugins -Destination .js/src/plugins -Recurse -Force
git add -f public/static .dist .js/src/plugins total.svg
git commit -m "chore: Publish Plugins"
git push -f origin $dist
git checkout -f $current
echo "✅ Published to $dist"

