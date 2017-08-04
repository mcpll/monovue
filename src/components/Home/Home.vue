<template>
  <div class="home">
    <about @aboutclick="onAboutClick" :is-open="{ aboutIsOpen }"></about>
    <text-analyzer></text-analyzer>
  </div>
</template>

<script>
    import About from "./About";
    import TextAnalyzer from "./TextInput";

    export default {
        name: 'home',
        data: function() {
            return {
                aboutIsOpen: false,
            }
        },
        components: {
            TextAnalyzer,
            About
        },
        methods: {
            onAboutClick() {
                this.aboutIsOpen = !this.aboutIsOpen;
            }
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
