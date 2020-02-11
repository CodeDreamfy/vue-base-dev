// clamp-js: 内容过长生成省略号，可以指定行数
import clamp from 'clamp-js';
import api from '@/api';
import eventBus from './eventBus';

const myPlugins = {};

myPlugins.install = Vue => {
  Object.assign(Vue.prototype, {
    $api: api, // 接口注入到Vue实例下
    $bus: eventBus, // 自定义事件
    $clamp: clamp, // 省略号
  });
};

export default myPlugins;
