import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as readline from 'readline';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilters(name, html, baseUrl) {
  const $ = cheerio.load(html);
  const filters = {
    filters: {
      'type': {
        type: 'Picker',
        label: 'Novel Listing',
        value: '',
        options: [],
      },
      'genres': {
        type: 'Picker',
        label: 'Genre',
        value: '',
        options: [],
      },
    },
  };

  const baseSelector = 'div.navbar-collapse li.dropdown';

  // --- Type Filters ---
  let defaultValue = null;
  const typeOptions = [];
  $(`${baseSelector}:eq(0) li a`).each((_, el) => {
    const $el = $(el);
    const title = $el.attr('title');
    const label = $el.text().trim();
    const href = $el.attr('href');

    if (!href || !label || title === 'Latest Release') return;

    try {
      const fullUrl = new URL(decodeURI(href), baseUrl);
      const params = fullUrl.searchParams;

      const value = params.has('type')
        ? params.get('type')
        : (fullUrl.pathname.startsWith('/')
            ? fullUrl.pathname.substring(1)
            : fullUrl.pathname) || '';

      if (value) {
        typeOptions.push({ label, value });
        if (title === 'Most Popular') {
          defaultValue = value;
        }
      } else {
        console.warn(
          `Skipping type option "${label}" for ${name}: Could not determine value from href "${href}"`,
        );
      }
    } catch (error) {
      console.error(
        `Error processing type URL (${href}) for ${name}: ${error.message}`,
      );
    }
  });
  filters.filters.type.options = typeOptions;
  filters.filters.type.value = defaultValue ?? (typeOptions[0]?.value || ''); // Set default: Popular > First > Empty

  // --- Genres Filters ---
  const genreOptions = [];
  $(`${baseSelector}:eq(1) li a`).each((_, el) => {
    const $el = $(el);
    const label = $el.text().trim();
    const href = $el.attr('href');

    if (!href || !label) return;

    try {
      const fullUrl = new URL(decodeURI(href), baseUrl);
      const params = fullUrl.searchParams;

      const value =
        params.get('type') === 'category_novel' && params.has('id')
          ? params.get('id')
          : (fullUrl.pathname.startsWith('/')
              ? fullUrl.pathname.substring(1)
              : fullUrl.pathname) || '';

      if (value) {
        genreOptions.push({ label, value });
      } else {
        console.warn(
          `Skipping genre option "${label}" for ${name}: Could not determine value from href "${href}"`,
        );
      }
    } catch (error) {
      console.error(
        `Error processing genre URL (${href}) for ${name}: ${error.message}`,
      );
    }
  });
  filters.filters.genre.options = genreOptions; // Genre has no default

  // --- Validation and Saving ---
  if (
    filters.filters.type.options.length === 0 ||
    filters.filters.genre.options.length === 0
  ) {
    console.warn(
      `🚨Warning for ${name}: Type or Genre options might be incomplete or empty. (${path.join(__dirname, 'filters', name + '.json')})🚨`,
    );
  }
  try {
    const filtersDir = path.join(__dirname, 'filters');
    if (!fs.existsSync(filtersDir))
      fs.mkdirSync(filtersDir, { recursive: true });
    fs.writeFileSync(
      path.join(filtersDir, name + '.json'),
      JSON.stringify(filters, null, 2),
    );
    console.log(`✅Filters created successfully for ${name}✅`);
  } catch (error) {
    console.error(
      `🚨Error writing filters file for ${name}: ${error.message}🚨`,
    );
  }
}

async function getFiltersFromURL(name, url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, while fetching ${response.url}`,
    );
  }
  const html = await response.text();
  try {
    getFilters(name, html, url);
  } catch (e) {
    console.error('Error while getting filters from', url, e);
  }
}

async function askGetFilter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const EREASE_PREV_LINE = '\x1b[1A\r\x1b[2K';
  rl.question(
    'Enter the id of the site (same one as in sources.json): ',
    async name => {
      rl.question(
        EREASE_PREV_LINE +
          "Do you want to get the filters from a URL or the html text? (if url dosen't work try html) (url/html): ",
        async method => {
          if (method.toLowerCase() === 'url') {
            const sources = JSON.parse(
              fs.readFileSync(path.join(__dirname, 'sources.json'), 'utf-8'),
            );
            const source = sources.find(s => s.id === name);
            if (source && source.sourceSite) {
              console.log('Getting filters from', source.sourceSite);
              try {
                await getFiltersFromURL(name, source.sourceSite);
              } catch (e) {
                console.error(
                  'Error while getting filters from',
                  source.sourceSite,
                );
                console.log(e.message || e);
              }
              rl.close();
            } else {
              rl.question(
                EREASE_PREV_LINE +
                  'Enter the URL (same one as in sources.json): ',
                async url => {
                  rl.close();
                  try {
                    await getFiltersFromURL(name, url);
                  } catch (e) {
                    console.error('Error while getting filters from', url);
                    console.log(e.message || e);
                  }
                },
              );
            }
          } else {
            process.stdout.write(
              EREASE_PREV_LINE +
                `Enter the html text from the page at {sourceSite}/?s=&post_type=wp-manga (at the end press ENTER then press CTRL+C): `,
            );
            let html = '';
            rl.on('SIGINT', () => {
              console.log('Stopeed reading input, creating filters file');
              getFilters(name, html, url);
              rl.close();
            });
            rl.on('line', line => {
              html += line + '\n';
            });
          }
        },
      );
    },
  );
}

askGetFilter();

export { getFiltersFromURL };
