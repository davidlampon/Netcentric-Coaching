module.exports = function () {
  var client ='./src';
  var config = {
    //directories
    tmp: './.tmp',

    /**
     * File paths
     **/

    alljs: ['*.js'],

    postcss: client + '/css/*.css'

  };
  return config;
};
