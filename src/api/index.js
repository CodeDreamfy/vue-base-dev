/**
 * api接口的统一出口
 */

const modulesFiles = require.context('./modules', true, /\.js$/);

/* eslint no-param-reassign: "error" */
const modules = modulesFiles.keys().reduce((prevModules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  prevModules[moduleName] = value.default;
  return prevModules;
}, {});

export default modules;
