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

  const config = {
    // file paths
    sourceFolder: sourceFolder,
    targetFolder: targetFolder,
    stylesFolder: stylesFolder,

    // files
    styleFiles: styleFiles,
    finalStyleFile: finalStyleFile,
  };

  return config;
};
