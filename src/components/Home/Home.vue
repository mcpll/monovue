<template>
  <div class="home">
    <home-title :current-colors="currentColors" :current-state="currentState"></home-title>
    <home-monofonts-logo :current-state="currentState"></home-monofonts-logo>
    <intro :current-state="currentState"></intro>
    <!--<about @aboutclick="onAboutClick" :is-open="{ aboutIsOpen }"></about>-->
    <div ref="analyzer_container" class="text-analyzer-container">
      <home-emotion-result :first-emotion="getEmotion(0)" :second-emotion="getEmotion(1)" :score="getScore"></home-emotion-result>
      <p :class="{active: isLoading}" class="load" ref="load"><span>WAIT</span> <br> We're analyzing yours sentence</p>
      <text-analyzer></text-analyzer>
    </div>
    <a class="back" ref="back" @click="onBackButtonClick">Back</a>
  </div>
</template>

<script>
    import About from "./About";
    import TextAnalyzer from "./TextInput";
    import Test from "../Shared/Test/test";
    import HomeTitle from "./HomeTitle";
    import { mapMutations,  mapActions, mapState, mapGetters } from 'vuex';
    import GlobalState from '../../store/State'
    import Intro from "./Intro/Intro";
    import HomeMonofontsLogo from "./HomeMonofontsLogo";
    import HomeEmotionResult from "./HomeEmotionResult";


    export default {
        name: 'home',
        data: function () {
            return {
                aboutIsOpen: false,
                appReady: false,
                isLoading: false,
                //analyzerContainerHeight: this.$refs.analyzer_container.style.height,
                //analyzerContainerWidth: this.$refs.analyzer_container.style.width
            }
        },
        components: {
            HomeEmotionResult,
            HomeMonofontsLogo,
            Intro,
            HomeTitle,
            TextAnalyzer,
            About
        },
        computed: {
            ...mapState({
                currentColors: state => state.app.currentColors,
                currentState: state => state.app.globalState,
                clickedDone: state => state.app.clickedDone
            }),
            ...mapGetters({
                getEmotion: 'getEmotionByPosition',
                getScore: 'getFirstColorScore'
            }),
        },
        created() {
            this.$store.watch((state) => {state.app.emotionalResult}, this.onChangeEmotion, {deep:true} );
            this.$store.watch((state) => {state.app.globalState}, this.onChangeState, {deep:true} );
            window.addEventListener('resize', this.onResize);
            this.setToken();
        },
        mounted() {
            this.onResize();
        },
        methods: {
            ...mapMutations ([
                'setFirstColor',
                'setSecondColor',
                'setAppGlobalState',
                'setClickedDone'
            ]),
            ...mapActions ([
                'setToken'
            ]),
            onAboutClick() {
                this.aboutIsOpen = !this.aboutIsOpen;
            },
            onChangeEmotion() {
                let emo_array = [this.getEmotion(0),this.getEmotion(1)];

                if(this.clickedDone)
                    return

                emo_array.forEach((value, index) => {
                    switch(value) {
                        case 'joy':
                            if(index == 0) {
                                this.setFirstColor(this.$store.getters.getColors('joy'));
                            }else {
                                this.setSecondColor(this.$store.getters.getColors('joy'));
                            }
                            break;
                        case 'anger':
                            if(index == 0) {
                                this.setFirstColor(this.$store.getters.getColors('anger'));
                            }else {
                                this.setSecondColor(this.$store.getters.getColors('anger'));
                            }
                            break;
                        case 'disgust':
                            if(index == 0) {
                                this.setFirstColor(this.$store.getters.getColors('disgust'));
                            }else {
                                this.setSecondColor(this.$store.getters.getColors('disgust'));
                            }
                            break;
                        case 'fear':
                            if(index == 0) {
                                this.setFirstColor(this.$store.getters.getColors('fear'));
                            }else {
                                this.setSecondColor(this.$store.getters.getColors('fear'));
                            }
                            break;
                        case 'sadness':
                            if(index == 0) {
                                this.setFirstColor(this.$store.getters.getColors('sadness'));
                            }else {
                                this.setSecondColor(this.$store.getters.getColors('sadness'));
                            }
                            break;
                    }
                });

            },
            onBackButtonClick() {
                this.setClickedDone(false);
                this.setAppGlobalState(GlobalState.BASE);
            },
            onTimeOutEnd() {
                this.setAppGlobalState(GlobalState.RESULT)
            },
            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.BASE:
                        TweenMax.to(this.$refs.back,1, {opacity:0,left: 0});
                        TweenMax.to(this.$refs.load,0, {opacity:0});
                        break;
                    case GlobalState.RESULT:
                        TweenMax.fromTo(this.$refs.back,1, {opacity:0,left: 0}, {opacity: 1, left: 20});
                        TweenMax.to(this.$refs.load,1, {opacity:0});
                        break;
                    case GlobalState.LOADING:
                        TweenMax.to(this.$refs.load,1, {opacity:1, delay: 1.5});
                        setTimeout(this.onTimeOutEnd, 6000);
                        break;
                }
            },
            onResize() {
                let maxwhh = window.innerWidth;
                let consthhpadding = 150;

                if (window.innerHeight < maxwhh){
                    maxwhh = window.innerHeight;
                }

                if (maxwhh < 320){
                    maxwhh=320;
                }
                if (maxwhh > 600){
                    maxwhh=600;
                }

                let top = (window.innerHeight/2 - (maxwhh-consthhpadding)/2) + 'px';
                let left = (window.innerWidth/2 - (maxwhh-consthhpadding)/2) + 'px';
                let w = maxwhh - consthhpadding;
                let h = maxwhh - consthhpadding;

                this.$refs.analyzer_container.style.width = w + 'px';
                this.$refs.analyzer_container.style.height = h + 'px';
                this.$refs.analyzer_container.style.top = top;
                this.$refs.analyzer_container.style.left = left;

                //this.analyzerContainerWidth = this.$refs.analyzer_container.style.width;
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .home {
    overflow: hidden;
    position: relative;
    height: 100vh;
  }

  .text-analyzer-container {
    position: relative;
  }
h1, h2 {
  font-weight: normal;
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

.load {
  color: white;
  font-size: 12px;
  font-family: 'Ubuntu', sans-serif;
  opacity: 0;
  position: absolute;
  top: 32%;
  left: 30%;
  display: none;
}

.load.active {
  opacity: 1;
}

.load span {
  color: white;
  font-size: 60px;
  font-family: 'Ubuntu', sans-serif;
  font-weight: bold;
  line-height: 20px;
}

a.back {
  color: #42b983;
  font-family: 'Ubuntu', sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  position: absolute;
  left: 20px;
  top:50%;
  opacity: 0;
}
</style>
