<template>
  <div class="h-min">
    <nav class="bg-black text-white p-4">
      <ul class="flex justify-between items-center">
        <li><router-link to="/" class="hover:text-gray-300">Lägg till medlem</router-link></li>

        <li><router-link to="/members" class="hover:text-gray-300">Hantera medlemmar</router-link></li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
