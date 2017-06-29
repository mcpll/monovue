<template>
    <a @click="setLeavePage(true)">Bottone Home</a>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'HomeButton',

        created() {
            this.$store.watch((state) => (state.app), this.change, {deep:true})
        },

        methods: {
            ...mapActions ([
                'setLeavePage'
            ]),
            change(value) {
                console.log('HO CAMBIATO STATO');
            },
            say(text) {
                console.log(text)
            }
        }
    }
</script>

<style>

</style>