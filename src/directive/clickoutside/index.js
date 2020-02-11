import elClickOutSide from './el-clickoutside';

const install = function(Vue) {
  Vue.directive('el-clickoutside', elClickOutSide);
};

elClickOutSide.install = install;

if (window.Vue) {
  window['el-clickoutside'] = elClickOutSide;
  Vue.use(install); // eslint-disable-line
}

export default elClickOutSide;
