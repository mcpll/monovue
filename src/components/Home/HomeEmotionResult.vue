<template>
    <div>
        <h4 ref="title">Emotion</h4>
        <p ref="result">{{emotionResult}}</p>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { TweenMax } from 'gsap';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import GlobalState from '../../store/State'

    export default {
        name: 'HomeEmotionResult',
        props:['firstEmotion','secondEmotion','score'],
        computed: {
            ...mapState({
                currentState: state => state.app.globalState
            }),
            emotionResult() {
                return Math.trunc((this.score * 100))+ '% ' + this.firstEmotion + ' ' +  (100 - Math.trunc(this.score*100)) + '% ' + this.secondEmotion
            }
        },
        created() {
            this.$store.watch((state) => {state.app.globalState}, this.onChangeState, {deep:true} );
        },
        methods: {
            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.BASE:
                        TweenMax.to(this.$refs.title,1, {opacity:0,top: -20});
                        TweenMax.to(this.$refs.result,1, {opacity:0,top: -20});
                        break;
                    case GlobalState.RESULT:
                        TweenMax.to(this.$refs.title,1, {opacity:1,top: 0, delay: 1.5});
                        TweenMax.to(this.$refs.result,1, {opacity:1,top: 0, delay: 1.8});
                        break;
                }
            },
            onEmotionChange() {

            }
        },
    }
</script>


<style scoped>
    h4 {
        position: relative;
        font-size: 10px;
        font-family: 'Ubuntu';
        text-transform: uppercase;
        font-weight: normal;
        color: white;
        opacity: 0;
        top: -10px;
        margin: 10% 0 0 0;
    }
    p {
        position: relative;
        font-size: 18px;
        font-family: 'Ubuntu';
        font-weight: normal;
        color: white;
        text-transform: capitalize;
        opacity: 0;
        margin: 0 0 10% 0;
    }
</style>