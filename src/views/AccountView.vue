<template>
  <!-- account details -->
  <h3> Your account </h3>
  <p>
    Username: {{signedIn.usern}}
  </p>
  <button @click="toggleEditName()">Edit</button>
  <div v-show="editname">
    <input v-model="editedValue" type="text">
    <button @click="edit('usern', editedValue)">Submit</button>
  </div>
  <p>
    Email: {{signedIn.email}}
  </p>
  <button @click="toggleEditEmail()">Edit</button>
  <div v-show="editemail">
    <input v-model="editedValue" type="text">
    <button @click="edit('email', editedValue)">Submit</button>
  </div>
  <p>
    Password: {{signedIn.passw}}
  </p>
  <button @click="toggleEditPass()">Edit</button>
  <div v-show="editpass">
    <input v-model="editedValue" type="text">
    <button @click="edit('passw', editedValue)">Submit</button>
  </div>
  <p>
    Account type: {{signedIn.acctype}}
  </p>
  <button @click="logOut">Log out</button>
  <br>
  <br>

  <div>
    <UserPosts />
  </div>

  <!-- if user is an admin it shows all the users and a delete account option -->
  <br>
  <button @click="toggleAccs">View Accounts</button>
  <div v-show="accounts">
    <div v-if="signedIn.acctype === 'admin'">
      <h3> All accounts </h3>
      <h6> Enter username of the user you wish to delete. </h6>
      <p> {{errorMsg}} </p>
      <input type="text" v-model="selectedUser" placeholder="Username">
      <button @click="deleteUser"> Delete user </button>
      <div>
        <h4> Total users: {{totalUsers}} </h4>
      </div>
      <div v-for="user in users" :key="user.usern">
        <p>
          Username: {{user.usern}}
        </p>
        <p>
          Email: {{user.email}}
        </p>
        <p>
          Password: {{user.passw}}
        </p>
        <p>
          Account type: {{user.acctype}}
        </p>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { matches, validEmail } from '../regex'
import UserPosts from '../components/UserPosts.vue';

export default {
  components: { UserPosts },
  setup() {
    //use store and router
    const store = useStore();
    const router = useRouter();

    //computed variables
    const users = computed(() => store.state.users);
    const signedIn = computed(() => store.state.signedIn)
    const totalUsers = computed(() => store.getters.totalUsers)
    const errorMsg = computed(() => store.state.errorMsg)

    // string refs
    const selectedUser = ref('')
    const editedValue = ref('')

    //boolean refs
    const editname = ref(false)
    const editemail = ref(false)
    const editpass = ref(false)
    const accounts = ref(false)

    //delete user function
    function deleteUser() {
      store.commit('DELETE_USER', selectedUser.value)
      selectedUser.value = ''
    }

    //logout function
    function logOut() {
      store.commit('LOG_OUT')
      router.push('/')
    }

    //function that uses the edit mutation to change the users details
    function edit(value, newValue) {
      console.log(value, newValue)
      if (value === 'email') {
        if (validEmail(newValue) !== true) {
        return
      }
      store.commit('EDIT', { value, newValue})
      editedValue.value = ''
      } else {
        if (matches(newValue) !== true) {
        return
      }
      store.commit('EDIT', { value, newValue})
      editedValue.value = ''
      }
    }

    //functions that toggle the edit fields for username, email and password, only 1 edit field can be open at one time
    function toggleEditName() {
      editname.value = !editname.value
      if(editpass.value === true || editemail.value === true) {
        editemail.value = false
        editpass.value = false
      }
    }
    function toggleEditEmail() {
      editemail.value = !editemail.value
      if(editname.value === true || editpass.value === true) {
        editpass.value = false
        editname.value = false
      }
    }
    function toggleEditPass() {
      editpass.value = !editpass.value
      if(editname.value === true || editemail.value === true) {
        editemail.value = false
        editname.value = false
      }
    }

    //another toggle func for accounts viewing
    function toggleAccs() {
      accounts.value = !accounts.value
    }

    return {
      users,
      selectedUser,
      totalUsers, 
      signedIn, 
      errorMsg, 
      deleteUser, 
      logOut,
      editname,
      toggleEditName,
      toggleEditEmail,
      toggleEditPass,
      edit,
      editedValue,
      editemail,
      editpass,
      accounts,
      toggleAccs
      }
    
  }
}
</script>

<style>

</style>