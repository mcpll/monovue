<template></template>

<script>
    import AssetLoader from 'assets-loader';
    import { mapActions}  from 'vuex'
    import data from '../../../assets/json/data.json'

    export default {
        name: 'Loader',

        methods: {
            ...mapActions ([
                'setPageReady'
            ]),

            onPageReady() {

            },

            progress() {

            }
        },

        mounted() {
            let loader = AssetLoader();


            loader.add(data);

            loader.on('progress', progress => {
                console.log(progress);
            });

            loader.on('complete', assets => {
                console.log(assets);
                this.setPageReady(true);
            })

            loader.start();
        }
    }
</script>

<style>

</style>