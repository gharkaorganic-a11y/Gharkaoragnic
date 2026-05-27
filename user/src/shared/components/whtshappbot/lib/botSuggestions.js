// lib/botSuggestions.js

import { PAGE_INDEX } from "./botPageIndex";

export const getSuggestedPages = (text) => {
  const query = text.toLowerCase();

  return PAGE_INDEX.filter((page) =>
    page.keywords.some((k) => query.includes(k)),
  );
};