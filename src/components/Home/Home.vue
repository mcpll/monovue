<template>
  <div class="home">

  </div>
</template>

<script>

    export default {
        name: 'home',
        computed: {
            msg() {
                return this.$store.state.page.home.msg
            }
        },
        components: {
            Blob

        },
        mounted() {

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .home {
    overflow: hidden;
    position: relative;
    height: 100vh;
  }
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
