<template>
    <svg ref="mousePointer" class="cursor" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 83.7 60">
        <path fill="rgba(255,255,255,0.3)" stroke-dasharray="245" d="M42.1,1.5C58,1.5,70.8,14.3,70.8,30S58,58.5,42.1,58.5c-15.8,0-28.7-12.8-28.7-28.5S26.3,1.5,42.1,1.5z" has-binding="" class=""></path>
    </svg>
</template>
//v-style= "transform: 'translate(' + this.MoveObject.x + ','+ this.MoveObject.y + ')'"
<script>
    import _ from 'lodash'
    import { TweenMax } from 'gsap'
    import { mapMutations, mapGetters } from 'vuex';


    export default {
        name: 'MousePointer',

        data() {
            return {
                MoveObject: {
                    x: 0,
                    y: 0
                }
            }
        },
        created() {
            window.addEventListener('mousemove',this.getMouseCordinates);
            window.addEventListener('mousedown',this.onMouseDown);
            window.addEventListener('mouseup',this.onMouseUp);
            window.addEventListener('mouseovr',this.onMouseOver)
        },
        computed: {
            ...mapGetters ([
                'getX',
                'getY'
            ])
        },
        methods: {
            ...mapMutations ([
                'setMouseX',
                'setMouseY',
            ]),
            getMouseCordinates(event) {
                this.setMouseX(event.pageX);
                this.setMouseY(event.pageY);

                TweenMax.to(this.$refs.mousePointer, .2, {x:this.getX - 50, y:this.getY - 50, transformOrigin:"center center"});
            },
            onMouseDown() {
                TweenMax.to(this.$refs.mousePointer, .25, {scale: 1, transformOrigin:"center center", strokeWidth: 2});
                TweenMax.to(this.$refs.cursor__arrows, .25, {opacity:1});
            },
            onMouseUp() {
                TweenMax.to(this.$refs.mousePointer, .25, {scale: .5, transformOrigin:"center center", strokeWidth: 3});
                TweenMax.to(this.$refs.cursor__arrows, .25, {opacity:0});
            },
            onMouseOver() {
                console.log('MouseOver');
            }
        }
    }
</script>

<style scoped>
    svg:not(:root) {
        overflow: hidden;
    }
    .cursor {
        display: block;
        width: 100px;
        height: 100px;
        transform: scale(.5) translateZ(0);
        stroke-width: 3;
        stroke: none;
        fill: none;
        pointer-events: none;
        position: absolute;
        z-index: 1000;
    }
    .cursor__arrows {
        opacity: 0;
        transform: rotate(90deg);
        transform-origin: center center;
    }
</style>