<template>
    <div>
        <h4>Emotion</h4>
        <p>{{result}}</p>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { TweenMax } from 'gsap';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import GlobalState from '../../store/State'

    export default {
        name: 'HomeEmotionResult',
        data: function () {
            return {
                result: ''
            }
        },
        computed: {
            ...mapState({
                currentState: state => state.app.globalState
            })
        },
        methods: {
            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.BASE:

                        break;
                }
            },
            onEmotionChange() {

            }
        },
    }
</script>


<style scoped>
    h4 {
        font-size: 12px;
        font-family: 'Ubuntu';
        text-transform: uppercase;
    }
</style>