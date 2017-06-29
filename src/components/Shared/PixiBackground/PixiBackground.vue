<template>
    <div ref="bgRenderer" class="pixibackground"></div>
</template>

<script>
    import PIXI from 'PIXI'

    export default {
        name: 'PixiBackground',
        created() {
            let renderer = PIXI.autoDetectRenderer(256,256)
            let stage =  new PIXI.Container();

            this.$refs.bgRenderer.appendChild(renderer.view);

            renderer.render(stage);
        }
    }
</script>

<style>

</style>