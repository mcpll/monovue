<template>
    <div ref="intro" class="intro">
        <div ref="credits" class="credits">
            <p ref="title" class="title">Emotional Type</p>
            <p ref="by" class="by">By Monocromo</p>
        </div>
        <p ref="firstQuotes" class="firstQuotes">Our <span>emotions</span> are in your <span>words</span></p>
        <p ref="secondQuotes" class="secondQuotes">They only make sense when <br> we have someone with whom to <span>share</span> them</p>
    </div>
</template>

<script>
    import { TimelineLite, TweenMax, Expo } from 'gsap';
    import GlobalState from '../../../store/State';
    import { mapMutations } from 'vuex';

    export default {
        name: 'Intro',
        props: ['currentState'],
        watch: {
            currentState: 'onChangeState'
        },
        methods: {
            ...mapMutations([
                'setAppGlobalState'
            ]),
            onChangeState() {
                switch(this.currentState) {
                    case GlobalState.INTRO:
                        console.log('via');
                        let tl =  new TimelineLite();
                        tl.fromTo(this.$refs.title,.8,{opacity:0, top: -50} ,{top: 0, opacity:1, delay:2});
                        tl.fromTo(this.$refs.by,.8,{opacity:0, bottom: -50} ,{bottom: 0, opacity:1},"-=0.8");
                        tl.to(this.$refs.title,.8, {opacity:0,top: -50, display:'none'},"+=3");
                        tl.to(this.$refs.by,.8, {opacity:0, bottom: -50, display: 'none'},"-=0.8");
                        tl.fromTo(this.$refs.firstQuotes,.8, {opacity:0, top: -50},{top: 0, opacity:1, display:'block'});
                        tl.to(this.$refs.firstQuotes,.8, {opacity:0, top: -50, display:'none'}, "+= 3");
                        tl.fromTo(this.$refs.secondQuotes,.8, {opacity:0, top: -50},{top: 0, opacity:1, display:'block'});
                        tl.to(this.$refs.secondQuotes,.8, {opacity:0, top: -50, display:'none', onComplete: this.setState}, "+= 3");
                        break
                    case GlobalState.GRID:
                        this.$refs.intro.style.display = 'none';
                        break;
                }
            },
            setState() {
                this.setAppGlobalState(GlobalState.GRID)
            }
        }
    }
</script>

<style scoped>
    .intro {
        display: flex;
        align-items: center;
        height: 100vh;
        justify-content: center;
    }
    .credits {
        text-align: center;
        font-size: 40px;
        color: #5b5b5b;
        font-family: Lato, sans-serif;
        text-transform: uppercase;
    }
    .credits .title {
        margin-bottom:0;
        position: relative;
        font-family: 'kaleidos';
        font-size: 80px;
        opacity: 0;
        text-transform: none;
    }
    .credits .by {
        margin-top: 0;
        font-size: 16px;
        font-family: Lato, sans-serif;
        font-weight: normal;
        position: relative;
        opacity: 0;
    }
    .firstQuotes {
        text-align: center;
        position: relative;
        opacity: 1;
        display: none;
        font-family: 'Ubuntu', sans-serif;
        font-size: 30px;
        color: #5b5b5b;
        text-transform: uppercase;
    }
    .secondQuotes {
        text-align: center;
        position: relative;
        opacity: 1;
        display: none;
        font-family: 'Ubuntu', sans-serif;
        font-size: 30px;
        color: #5b5b5b;
        text-transform: uppercase;
    }
    .firstQuotes span,
    .secondQuotes span
    {
        color: #00cbad;
    }
</style>