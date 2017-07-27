<template>
    <div class="loader">
        <div ref="upperLine" class="upper-line"></div>
        <div ref="lowerLine" class="lower-line"></div>
    </div>
</template>

<script>
    import AssetLoader from 'assets-loader';
    import { TweenMax } from 'gsap';

    const data = require('./data.json');

    export default {
        name: 'Loader',

        methods: {


            /*onPageReady() {

            },

            progress() {

            }*/
        },

        mounted() {

            TweenMax.to(this.$refs.upperLine, 1, {css: {top: 0}, delay: 1});
            TweenMax.to(this.$refs.lowerLine, 1, {css: {bottom: 0}, delay: 1})
            let loader = AssetLoader();

            loader.add(data);

            loader.on('progress', progress => {
                console.log(progress);
            });

            loader.on('complete', assets => {
                console.log(assets);
                //this.setPageReady(true);
            })

            loader.start();
        }
    }
</script>

<style scoped>
    .loader {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: #1A1A1A;
    }
    .upper-line {
        border-left: 1px solid white;
        position: absolute;
        width: 1px;
        height: 50vh;
        top:-50vh;
        left: 50%;
    }
    .lower-line {
        border-left: 1px solid white;
        position: absolute;
        width: 1px;
        height: 50vh;
        bottom: -50vh;
        left: 50%;
    }
</style>