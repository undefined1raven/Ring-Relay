const generateSW =  require('workbox-build');

generateSW.generateSW({
  swDest: './build/sw.js',
  globDirectory: './build',
  globPatterns: [
    '**/*.js',
    '**/*.css',
    '**/*.svg'
  ]
});