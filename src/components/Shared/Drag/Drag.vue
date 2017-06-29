<template>
    <div class="drag" ref="rect"></div>
</template>

<script>
    export default {
        name:'drag',
        mounted() {
            let drags = document.querySelectorAll('.drag');
            let handleDragStart = this.handleDragStart;
            let handleDragEnter = this.handleDragEnter;
            let handleDragOver = this.handleDragOver;
            let handleDragLeave = this.handleDragLeave;
            let handleDragEnd = this.handleDragEnd;

            console.log(drags);
            [].forEach.call(drags, function(drag) {
                console.log(drag);
                drag.addEventListener('dragstart', handleDragStart, false);
                drag.addEventListener('dragenter', handleDragEnter, false);
                drag.addEventListener('dragover', handleDragOver, false);
                drag.addEventListener('dragleave', handleDragLeave, false);
                drag.addEventListener('dragend', handleDragEnd, false);
            });
        },
        methods: {
            handleDragStart(event) {
                console.log('handleDragStart');
            },
            handleDragEnter(event) {
                console.log('handleDragEnter');
            },
            handleDragOver(event) {
                console.log('handleDragOver');
            },
            handleDragLeave(event) {
                console.log('handleDragLeave');
            },
            handleDragEnd(event) {
                console.log('handleDragEnd');
            }
        }
    }

</script>

<style scoped>
    div {
        background-color: aquamarine;
        width: 60px;
        height: 60px;
    }
</style>