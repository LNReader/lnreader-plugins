# Readnovelfull multisrc generator

## Compatiblity

### This generator is brought over from the madara generator one folder away

it should(!) work for all sites that uses this theme

## Add a new source

### sources.json

To add a new source you need to add it to sources.json:

- id: the id of the source (something unique)
- sourceName: the name of the source (you can use the value of "name" in "https://site.com/wp-json/" if it exists)
- sourceSite: the site url
- options: the options of the source
  - lang: the language of the source (default: "English") (check that the language
   exists in the languages (check folder names in "plugins/"))
  - versionIncrements: needs to be updated everytime the site url is updated
  - popularPage: the href value using this CSS selector `a[title="Latest Release"]`
  - ajax-chapter-list: if chapters are obtained from an ajax endpoint
  - pageParam: if a site uses something other than page for accessing pages

### filters

To add filters to a source you need to run the script "get_filters.js" \
(`npx node scripts/multisrc/readnovelfull/get_filters.js`
(if you are at the root of the project) (and you have ran "npm install" before))
and follow the instructions (url is easier and faster but sometimes it doesn't work)
