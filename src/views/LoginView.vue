<template>

  <div class="sign-in">
    <h3> Sign in </h3>
    <label>Enter your username: </label>
    <input type="text" placeholder="Jane Smith">
    <br>
    <br>
    <label>Enter your password: </label>
    <input type="text" placeholder="******">
    <br>
    <br>
    <button @click="logIn">Log In</button>
    <br>
    <br>
  </div>

  <div class="acc-create">
    <h4> Don't have an account? </h4>
    <label>Enter your username: </label>
    <input type="text" placeholder="Jane Smith" v-model="username">
    <br>
    <br>
    <label>Enter your email: </label>
    <input type="text" placeholder="jane.smith@gmail.com" v-model="email">
    <br>
    <br>
    <label>Enter your password: </label>
    <input type="text" placeholder="******" v-model="password">
    <br>
    <br>
    <label for="account-type">Choose account type: </label>
    <select name="account-type" id="account-type" v-model="role">
      <option value="user" selected>User</option>
      <option value="creator">Creator</option>
      <option value="admin">Admin</option>
    </select>
    <br>
    <br>
    <button @click="createAcc(username, email, password, role)">Create account</button>
    <br>
    <br>
  </div>

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

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('user');

    function logIn() {
      store.commit('LOG_IN')
      router.push('/home');
    }

    function createAcc(username, email, password, role) {
      store.commit('CREATE_ACC', { username, email, password, role })
    }
    
    return {
      logIn,
      logInStatus,
      createAcc,
      role,
      username,
      email,
      password
    }
  }
}
</script>

<style>
.sign-in{
  background: lightgray;
  padding: 30px;
  width: fit-content;
  margin: 10px auto;
  border-radius: 10px;
  }
.acc-create{
  background: lightgray;
  padding: 30px;
  width: fit-content;
  margin: 10px auto;
  border-radius: 10px;
  }
</style>