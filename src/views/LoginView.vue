<template>
  
  <div class="sign-in">
    <h3> Sign in </h3>
    <div class="login-cont">
      <div class="unit1">
        <h5>Enter your username: </h5>
        <input type="text" placeholder="JaneSmith18" v-model="signInUser">
      </div>
      <div class="unit2">
        <h5>Enter your password: </h5>
        <input type="password" placeholder="******" v-model="signInPass">
      </div>
    </div>
    <button @click="logIn(signInUser, signInPass)" class="viewer">Log In</button>
    <br>
    <br>
    <div v-show="loginerror" class="detail">
      <h5 style="color: red"> {{ loginerror }} </h5>
    </div>
  </div>

  <div class="acc-create">
    <h4 class="no-account"> Don't have an account? </h4>
    <h5>Enter your username: </h5>
    <input type="text" placeholder="Only letters and numbers" v-model="username">
    <div v-show="unerror">
      <br>
      <br>
      <h5 style="color: red" class="detail"> {{ unerror }} </h5>
    </div>
    <br>
    <br>
    <h5>Enter your email: </h5>
    <input type="text" placeholder="Must be a valid email" v-model="email">
    <div v-show="emerror">
      <br>
      <br>
      <h5 style="color: red" class="detail"> {{ emerror }} </h5>
    </div>
    <br>
    <br>
    <h5>Enter your password: </h5>
    <input type="password" placeholder="Only letters and numbers" v-model="password">
    <div v-show="pwerror">
      <br>
      <br>
      <h5 style="color: red" class="detail"> {{ pwerror }} </h5>
    </div>
    <br>
    <br>
    <h5>Choose account type: </h5>
    <select name="account-type" id="account-type" v-model="role">
      <option value="user" selected>User</option>
      <option value="creator">Creator</option>
      <option value="admin">Admin</option>
    </select>
    <br>
    <br>
    <button @click="createAcc(username, email, password, role)" class="viewer">Create account</button>
    <div v-show="accmessage">
      <br>
      <br>
      <h5 style="color: green" class="detail"> {{ accmessage }} </h5>
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
  width: 50%;
  margin: 10px auto;
  border-radius: 10px;
  }
.acc-create{
  background: lightgray;
  padding: 30px;
  width: 50%;
  margin: 10px auto;
  border-radius: 10px;
  }
  .no-account {
    text-decoration: underline;
  }

  .login-cont {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .unit1{
    margin-right: 10%;
    margin-bottom: 5%;
  }

  .unit2 {
    margin-left: 10%;
    margin-bottom: 5%;
  }
</style>