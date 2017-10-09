<template>
    <div>
        <textarea maxlength="140" ref="textarea" v-model.trim="text" @keyup="onKeyUp" placeholder="Write your emotions here..."></textarea>
        <a ref="done" v-bind:class="{ active: isDoneActive }" class="done"  @click="onDoneClick" >done</a>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { TweenMax } from 'gsap';
    import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
    import GlobalState from '../../store/State';
    import autosize from 'autosize';


    export default {
        name: 'textAnalyzer',
        data()  {
            return {
                keyUpCount : 0,
                text: '',
                limit:[30,10],
                limitIndex: 0,
                lastTextLenght: 0,
                isDoneActive: false,
                timeOut: false
            }
        },
        created() {
            this.$store.watch((state) => {state.app.globalState}, this.onChangeState, {deep:true} );
        },
        mounted() {
            this.callAnalysisDebaunce = _.debounce( this.callAnalysis, 500);
            autosize(this.$refs.textarea);
        },
        computed: {
            ...mapState({
                currentState: state => state.app.globalState
            })
        },
        methods: {
            ...mapMutations([
                'setAppGlobalState',
                'setDefaultColors',
                'setClickedDone'
            ]),
            ...mapActions([
                'setEmotionResult',
            ]),
            callAnalysis() {
                this.setEmotionResult(this.text);
            },
            onKeyUp(event) {
                this.text.length > 0 ? this.isDoneActive = true : this.isDoneActive = false;

               /* if ((event.code == 'Space') || (event.code == 'Backspace') || (event.code == 'Delete') || (event.code == 'Enter') ) {
                    if(this.text.length != 0) {
                        this.callAnalysisDebaunce();
                    }
                }
                */

               console.log(this.$refs.textarea.style.height);

               this.timeOut = setTimeout(() => {
                   if(this.text.length > 0) {
                       this.callAnalysisDebaunce();
                   }
               }, 2000);

                if(this.text.length == 0) {
                    this.setDefaultColors();
                }

                /*if(this.keyUpCount >= this.limit[this.limitIndex]) {
                    this.keyUpCount = 0;
                    this.callAnalysisDebaunce();
                    this.lastTextLenght = this.text.length;
                    return
                }
                if((this.text.length - this.lastTextLenght) > 20) {
                    this.callAnalysisDebaunce();
                    this.lastTextLenght = this.text.length;
                    return
                }*/
            },
            /*checkLimit() {
                if(this.text.length > 30) {
                    this.limitIndex = 1
                }
                else {
                    this.limitIndex = 0
                }
            },*/
            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.BASE:
                        TweenMax.to(this.$refs.textarea, 2, {alpha:1, delay: 1.5})
                        this.$refs.textarea.focus();
                        break;
                    case GlobalState.RESULT:

                        break;
                    case GlobalState.LOADING:
                        TweenMax.to(this.$refs.textarea, 1, {alpha:0, bottom: -30});
                        this.isDoneActive = false
                        this.setDefaultColors();
                        break;
                }
            },
            onDoneClick() {
                this.setClickedDone(true);
                this.callAnalysisDebaunce();
                this.setAppGlobalState(GlobalState.LOADING)
            }
        },
    }
</script>


<style scoped>
    textarea {
        position: relative;
        background-color: transparent;
        border: 1px solid red;
        color:#ffffff;
        font-family: 'Ubuntu', sans-serif;
        font-size: 19px;
        text-align: center;
        resize: none;
        width: 300px;
        height: auto;
        opacity:0;
    }
    textarea:focus {
        outline: none;
    }
    p {
        position: relative;
        background-color: transparent;
        border: none;
        color:#ffffff;
        font-family: 'Ubuntu', sans-serif;
        font-size: 19px;
        text-align: center;
    }
    .done {
        position: relative;
        font-family: 'Ubuntu', sans-serif;
        font-size: 19px;
        text-transform: uppercase;
        color: white;
        opacity: 0;
        transition: all 1s;
        display: block;
    }

    .done.active {
        opacity: 1;
    }
</style>