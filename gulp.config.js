module.exports = function () {
  var client ='./src/';
  var config = {
    //directories
    tmp: './.tmp/',

    /**
     * File paths
     **/

    alljs: ['*.js'],

    sass: client + 'scss/*.scss',

    css4: client + 'css4/*.css'

  };
  return config;
};
