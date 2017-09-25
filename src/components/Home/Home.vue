<template>
  <div class="home">
    <home-title :current-colors="{ currentColors }"></home-title>

    <about @aboutclick="onAboutClick" :is-open="{ aboutIsOpen }"></about>
    <div ref="analyzer_container" class="text-analyzer-container">
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


    export default {
        name: 'home',
        data: function () {
            return {
                aboutIsOpen: false,
                firstEmotion: '',
                secondEmotion: '',
                appReady: false,
                appGlobalState: GlobalState.START
            }
        },
        components: {
            HomeTitle,
            Test,
            TextAnalyzer,
            About
        },
        computed: {
            ...mapState({
                currentColors: state => state.app.currentColors
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
    display: flex;
    align-items: center;
    height: 100vh;
    justify-content: center;
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
