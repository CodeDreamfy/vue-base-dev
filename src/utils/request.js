import Vue from 'vue';
// import store from '@/store';
import axios from 'axios';
import { getToken } from '@/utils/auth';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 12, // request timeout
});

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 400:
      Vue.prototype.$msg({
        type: 'error',
        message: msg,
      });
      break;
    case 401:
      // toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      Vue.prototype.$msg({
        type: 'error',
        message: msg,
      });
      break;
    // 404请求不存在
    case 404:
      // tip('请求的资源不存在');
      // console.log('404', 404);
      break;
    default:
      Vue.prototype.$log.error(msg);
      Vue.prototype.$msg({
        type: 'error',
        message: msg,
      });
  }
};

axios.defaults.retry = 2; // 在第一个失败的请求之后重试该请求的次数
axios.defaults.retryDelay = 1000; // 在失败的请求之间等待的毫秒数（默认为1）

// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    if (res.status === 200) {
      if (res.data && res.data.code === 'NOT_LOGIN') {
        // router.push({
        //   name: 'login',
        // });
      }
      return Promise.resolve(res.data);
    }
    return Promise.reject(res);
  },
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(
        response.status,
        response.data.code ||
          (response.data.extra && response.data.extra.message),
      );
      return Promise.reject(response);
    }
    if (error.message.indexOf('timeout') > -1) {
      // const msg =
      // store.state.currLanguage === 'zh-CN' ? '网络超时' : error.message;
      // Vue.prototype.$msg({
      //   type: 'error',
      //   message: msg,
      // });
    }
    // 处理断网的情况
    // eg:请求超时或断网时，更新state的network状态
    // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    // store.commit('changeNetwork', false);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(undefined, err => {
  const { config } = err;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);
  // Set the variable for keeping track of the retry count
  // eslint-disable-next-line
  config.__retryCount = config.__retryCount || 0;
  // Check if we've maxed out the total number of retries
  // eslint-disable-next-line
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }
  // Increase the retry count
  // eslint-disable-next-line
  config.__retryCount += 1;

  const backoff = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 100);
  });
  // Return the promise in which recalls axios to retry the request
  return backoff.then(() => axios(config));
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const login = /\/login/i.test(config.url);
    const token = getToken();
    if (token && !login) {
      config.headers.Authorization = 'Bearer ' + token; // eslint-disable-line
    }
    return config;
  },
  error => Promise.error(error),
);
export default instance;
