#!/usr/bin/env bash

# Tiny script to parse mongoexport result and overwrite translations
# in config/locales with most up-to-date translations from mongoDB.

mongoexport --db dados-cache --collection translation --jsonArray --out translation.json;
node -e "var fs = require('fs');JSON.parse(fs.readFileSync('translation.json', 'utf8')).map(function (translation) {fs.writeFileSync('../../locales/' + translation.language + '.json', JSON.stringify(translation.translation, null, 2));});" translation.json;
rm translation.json;
