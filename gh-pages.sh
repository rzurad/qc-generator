#!/bin/bash

git update-index -q --ignore-submodules --refresh
git diff-index --quiet --ignore-submodules HEAD -- || {
    git status -uno
    echo "The git tree is dirty. Exiting..."
    exit 1;
}

if [ -z "$1" ]; then
    echo "No commit message given. Exiting..."
    exit 1
fi

git show-ref --verify --quiet refs/heads/gh-pages

if [ $? == 0 ]; then
    git branch -D gh-pages
fi

set -e
ember build --env=production
git checkout --orphan gh-pages
git reset --hard
mv dist/* .
git add assets crossdomain.xml images index.html robots.txt
git commit -m "$1"
git push -f origin gh-pages:gh-pages
git checkout master
