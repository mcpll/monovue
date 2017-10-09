<template>
    <div>
        <img ref="img" width="150px" src="../../../static/images/logo.svg">
    </div>
</template>

<script>
    import { TweenMax } from 'gsap';
    import ColorPropsPlugin from '../../../node_modules/gsap/ColorPropsPlugin';
    import GlobalState from '../../store/State'

    export default {
        name: 'HomeMonofontsLogo',
        props: ['currentState'],
        watch: {
            currentState: 'onChangeState'
        },
        methods: {
            onChangeState() {
                switch(this.currentState) {
                    case GlobalState.GRID:
                        this.$refs.img.setAttribute("class", "active");
                        break
                }
            }
        }
    }
</script>

<style scoped>
    img {
        position: absolute;
        top:-90px;
        right:7%;
        transition: top 2s;
        opacity: 0;
    }

    .active {
        top: 50px;
        opacity: 1;
    }
</style>