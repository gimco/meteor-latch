Package.describe({
  name: 'gimco:latch',
  summary: 'Protect user accounts with Latch service',
  version: '1.0.0',
  git: 'https://github.com/gimco/meteor-latch'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  // npm package is outdated (uses 0.7 api version)
  // Npm.depends({
  //   'latch-sdk': '0.1.0'
  // });

  api.use('underscore');
  api.use('http', 'server');
  api.use('accounts-base');
  api.use('momentjs:moment@2.8.4', 'server');
  api.use('service-configuration', 'server');

  api.addFiles('latch-common.js', ['client', 'server']);
  api.addFiles('latch-client.js', 'client');
  api.addFiles('latch-server.js', 'server');

  api.export('Latch');
});
