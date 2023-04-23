<template>
  <p> Login here! </p>
  <button @click="logIn">Log In</button>
  {{logInStatus}}
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

export default {
  setup() {
    const store = useStore()

    const logInStatus = computed(() => store.getters.isLoggedIn)

    function logIn() {
      store.commit('LOG_IN')
    }
    
    return {
      logIn,
      logInStatus
    }

  }
}
</script>

<style>

</style>