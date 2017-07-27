<template>
    <div class="works">
        <img src="../../assets/logo.png">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <ul>
            <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
            <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
            <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
            <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
            <br>
            <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
        </ul>
        <h2>Ecosystem</h2>
        <ul>
            <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
            <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
            <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
        </ul>
    </div>
</template>

<script>

    import { TweenMax } from 'gsap'

    export default {
        name: 'works',
        computed: {
            msg() {
                return this.$store.state.page.works.msg
            }
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .works {
        position: relative;
    }
    h1, h2 {
        font-weight: normal;
        color: white;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    body {
        background-color: black;
        color: #ccc;
        text-align: center;
    }


    #template, #path {
        fill: none;
    }
    #template {
        stroke-width: 5px;
        stroke: #444;
    }
    #path {
        stroke: #88CE02;
        stroke-width: 20px;
        visibility: hidden;
    }
    #code, #value {
        font-size: 40px;
        font-family: monospace;
    }
    #code {
        color: #777;
        margin: 20px;
        position: relative;
        visibility:hidden;
    }
    #current {
        display: inline-block;
        color: white;
    }
    #description {
        max-width: 530px;
        color: #777;
        font-family: Arial, sans-serif;
        font-size: 24px;
        display: inline-block;
        text-align: left;
    }


</style>
