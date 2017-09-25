<template>
    <div>
        <h1 ref="title">Emotional Gradient</h1>
    </div>
</template>

<script>
    import { TweenMax} from 'gsap';
    import ColorPropsPlugin from '../../../node_modules/gsap/ColorPropsPlugin';

    export default {
        name: 'HomeTitle',
        props: ['currentColors'],
        watch: {
            currentColors: {
                handler: function (currentColors) {
                    TweenMax.to(this.color, 3, {colorProps:{first:currentColors.currentColors.first}, onUpdate:this.changeTextColor});
                    TweenMax.to(this.color, 3, {colorProps:{second:currentColors.currentColors.second}, onUpdate:this.changeTextColor});
                    //console.log('first color ' + currentColors.currentColors.first)
                    //console.log('second color ' + currentColors.currentColors.second)
                },
                deep: true
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.color = {first: this.currentColors.currentColors.first , second: this.currentColors.currentColors.second}
            },
            changeTextColor() {
                console.log(this.color.first);
                this.$refs.title.style.backgroundImage = 'background: linear-gradient(to right,' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.backgroundImage = 'background: -webkit-linear-gradient(left,' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.backgroundImage = 'background: -o-linear-gradient(right,' +  this.color.first + ' ,' + this.color.second +')';
                this.$refs.title.style.backgroundImage = 'background: -moz-linear-gradient(right,' +  this.color.first + ' ,' + this.color.second +')';
            }
        }
    }
</script>

<style scoped>
    h1 {
        font-size: 22px;
        position: absolute;
        font-weight: bold;
        top:10px;
        left:7%;
        text-transform: uppercase;
        background: -webkit-linear-gradient(left, #02f902 , #01F775);
        background: -o-linear-gradient(right, #02f902, #01F775);
        background: -moz-linear-gradient(right, #02f902, #01F775);
        background: linear-gradient(to right, #02f902 , #01F775);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>