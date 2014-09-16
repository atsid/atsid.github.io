atsid.github.io
===============

Checkout the `site` branch for development work.

### To install
```
npm install
bower install
```

### To run
```
grunt serve
```

### To build dist
```
grunt build
```

### To run dist build
```
grunt serve:dist
```

### To deploy
Push your changes to the `site` branch, then:
```
rm -rf dist
cd dist
git init
git remote add origin git@github.com:atsid/atsid.github.io.git
git pull origin master
cd ..
grunt build
git add .
git commit -m "[your message]"
git push origin master
```

