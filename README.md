[Source Engine QC File Generator](http://rzurad.github.io/qc-generator)
===
An [Ember-CLI](http://www.ember-cli.com) app that creates [QC](https://developer.valvesoftware.com/wiki/Qc) scripts for [Valve's](http://valvesoftware.com) [Source engine](https://developer.valvesoftware.com/wiki/Source).

Supported platforms
===
Tested in Chrome 43 and Firefox 38.

Setup
===
This app uses Ember-CLI and is a static app. Everything happens locally in the browser and there is no need for a back-end. Build it and serve it:

```
npm install -g ember-cli
npm install -g bower
npm install
bower install
ember build
```

Run a local server with

```
ember serve
```

and visit `http://localhost:4200` and `http://localhost:4200/tests`.
