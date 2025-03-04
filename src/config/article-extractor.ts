import { setSanitizeHtmlOptions } from '@extractus/article-extractor';

const allowAllOptions = {
  allowedTags: false,
  allowedAttributes: false,
};

// Set global sanitize-html options
setSanitizeHtmlOptions(allowAllOptions);
