<template>
    <div>
        <h1 ref="title">Emotional Type</h1>
    </div>
</template>

<script>
    import { TweenMax } from 'gsap';
    import ColorPropsPlugin from '../../../node_modules/gsap/ColorPropsPlugin';
    import GlobalState from '../../store/State'

    export default {
        name: 'HomeTitle',
        props: ['currentColors', 'currentState'],
        watch: {
            currentColors: {
                handler: function (currentColors) {
                    TweenMax.to(this.color, 3, {colorProps:{first:currentColors.first}, onUpdate:this.changeTextColor});
                    TweenMax.to(this.color, 3, {colorProps:{second:currentColors.second}, onUpdate:this.changeTextColor, delay: 2});
                },
                deep: true
            },
            currentState: 'onChangeState'
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.color = {first: this.currentColors.first , second: this.currentColors.second}
                this.changeTextColor();
            },
            changeTextColor() {
                this.$refs.title.style.background = 'radial-gradient(' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.background = '-webkit-radial-gradient(' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.background = '-o-radial-gradient(' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.background = '-moz-radial-gradient(' +  this.color.first + ' ,' + this.color.second +')';
            },
            onChangeState() {
                switch(this.currentState) {
                    case GlobalState.GRID:
                        console.log('ci passo');
                        this.$refs.title.setAttribute("class", "active");
                        break
                }
            }
        }
    }
</script>

<style scoped>
    h1 {
        font-size:40px;
        position: absolute;
        top:-90px;
        font-family: 'kaleidos';
        left:7%;
        font-weight: normal;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent;
        transition: top 2s;
        opacity: 0;
    }

    .active {
        top: 10px;
        opacity: 1;
    }
</style>