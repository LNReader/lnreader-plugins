import { filter } from 'node_modules/cheerio/lib/api/traversing';
import { text } from 'stream/consumers';

const cheerio = await import('cheerio');
const fs = await import('fs');

let out_filter: any = {};

let url = 'https://www.royalroad.com/fictions/search';

let r = await fetch(url);
let body = await r.text();
let $ = cheerio.load(body);

let divs = $('div.panel-body > div');

// keyword // 0
out_filter['keyword'] = {
  type: 'FilterTypes.TextInput',
  label: 'Keyword (title or description)',
  value: '',
};

// author // 1
out_filter['author'] = {
  type: 'FilterTypes.TextInput',
  label: 'Author',
  value: '',
};

// genres // 2
let genres = divs
  .eq(2)
  .find('div')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).find('input').attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['genres'] = {
  type: 'FilterTypes.ExcludableCheckboxGroup',
  label: 'Genres',
  value: {
    include: [],
    exclude: [],
  },
  options: genres,
};

// tags // 3
let tags = divs
  .eq(3)
  .find('select[name="tagsAdd"] > option')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['tags'] = {
  type: 'FilterTypes.ExcludableCheckboxGroup',
  label: 'Tags',
  value: {
    include: [],
    exclude: [],
  },
  options: tags,
};

// Content Warnings // 4
let content_warnings = divs
  .eq(4)
  .find('div')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).find('input').attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['content_warnings'] = {
  type: 'FilterTypes.ExcludableCheckboxGroup',
  label: 'Content Warnings',
  value: {
    include: [],
    exclude: [],
  },
  options: content_warnings,
};

// min pages // 5
out_filter['minPages'] = {
  type: 'FilterTypes.TextInput',
  label: 'Min Pages',
  value: '0',
};

// max pages // 5
out_filter['maxPages'] = {
  type: 'FilterTypes.TextInput',
  label: 'Max Pages',
  value: '20000',
};

// min rating // 6
out_filter['minRating'] = {
  type: 'FilterTypes.TextInput',
  label: 'Min Rating (0.0 - 5.0)',
  value: '0.0',
};

// max rating // 6
out_filter['maxRating'] = {
  type: 'FilterTypes.TextInput',
  label: 'Max Rating (0.0 - 5.0)',
  value: '5.0',
};

// status // 7
let status = divs
  .eq(7)
  .find('select[name="status"] > option')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['status'] = {
  type: 'FilterTypes.Picker',
  label: 'Status',
  value: status[0].value,
  options: status,
};

// order // 8
let order = divs
  .eq(8)
  .find('select[name="orderBy"] > option')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['order'] = {
  type: 'FilterTypes.Picker',
  label: 'Order by',
  value: order[0].value,
  options: order,
};

// dir // 8
out_filter['dir'] = {
  type: 'FilterTypes.Picker',
  label: 'Direction',
  value: 'desc',
  options: [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ],
};

// type // 9
let type = divs
  .eq(9)
  .find('select[name="type"] > option')
  .map((i, el) => {
    let label: string = $(el).text().trim();
    let value: string | undefined = $(el).attr('value');
    return {
      label: label,
      value: value,
    };
  })
  .get();
out_filter['type'] = {
  type: 'FilterTypes.Picker',
  label: 'Type',
  value: type[0].value,
  options: type,
};

let json_filter = JSON.stringify(out_filter, null, 2);
console.log(json_filter);

('https://www.royalroad.com/fictions/search?keyword=keyword&author=author&tagsAdd=action&tagsAdd=adventure&tagsAdd=anti-hero_lead&tagsAdd=profanity&tagsRemove=anti-hero_lead&minPages=1&minRating=0.4&status=COMPLETED&orderBy=popularity&dir=asc&type=fanfiction');
