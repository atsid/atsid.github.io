[![Dependency Status](https://david-dm.org/atsid/atsid.github.io.svg)](https://david-dm.org/atsid/atsid.github.io)
[![Dev Dependency Status](https://david-dm.org/atsid/atsid.github.io/dev-status.svg)](https://david-dm.org/atsid/atsid.github.io)

atsid.github.io
===============

This `site` branch is the 'source' for the page, which includes all things necessary to build/run/test the site. The `master` branch contains the live distribution/output of this branch on atsid.github.io.

### To install
This assumes you have node/npm installed.

Make sure you have bower/grunt installed globally:
```
npm install bower -g
npm install grunt-cli -g
```

Install the dependencies
```
npm install
bower install
```

### To run
Starts a local server to preview changes. Auto watches/refreshes for changes.
```
grunt serve
```

### To build dist
Compiles and outputs generated sources to the dist folder
```
grunt build
```

### To run dist build
Compiles and then starts a local server to test final build
```
grunt serve:dist
```

### To deploy
Push your changes to the `site` branch, then push the dist folder to the `master` branch.
```
rm -rf dist
mkdir dist
cd dist
git init
git remote add origin git@github.com:atsid/atsid.github.io.git
git pull origin master
cd ..
grunt build
cd dist
git add -A
git commit -m "[your message]"
git push origin master
```

