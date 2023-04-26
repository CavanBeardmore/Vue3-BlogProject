<template>
  <h3> Your account </h3>
  <p>
    Username: {{activeUser.usern}}
  </p>
  <p>
    Email: {{activeUser.email}}
  </p>
  <p>
    Password: {{activeUser.passw}}
  </p>
  <p>
    Account type: {{activeUser.acctype}}
  </p>
  <br>
  <button @click="logOut">Log out</button>

  <br>
  <div v-if="activeUser.acctype === 'admin'">
    <h3> All accounts </h3>
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
    <h6> Enter username of the user you wish to delete. </h6>
    <p> {{errorMsg}} </p>
    <input type="text" v-model="selectedUser" placeholder="Username">
    <button @click="deleteUser"> Delete user </button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'

export default {
  setup() {
    //use store and router
    const store = useStore();
    const router = useRouter();

    //computed variables
    const users = computed(() => store.state.users);
    const activeUser = computed(() => store.getters.getAccount)
    const totalUsers = computed(() => store.getters.totalUsers)
    const errorMsg = computed(() => store.state.errorMsg)

    //refs
    const selectedUser = ref('')

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

    return {users, selectedUser, totalUsers, activeUser, errorMsg, deleteUser, logOut}
    
  }
}
</script>

<style>

</style>