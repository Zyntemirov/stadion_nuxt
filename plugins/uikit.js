import Vue from 'vue'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

UIkit.use(Icons);

Object.defineProperty(Vue.prototype, '$uikit', {
  value: UIkit,
  writable: false
});
