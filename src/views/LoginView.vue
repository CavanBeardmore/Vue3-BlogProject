<template>
  
  <div class="sign-in">
    <h3> Sign in </h3>
    <label>Enter your username: </label>
    <input type="text" placeholder="JaneSmith18" v-model="signInUser">
    <br>
    <br>
    <label>Enter your password: </label>
    <input type="password" placeholder="******" v-model="signInPass">
    <br>
    <br>
    <button @click="logIn(signInUser, signInPass)">Log In</button>
    <br>
    <br>
    <div v-show="loginerror">
      <p style="color: red"> {{ loginerror }} </p>
    </div>
  </div>

  <div class="acc-create">
    <h4> Don't have an account? </h4>
    <label>Enter your username: </label>
    <input type="text" placeholder="Only letters and numbers" v-model="username">
    <div v-show="unerror">
      <br>
      <br>
      <p style="color: red"> {{ unerror }} </p>
    </div>
    <br>
    <br>
    <label>Enter your email: </label>
    <input type="text" placeholder="Must be a valid email" v-model="email">
    <div v-show="emerror">
      <br>
      <br>
      <p style="color: red"> {{ emerror }} </p>
    </div>
    <br>
    <br>
    <label>Enter your password: </label>
    <input type="password" placeholder="Only letters and numbers" v-model="password">
    <div v-show="pwerror">
      <br>
      <br>
      <p style="color: red"> {{ pwerror }} </p>
    </div>
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
    <div v-show="accmessage">
      <br>
      <br>
      <p style="color: green"> {{ accmessage }} </p>
    </div>
    <br>
    <br>
  </div>

</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { matches, validEmail } from '../regex'
import { doesUserExist } from '../helperFuncs'

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

    //error message refs
    const unerror = ref('');
    const pwerror = ref('');
    const emerror = ref('');
    const accmessage = ref('');
    const loginerror = ref('');

    //login function
    function logIn(username, password) {

      //changes the activeuser intending to login within the store
      store.commit('CHANGE_USER', { username, password });

      //checks if the activeuser exists within the userbase
      const filteredUsers = users.value.filter((user) => user.usern === activeUser.value.usern && user.passw === activeUser.value.passw)

      //if filter check is true it runs login mutation changes router location to home and changes the signed in user accordingly
      //if filter check is false proides a login error
      if(filteredUsers.length){
          store.commit('LOG_IN')
          router.push('/home');
          store.commit('NEW_SIGNIN', filteredUsers[0])
      } else {
        loginerror.value = 'Login details are invalid'
      }
    }

    //create account function
    function createAcc(username, email, password, role) {
      //checks if the username entered already exists within the user base if false code runs else returns error
      if (!doesUserExist(username, users.value)) {
        //checks if username, password, and email pass the regex and that username and password are different 
        //then uses the create acc mutation commit to create the account 
        if (matches(username) && username !== password) {
          if (matches(password)) {
            if (validEmail(email)) {
              store.commit('CREATE_ACC', { username, email, password, role })
              accmessage.value = 'Account created!'
              unerror.value = ''
              emerror.value = ''
              pwerror.value = ''
            } else {
              emerror.value = 'Email is invalid'
              pwerror.value = ''
              unerror.value = ''
            }
          } else {
            pwerror.value = 'Password must contain only letters and numbers and must not be the same as the username'
            unerror.value = ''
            emerror.value = ''
          }
        } else {
          unerror.value = 'Username must contain only letters and numbers and must not be the same as the password'
          pwerror.value = ''
          emerror.value = ''
        }
      } else {
        unerror.value = 'Username already exists'
      }
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
      activeUser,
      pwerror,
      unerror, 
      emerror,
      accmessage,
      loginerror
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