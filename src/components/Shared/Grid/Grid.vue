<template>
    <span class="grid hidden-xs">
        <div class="container-fluid">
            <div class="row">
                <div ref="line1" class="col-xs-1 line first"></div>
                <div ref="line2" class="col-xs-4 col-sm-2 line"></div>
                <div ref="line3" class="col-xs-2 line hidden-xs color-quart"></div>
                <div ref="line4" class="col-xs-2 line color-half"></div>
                <div ref="line5" class="col-xs-2 line color-full"></div>
                <div ref="line6" class="col-xs-2 line color-half" ></div>
                <div ref="line7" class="col-xs-2 line color-quart"></div>
                <div ref="line8" class="col-xs-1 line last"></div>
            </div>
        </div>
    </span>
</template>

<script>

    import { mapMutations, mapGetters } from 'vuex';
    import { TimelineLite, TweenMax, Expo } from 'gsap';
    import AudioManger from '../../../scripts/AudioManager';

    require('../../../assets/css/bootstrap.min.css');


    export default {
        name: 'grid',
        computed: {
            ...mapGetters ([
                'getTicker',
            ])
        },
        created() {
            this.$store.watch((state) => {state.app.ticker}, this.pulse, {deep:true} );
        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapMutations([
                'ticker'
            ]),
            init() {

                this.am = new AudioManger();
                this.am.init();
                this.am.loadSound('static/sound/heartbeat.wav', true);

                this.tl =  new TimelineLite();
                this.tl.add(TweenMax.to(this.$refs.line5, .0325, {css:{opacity:.35}, onCompleteParams: [{target: this.$refs.line5, value: .2, isEnd: false}], onComplete: this.toggleAnimation}));
                this.tl.add(TweenMax.to([this.$refs.line6,this.$refs.line4], .0325, {css:{opacity:.30}, onCompleteParams: [{target: [this.$refs.line6,this.$refs.line4], value: .15, isEnd:false}], onComplete: this.toggleAnimation, delay: .0325}));
                this.tl.add(TweenMax.to([this.$refs.line3,this.$refs.line7], .0325, {css:{opacity:.25}, onCompleteParams: [{target: [this.$refs.line3,this.$refs.line7], value: .10, isEnd:false}], onComplete: this.toggleAnimation, delay: .065}));
                this.tl.add(TweenMax.to([this.$refs.line8,this.$refs.line2], .0325, {css:{opacity:.20}, onCompleteParams: [{target: [this.$refs.line8,this.$refs.line2], value: .05, isEnd:true}], onComplete: this.toggleAnimation, delay: .0975}));

                setInterval( () => {
                    this.ticker();
                }, 1100)
            },
            toggleAnimation(obj) {
                //console.log(obj.target);
                //console.log(obj.value);

                if(obj.isEnd) {
                    TweenMax.to(obj.target,.0325, {css:{opacity: obj.value }, onComplete: () => {this.tl.restart(); this.tl.pause();}});
                }
                else {
                    TweenMax.to(obj.target,.0325, {css:{opacity: obj.value}});
                }

            },
            pulse() {
                this.tl.play();
                //this.am.playSound();
            }
        }
    }
</script>



<style scoped>
    .grid {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left:0;
        z-index: -1;
    }

    .grid .container-fluid,
    .grid .container-fluid .row {
        height: 100%;
    }

    .grid .container-fluid .row .line {
        border-left: 1px solid white;
        height: 100%;
        opacity:.05;
    }

    .grid .container-fluid .row .line.color-full {
        border-left: 1px solid white;
        opacity: .20;
    }

    .grid .container-fluid .row .line.color-half {
        border-left: 1px solid white;
        opacity: 0.15;
    }

    .grid .container-fluid .row .line.color-quart {
        border-left: 1px solid white;
        opacity: 0.10;
    }
</style>