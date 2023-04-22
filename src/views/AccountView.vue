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
  <h3> All accounts </h3>
  <div v-if="activeUser.acctype === 'admin'">
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

export default {
  setup() {
    const store = useStore();

    const users = computed(() => store.state.users);

    const activeUser = computed(() => store.state.activeUser)

    const selectedUser = ref('')

    const errorMsg = computed(() => store.state.errorMsg)

    function deleteUser() {
      store.commit('DELETE_USER', selectedUser.value)
      selectedUser.value = ''
    }

    return {users, selectedUser, activeUser, errorMsg, deleteUser}
    
  }
}
</script>

<style>

</style>