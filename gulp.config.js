module.exports = () => {
  const client = './src/client/';
  const server = './src/server/';
  const test = './src/test/';
  const temp = './.tmp/';
  const src = './src/';

  const config = {
    // directories
    temp: temp,

    // file paths
    client: client,
    server: server,
    test: test,
    alljs: ['*.js'],
    sass: test + 'scss/*.scss',
    css4: src + 'css4/*.css',

    // node settings
    defaultPort: 7203,
    nodeServer: server + 'app.js',
  };

  return config;
};
