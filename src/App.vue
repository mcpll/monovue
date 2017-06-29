<template>
  <div id="app">
    <mouse-pointer></mouse-pointer>
    <router-view></router-view>
  </div>
</template>

<script>
    import MousePointer from "./components/Shared/MousePointer/MousePointer";
    import Loader from "./components/Shared/Loader/Loader";
    import PixiBackground from "./components/Shared/PixiBackground/PixiBackground";
    import Drag from "./components/Shared/Drag/Drag";

    export default {
        components: {
            Drag,
            PixiBackground,
            Loader,
            MousePointer},
        name: 'app'
    }
</script>

<style>
  body {
    overflow: hidden;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  img {
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */

    /* Rules below not implemented in browsers yet */
    -o-user-select: none;
    user-select: none;
  }
</style>
