const sitemap = require('nextjs-sitemap-generator');

sitemap({
  baseUrl: 'https://bestseries.app',
  pagesDirectory: __dirname + '\\out',
  targetDirectory: 'public/',
  ignoredExtensions: ['png', 'jpg', 'css', 'zip', 'ico', 'json', 'svg', 'txt', 'xml'],
  ignoredPaths: ['amp'],
});
