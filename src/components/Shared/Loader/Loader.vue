<template>
    <div ref="loader" class="loader">
        <div ref="upperLine" class="upper-line"></div>
        <div ref="lowerLine" class="lower-line"></div>
    </div>
</template>

<script>
    import AssetLoader from 'assets-loader';
    import { TweenMax } from 'gsap';
    import { mapGetters } from 'vuex';

    const data = require('./data.json');

    export default {
        name: 'Loader',
        created() {
            this.$store.watch((state) => {state.app.loading}, this.update, {deep:true} );
            this.$store.watch((state) => {state.app.appReady}, this.onAppReady, {deep:true} );
        },

        computed: {
            ...mapGetters([
                'getLoading',
                'getAppReady'
            ])
        },

        methods: {
            update() {
                let val = (this.getLoading/2) - 50;
                val = + Math.trunc(val) + 'vh';
                //console.log(val);
                document.getElementsByClassName("upper-line")[0].style.top = val;
                document.getElementsByClassName("lower-line")[0].style.bottom = val;

            },

            onAppReady() {
                if(this.getAppReady) {
                    TweenMax.to(this.$refs.upperLine, 1, {css: {opacity: 0}, delay: 1});
                    TweenMax.to(this.$refs.lowerLine, 1, {css: {opacity: 0, onComplete: this.hidden},delay: 1});
                }
            },

            hidden() {
                TweenMax.to(this.$refs.loader, .5, {alpha:0, delay: 1});
            },

            /*onPageReady() {

            },

            progress() {

            }*/
        },

        mounted() {

            //TweenMax.to(this.$refs.upperLine, 1, {css: {top: 0}, delay: 1});
            //TweenMax.to(this.$refs.lowerLine, 1, {css: {bottom: 0}, delay: 1})
            let loader = AssetLoader();

            //loader.add(data);

            loader.on('progress', progress => {
                //console.log(progress);
            });

            loader.on('complete', assets => {
                //console.log(assets);
                //this.setPageReady(true);
            })

            //loader.start();
        }
    }
</script>

<style scoped>
    .loader {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: transparent;
    }
    .upper-line {
        border-left: 1px solid white;
        position: absolute;
        width: 1px;
        height: 50vh;
        top:-50vh;
        left: 50%;
        transition: all 0.5s ease;
    }
    .lower-line {
        border-left: 1px solid white;
        position: absolute;
        width: 1px;
        height: 50vh;
        bottom: -50vh;
        left: 50%;
        transition: all 0.5s ease;
    }
</style>