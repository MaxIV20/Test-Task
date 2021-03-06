<template>
  <div id="app">
    <div class="main-container">
      <WeatherWidget />
    </div>
  </div>
</template>

<script>
import WeatherWidget from "@/components/weatherWidget";

export default {
  name: "App",
  components: {
    WeatherWidget,
  },
};
</script>

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}
</style>
