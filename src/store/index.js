/* Fork admin-element-ui */

import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
/* eslint no-param-reassign: "error" */
const modules = modulesFiles.keys().reduce((prevModules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  prevModules[moduleName] = value.default;
  return prevModules;
}, {});

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters,
  modules,
});

export default store;
