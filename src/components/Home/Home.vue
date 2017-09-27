<template>
  <div class="home">
    <home-title :current-colors="{ currentColors }" :current-state="{ currentState }"></home-title>
    <home-monofonts-logo :current-state="{ currentState }"></home-monofonts-logo>
    <intro :current-state="{ currentState }"></intro>
    <!--<about @aboutclick="onAboutClick" :is-open="{ aboutIsOpen }"></about>-->
    <div ref="analyzer_container" class="text-analyzer-container">
      <home-emotion-result></home-emotion-result>
      <text-analyzer></text-analyzer>
    </div>
  </div>
</template>

<script>
    import About from "./About";
    import TextAnalyzer from "./TextInput";
    import Test from "../Shared/Test/test";
    import HomeTitle from "./HomeTitle";
    import { mapMutations,  mapActions, mapState } from 'vuex';
    import GlobalState from '../../store/State'
    import Intro from "./Intro/Intro";
    import HomeMonofontsLogo from "./HomeMonofontsLogo";
    import HomeEmotionResult from "./HomeEmotionResult";


    export default {
        name: 'home',
        data: function () {
            return {
                aboutIsOpen: false,
                firstEmotion: '',
                secondEmotion: '',
                appReady: false,
            }
        },
        components: {
            HomeEmotionResult,
            HomeMonofontsLogo,
            Intro,
            HomeTitle,
            Test,
            TextAnalyzer,
            About
        },
        computed: {
            ...mapState({
                currentColors: state => state.app.currentColors,
                currentState: state => state.app.globalState,
            })
        },
        created() {
            this.$store.watch((state) => {state.app.emotionalResult}, this.onChangeEmotion, {deep:true} );
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
            ]),
            ...mapActions ([
                'setToken'
            ]),
            onAboutClick() {
                this.aboutIsOpen = !this.aboutIsOpen;
            },
            onChangeEmotion() {
                let firstEmotion = this.$store.getters.getEmotionByPosition(0);
                let secondEmotion = this.$store.getters.getEmotionByPosition(1);

                let emo_array = [firstEmotion,secondEmotion];

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
    border: 1px solid red;
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
</style>
