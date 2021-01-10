<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p @click="$store.commit('add')">mutations:{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">actions:{{$store.state.counter}}</p>
    <p>sum:{{$store.state.sum}}</p>
    <p>getters:{{$store.getters.doubleCounter}}</p>
    <p>getters2:{{$store.getters.addCounter}}</p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
