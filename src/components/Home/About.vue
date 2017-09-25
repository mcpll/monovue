<template>
    <div :class="[ {open: isOpen.aboutIsOpen} ]" class="about" @click="onClick()">

    </div>
</template>

<script>
    export default {
        name: 'about',
        props: ['isOpen'],
        computed: {
            classes: () => {
                let classes = [];
                if(this.isOpen) {
                    classes.push('open');
                }
                return classes
            }
        },
        methods: {
            onClick() {
                this.$emit('aboutclick');
            }
        }
    }
</script>

<style>
    .about {
        background-color: #3d3d3d;
        width: 100vw;
        position: absolute;
        left: 95vw;
        height: 100%;
        top: 0;
        transition: all 0.3s ease;
    }

    .open {
        left:0;
    }
</style>