// 引用构造函数，VueRouter中要使用
let Vue

// 保存用户的选项
class VueRouter {
    constructor(options) {
        this.$options = options

        // 优化点：缓存路由表的映射关系，path——>route
        // this.routeMap = {}
        // this.$options.routes.forEach(route => {
        //     this.routeMap[route.path] = route
        // })
        // console.log(this.routeMap)
        // 定义一个响应式的数据current表示路由的变化
        // const initial = window.location.hash.slice(1) || '/'
        // Vue中的响应式方法
        // Vue.util.defineReactive(this, 'current', initial)

        this.current = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'matched', [])
        // match方法可以递归遍历路由表，获得匹配关系数组
        this.match()

        //  监听hashChange事件
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }
    onHashChange() {
        this.current = window.location.hash.slice(1)
        this.matched = []
        this.match()
        console.log(this.matched)
    }

    //match遍历路由表方法
    match (routes) {
        routes = routes || this.$options.routes
        // 递归遍历
        for (const route of routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return
            }
            if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
                this.matched.push(route)
                if (route.children) {
                    this.match(route.children)
                }
                return
            }
        }
    }
}

// 实现VueRouter的install方法，注册$router在Vue的原型之上
VueRouter.install = function(_Vue) {
    // 引用构造函数，VueRouter要使用
    Vue = _Vue
    console.log(_Vue)

    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                // 将$router挂载到Vue的原型之上，方便所有的组件都可以使用this.$router
                Vue.prototype.$router = this.$options.router
            }
        }
    })



    // 实现俩个全局的组件router-link和router-view
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h(
                'a', {
                attrs: {
                    href: '#' + this.to
                }
            }, 
                this.$slots.default
            )
        }
    })
    Vue.component('router-view', {
        render(h) {
            // 标记当前router-view的深度
            this.$vnode.data.routerView = true
            console.log(this)
            console.log(this.$vnode)

            let depth = 0
            let parent = this.$parent
            while(parent) {
                const vnodeData = parent.$vnode && parent.$vnode.data
                console.log('vnodeData', vnodeData)
                if (vnodeData) {
                    if (vnodeData.routerView) {
                        depth++
                    }
                }
                console.log(depth)
                parent = parent.$parent
            }

            // 动态的获取组件，进行内容的渲染
            // const route = this.$router.$options.routes.find(route => route.path === this.$router.current)
            console.log(this.$router)
            // const {routeMap, current}  = this.$router
            // const component = routeMap[current] ? routeMap[current].component : null 
            let component = null
            console.log('matched', this.$router.matched)
            const route = this.$router.matched[depth]
            if (route) {
                component = route.component
            }
            return h(component)
        }
    })
}


export default VueRouter