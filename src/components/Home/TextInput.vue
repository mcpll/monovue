<template>
    <textarea maxlength="180" ref="textarea" v-model="text" @keyup="onKeyUp()"></textarea>
</template>

<script>
    import _ from 'lodash';
    import { TweenMax } from 'gsap';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import GlobalState from '../../store/State'

    export default {
        name: 'textAnalyzer',
        data()  {
            return {
                keyUpCount : 0,
                text: 'Write your emotions here...',
                limit:[30,10],
                limitIndex: 0,
                lastTextLenght: 0
            }
        },
        created() {
            this.$store.watch((state) => {state.app.globalState}, this.onChangeState, {deep:true} );
        },
        mounted() {
            this.callAnalysisDebaunce = _.debounce( this.callAnalysis, 500);
        },
        computed: {
            ...mapState({
                currentState: state => state.app.globalState
            })
        },
        methods: {
            ...mapActions([
                'setEmotionResult'
            ]),
            callAnalysis() {
                this.setEmotionResult(this.text);
            },
            onKeyUp() {
                this.checkLimit();
                this.keyUpCount += 1;
                if(this.keyUpCount >= this.limit[this.limitIndex]) {
                    this.keyUpCount = 0;
                    this.callAnalysisDebaunce();
                    this.lastTextLenght = this.text.length;
                    return
                }
                if((this.text.length - this.lastTextLenght) > 20) {
                    this.callAnalysisDebaunce();
                    this.lastTextLenght = this.text.length;
                    return
                }
            },
            checkLimit() {
                if(this.text.length > 30) {
                    this.limitIndex = 1
                }
                else {
                    this.limitIndex = 0
                }
            },
            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.BASE:
                        TweenMax.to(this.$refs.textarea, 2, {alpha:1, delay: 4.5})
                        break;
                }
            }
        },
    }
</script>


<style scoped>
    textarea {
        background-color: transparent;
        border: none;
        color:#ffffff;
        font-family: 'Ubuntu', sans-serif;
        font-size: 19px;
        text-align: center;
        resize: none;
        width: 300px;
        height: 200px;
        opacity:0;
    }
    textarea:focus {
        outline: none;
    }
</style>