<template>
  <p> Login here! </p>
  <button @click="logIn">Log In</button>
  {{logInStatus}}
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const logInStatus = computed(() => store.getters.isLoggedIn)

    function logIn() {
      store.commit('LOG_IN')
      router.push('/home');
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