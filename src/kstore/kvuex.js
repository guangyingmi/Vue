// 引入构造函数
let Vue

// 自定义一个循环遍历函数
const forEachValue = (obj, fn) => Object.keys(obj).forEach(key => fn(obj[key], key))

const registerGetter = (store, fn, name) => {
  console.log('这是store参数', store, fn, name)
  console.log('这是getters', store.getters, typeof fn, name)
  Object.defineProperty(store.getters, name, {
    get: () => {
      console.log(fn(store.state))
      return fn(store.state)
    }
  })
}


// 定义Vuex的类
class Store {
  constructor(options) {
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    })
    console.log(options, this._vm)
    // 保存用户传入的mutations和actions, getters
    this._mutations = options.mutations || {}
    this._actions = options.actions || {}
    this.getters = options.getters || {}

    forEachValue(this.getters, (fn, name) => {
      console.log(this, fn, name)
      registerGetter(this, fn, name)
    })

    // 绑定this的指向
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    
  }
  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('Please use replaceState to reset state')
  }

  // 完成commit的逻辑
  commit(type, payload) {
    // 获取type对应的mutations
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`Unknow mutation type: ${type}`)
      return
    }

    // entry存在，指定上下文是Store的实例，把上下文的state传给mutation
    entry(this.state, payload)
  }

  // 完成dispatch的逻辑
  dispatch(type, payload) {
    // 获取type对应的actions
    const entry = this._actions[type]
    if (!entry) {
      console.error(`Unknow action type: ${type}`)
      return
    }
    entry(this, payload)
  }
}


// 实现install方法
function install(_Vue) {
  Vue  = _Vue

  // 混入延迟调用
  Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}


export default {Store, install}