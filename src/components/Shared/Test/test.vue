<template>
    <div class="test">
        <p>{{ this.$store.getters.getEmotionByPosition(0) }}</p>
        <p>{{ this.$store.getters.getEmotionByPosition(1) }}</p>
    </div>
</template>

<script>


    export default {
        name: 'test'
    }
</script>

<style>
    .test {
        position: fixed;
        top:0;
        left: 0;
        width: 300px;
        height: 300px;
        background-color: yellow;
        color: blueviolet;
    }
</style>