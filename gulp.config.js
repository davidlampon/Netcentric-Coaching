module.exports = () => {
  const sourceFolder = './src/';
  const targetFolder = './target/';

  const stylesFolder = sourceFolder + 'css/';

  const styleFiles = [
    stylesFolder + 'vendor/normalize.css',
    stylesFolder + 'vendor/main.css',
    stylesFolder + 'sass/*.scss',
  ];

  const finalStyleFile = 'style.css';

  const jsFolder = sourceFolder + 'js/';

  const jsFiles = [
    jsFolder + 'vendor/*.js',
    jsFolder + 'modules/*.js',
  ];

  const finalJSFile = 'main.js';

  const config = {
    // file paths
    sourceFolder: sourceFolder,
    targetFolder: targetFolder,
    stylesFolder: stylesFolder,
    jsFolder : jsFolder,

    // style files
    styleFiles: styleFiles,
    finalStyleFile: finalStyleFile,

    // js files
    jsFiles : jsFiles,
    finalJSFile : finalJSFile,
  };

  return config;
};
