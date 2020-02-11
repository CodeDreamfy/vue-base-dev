/* eslint-disable */
import Vue from 'vue';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;
const isServer = Vue.prototype.$isServer;

/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();
!isServer && on(document, 'mousedown', e => (startClick = e));

!isServer &&
  on(document, 'mouseup', e => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
  });

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    )
      return;
    // 当element-ui组件在弹层外全局使用的时候，需要通过特定的方式判断是否要隐藏弹层
    if (vnode.context.popperElmName) {
      const className = vnode.context.popperElmName;
      const mouseupParentElm = $(mouseup.target).closest(`.${className}`);
      const mousedownParentElm = $(mousedown.target).closest(`.${className}`);
      let sEl = mouseupParentElm.hasClass(className);
      let eEl = mousedownParentElm.hasClass(className);
      if (sEl && eEl) return;
    }
    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
    };
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind(el) {
    const len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (typeof el[ctx] === 'object' && nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  },
};
