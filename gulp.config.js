module.exports = function () {
  var client = './src/client/';
  var server = './src/server/';
  var temp = './.tmp/';

  var config = {
    //directories
    temp: temp,

    // file paths
    client: client,
    alljs: ['*.js'],
    sass: client + 'scss/*.scss',
    css4: client + 'css4/*.css',
    server: server,

    // node settings
    defaultPort: 7203,
    nodeServer: server + 'app.js'
  };

  return config;
};
