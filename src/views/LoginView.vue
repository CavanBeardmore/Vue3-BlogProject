<template>
  
  <div class="sign-in">
    <h3> Sign in </h3>
    <label>Enter your username: </label>
    <input type="text" placeholder="Jane Smith" v-model="signInUser">
    <br>
    <br>
    <label>Enter your password: </label>
    <input type="text" placeholder="******" v-model="signInPass">
    <br>
    <br>
    <button @click="logIn(signInUser, signInPass)">Log In</button>
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
    //use store and router
    const store = useStore()
    const router = useRouter()

    //computed props
    const logInStatus = computed(() => store.getters.isLoggedIn)
    const users = computed(() => store.state.users)
    const activeUser = computed(() => store.getters.getActiveUser)

    //refs for log in function
    const signInUser = ref('');
    const signInPass = ref('');
    
    //refs for create acc function
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('user');

    //login function
    function logIn(username, password) {
      store.commit('CHANGE_USER', { username, password });

      const filteredUsers = users.value.filter((user) => user.usern === activeUser.value.usern && user.passw === activeUser.value.passw)

      if(filteredUsers.length){
          store.commit('LOG_IN')
          router.push('/home');
      }
    }


    //create account function
    function createAcc(username, email, password, role) {
      //uses the create_acc mutation to make a new account
      store.commit('CREATE_ACC', { username, email, password, role })
    }
    
    return {
      logIn,
      logInStatus,
      createAcc,
      role,
      username,
      email,
      password,
      signInPass,
      signInUser,
      activeUser
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