<template>
    <textarea ref="textarea" v-model="text" @keyup="onKeyUp()"></textarea>
</template>

<script>
    import _ from 'lodash';
    import ToneApi from '../../service/ToneApi';

    export default {
        name: 'textAnalyzer',
        data()  {
            return {
                keyUpCount : 0,
                text: '',
                limit:[30,10],
                limitIndex: 0
                lastTextLenght: 0
            }
        },
        mounted() {
            this.callAnalysisDebaunce = _.debounce( this.callAnalysis, 500);
        },
        methods: {
            callAnalysis() {
                console.log('passa');
                ToneApi.getAnalisis(this.text)
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
            }
        },
    }
</script>

<style></style>