<template>
  <div id="app">
    <h1>Comparateur de Taux de Change</h1>
    <TauxList/>
  </div>
</template>

<script>
import TauxList from "./components/tauxList.vue";

export default {
  components: {
    TauxList,
  },
};
</script>

<style scoped>
#app {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  justify-content: center;
  text-align: center;
  margin: auto;
  padding: 30px;
}
#app h1 {
  margin-bottom: 30px;
  text-align: center;
}
@media screen and (max-width: 750px) {
  #app h1 {
    font-size: 25px;
  }
}
</style>
