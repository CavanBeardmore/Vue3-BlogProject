<template>
  <nav>
    <div class="router">
      <router-link to="/home">Home</router-link> 
    </div>
    <div class="router">  
      <router-link to="/about">About</router-link> 
    </div>
    <div class="router">
      <router-link to="/posts">Posts</router-link> 
    </div>
    <div class="router">
      <router-link to="/account">Account</router-link>
    </div>
  </nav>
<div class="container">
  <!-- account details -->
  <div class="details">
    <h3> Your account </h3>
    <p style="color: red" class="detail" v-show="changeError">{{changeError}}</p>
    <p style="color: green" class="detail" v-show="changeMessage">{{changeMessage}}</p>
    <!-- Displays username -->
    <div v-show="!editname" class="detail-tile">
      <h4>Username:</h4>
      <p class="detail"> {{signedIn.usern}} </p>
      <button @click="toggleEditName(signedIn.usern)" class="viewer">Edit</button>
    </div>

    <!-- Displays edit method for username -->
    <div v-show="editname" class="detail-tile">
      <h4>Username:</h4>
      <input v-model="editedValue" type="text">
      <button @click="edit('usern', editedValue)" class="closer">Submit</button>
      <br>
      <button @click="toggleEditName()" class="viewer">Edit</button>
    </div>

    <!-- Displays email -->
    <div v-show="!editemail" class="detail-tile">
      <h4> Email: </h4>
      <p class="detail"> 
        {{signedIn.email}}
      </p>
      <button @click="toggleEditEmail(signedIn.email)" class="viewer">Edit</button>
    </div>

    <!-- Displays edit method for email -->
    <div v-show="editemail" class="detail-tile">
      <h4> Email: </h4>
      <input v-model="editedValue" type="text">
      <button @click="edit('email', editedValue)" class="closer">Submit</button>
      <br>
      <button @click="toggleEditEmail(signedIn.email)" class="viewer">Edit</button>
    </div>

    <!-- Displays password -->
    <div v-show="!editpass" class="detail-tile">
      <h4> Password: </h4>
      <p class="detail">
        {{signedIn.passw}}
      </p>
      <button @click="toggleEditPass(signedIn.passw)" class="viewer">Edit</button>
    </div>

    <!-- Displays edit method for password -->
    <div v-show="editpass" class="detail-tile">
      <h4> Password: </h4>
      <input v-model="editedValue" type="text">
      <button @click="edit('passw', editedValue)" class="closer">Submit</button>
      <br>
      <button @click="toggleEditPass(signedIn.passw)" class="viewer">Edit</button>
    </div>

    <div class="detail-tile">
      <h4>Account type:</h4>
      <p class="detail">
        {{signedIn.acctype}}
      </p>
    </div>
    <button @click="logOut" class="closer">Log out</button>
    <br>
    <button @click="deleteAreYouSure(signedIn)" class="closer" v-show="!signedIn.deleteMessage"> Delete </button>
    <div class="detail-tile" v-show="signedIn.deleteMessage">
      <p class="detail">This action will permanently delete your account and posts.</p>
      <p class="detail">Are you sure?</p>
      <button @click="deleteSelf" class="closer"> Yes, delete. </button>
      <button @click="deleteAreYouSure(signedIn)" class="viewer"> No, do not delete. </button>
    </div>
    <br>
    <br>
  </div>

  <!-- shows the posts that the user has created -->
  <div class="user-posts" v-if="signedIn.acctype !== 'user'">
    <UserPosts />
  </div>

  <!-- if user is an admin it shows all the users and a delete account option -->
  <br>
  <div class="accounts" v-if="signedIn.acctype === 'admin'">
      <br v-show="!accounts">
      <!-- shows either close or view accounts button depending on if this is true or false -->
      <button @click="toggleAccs" v-show="!accounts" class="viewer">View Accounts</button>
      <br>
      <button @click="toggleAccs" v-show="accounts" class="closer">Close Accounts</button>
      <!-- if accounts is true it shows the accounts -->
      <div v-show="accounts">
        <div>
          <h3> All accounts </h3>
          <!-- delete user method -->
          <h6> Search for a user. </h6>
        </div>
        <div class="detail-tile">
          <h5 class="detail" style=" color: red " v-show="errorMsg"> {{errorMsg}} </h5>
          <input type="text" v-model="enteredUser" placeholder="Username">
          <button @click="searchForUser" class="closer"> Search </button>
          <button @click="clearSearch" class="closer" v-show="searchedUser"> Clear </button>
        </div>
        <div class="detail-tile" v-show="searchedUser">
          <h4>Username: </h4>
          <p class="detail"> {{searchedUser.usern}} </p>
          <h4>Email: </h4>
          <p class="detail"> {{searchedUser.email}} </p>
          <div v-if="searchedUser.acctype !== 'user'">
              <h4 v-if="searchedUser.posts">Number of posts: </h4>
              <p class="detail" v-if="searchedUser.posts">
                {{searchedPostsLength}}
              </p>
              <h4 v-if="searchedPostsLength !== 0"> Post titles: </h4>
              <div v-for="post in searchedUser.posts" :key="post.id">
                <p class="post-title" @click="view(post.id)">{{post.title}}</p>
              </div>
          </div>
          <h4>Account type: </h4>
          <p class="detail"> {{searchedUser.acctype}} </p>
          <br>
          <button @click="deleteAreYouSure(searchedUser)" class="closer" v-show="!searchedUser.deleteMessage"> Delete user </button>
          <div v-show="searchedUser.deleteMessage">
            <p class="detail">This action will permanently delete {{searchedUser.usern}} and their posts.</p>
            <p class="detail">Are you sure?</p>
            <button @click="deleteUser(searchedUser.usern)" class="closer"> Yes, delete {{searchedUser.usern}}. </button>
            <button @click="deleteAreYouSure(searchedUser)" class="viewer"> No, do not delete.</button>
          </div>
        </div>
          <div class="detail-tile">
            <!-- shows total amount of users -->
            <h4 class="detail"> Total users: {{totalUsers}} </h4>
          </div>
          <!-- displays the data for each user within the users array -->
          <div v-for="user in users" :key="user.usern" class="detail-tile">
            <h4>Username: </h4>
            <p class="detail">
              {{user.usern}}
            </p>
            <h4>Email: </h4>
            <p class="detail">
              {{user.email}}
            </p>
            <div v-if="user.acctype !== 'user'">
              <h4>Number of posts: </h4>
              <p class="detail">
                {{user.posts.length}}
              </p>
              <h4 v-if="user.posts.length"> Post titles: </h4>
              <div v-for="post in user.posts" :key="post.id">
                <p class="post-title" @click="view(post.id)">{{post.title}}</p>
              </div>
            </div>
            <h4>Account type: </h4>
            <p class="detail">
              {{user.acctype}}
            </p>
            <br>
            <button @click="deleteAreYouSure(user)" class="closer" v-show="!user.deleteMessage"> Delete user </button>
            <div v-show="user.deleteMessage">
              <p class="detail">This action will permanently delete {{user.usern}} and their posts.</p>
              <p class="detail">Are you sure?</p>
              <button @click="deleteUser(user.usern)" class="closer"> Yes, delete {{user.usern}}. </button>
              <button @click="deleteAreYouSure(user)" class="viewer"> No, do not delete.</button>
            </div>
            <br>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
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
    const signedIn = computed(() => store.getters.getSignedIn)
    const totalUsers = computed(() => store.getters.totalUsers)

    //store refs
    const userArray = ref(users)

    // string refs
    const enteredUser = ref('')
    const searchedUser = ref('')
    const postLength = ref('')
    const editedValue = ref('')
    const errorMsg = ref('')
    const changeError = ref('')
    const changeMessage = ref('')
    const searchedPostsLength = ref('')

    //boolean refs
    const editname = ref(false)
    const editemail = ref(false)
    const editpass = ref(false)
    const accounts = ref(false)

    /*             FUNCTIONS              */

    function view(post) {
      router.push({ name: 'SinglePostView', params: { id: post } })
    }

    //searches for a user within the user base and returns this
    function searchForUser() {
      const filteredUsers = userArray.value.filter((user) => user.usern.toLowerCase() === enteredUser.value.toLowerCase())
      if (!filteredUsers.length) {
        errorMsg.value = 'User not found.'
      } else {
        searchedUser.value = filteredUsers[0]
        if (searchedUser.value.acctype !== 'user') {
          searchedPostsLength.value = searchedUser.value.posts.length
        }
      }
    }

    //clears the searched users
    function clearSearch() {
      searchedUser.value = ''
    }

    //toggle the delete message property within the user object so the are you sure message displays
    function deleteAreYouSure(user) {
      user.toggleDeleteMessage()
    }

    //delete user function
    function deleteUser(userToBeDeleted) {
      //ensures the user isn't deleting their own account
        if (signedIn.value.usern !== userToBeDeleted) {
          //filters through the users until it finds the user that was entered and then deletes them or if user doesnt exist produces an error
            const filteredUsers = userArray.value.filter((user) => user.usern !== userToBeDeleted)
            store.commit('DELETE_USER', { filteredUsers, userToBeDeleted })
            errorMsg.value = 'User deleted!'
        } else {
          errorMsg.value = 'You cannot delete your own account here.'
        } 
    }

    function deleteSelf() {
      store.commit('LOG_OUT')
      router.push('/')
      store.commit('DELETE_SELF', signedIn.value.usern)
    }

    //logout function
    function logOut() {
      store.commit('LOG_OUT')
      router.push('/')
    }

    //function that uses the edit mutation to change the users details
    function edit(value, newValue) {
      //checks if the value the user wants to change is email
      if (value === 'email') {
        //if it is email it checks if the email is valid
        if (!validEmail(newValue)) {
          changeError.value = 'Email is invalid.'
          changeMessage.value = ''
        } else {
          store.commit('EDIT', { value, newValue})
          changeMessage.value = 'Change successful!'
          changeError.value = ''
          editedValue.value = ''
          editname.value = false
          editpass.value = false
          editemail.value = false
        }
      //checks if the value the user wants to change is their username
      } else if(value === 'usern'){
        //checks the username matches the regex
        if (!matches(newValue)) {
          changeError.value = 'Input is invalid'
          changeMessage.value = ''
          //this checks if the new username is the same as the password
        } else if (newValue !== signedIn.value.passw) {
          store.commit('EDIT', { value, newValue })
          changeMessage.value = 'Change successful!'
          changeError.value = ''
          editedValue.value = ''
          editname.value = false
          editpass.value = false
          editemail.value = false
        } else {
          changeError.value = 'Username and password cannot be the same'
          changeMessage.value = ''
        }
      } else {
        //checks the password matches the regex
        if (!matches(newValue)) {
          changeError.value = 'Input is invalid'
          changeMessage.value = ''
          //checks if username is the same as the new password
        } else if (signedIn.value.usern !== newValue) {
          store.commit('EDIT', { value, newValue })
          changeMessage.value = 'Change successful!'
          changeError.value = ''
          editedValue.value = ''
          editname.value = false
          editpass.value = false
          editemail.value = false
        } else {
          changeError.value = 'Username and password cannot be the same'
          changeMessage.value = ''
        }
      }
    }

    //functions that toggle the edit fields for username, email and password, only 1 edit field can be open at one time
    function toggleEditName(name) {
      editname.value = !editname.value
      editedValue.value = name
      if(editpass.value === true || editemail.value === true) {
        editemail.value = false
        editpass.value = false
      }
    }
    function toggleEditEmail(email) {
      editemail.value = !editemail.value
      editedValue.value = email
      if(editname.value === true || editpass.value === true) {
        editpass.value = false
        editname.value = false
      }
    }
    function toggleEditPass(password) {
      editpass.value = !editpass.value
      editedValue.value = password
      if(editname.value === true || editemail.value === true) {
        editemail.value = false
        editname.value = false
      }
    }

    //another toggle func for accounts viewing
    function toggleAccs() {
      accounts.value = !accounts.value
      errorMsg.value = ''
    }

    return {
      users,
      enteredUser,
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
      toggleAccs,
      changeError,
      changeMessage,
      searchForUser,
      searchedUser,
      postLength,
      deleteSelf,
      clearSearch,
      deleteAreYouSure,
      view,
      searchedPostsLength
      }
    
  }
}
</script>

<style>

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.details {
  flex-basis: 30%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: lightblue;
  margin: 1%;
  border-style: ridge;
}

.user-posts {
  flex-basis: 30%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: lightblue;
  margin: 1%;
  border-style: ridge;
}

.accounts {
  flex-basis: 30%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: lightblue;
  margin: 1%;
  border-style: ridge;
}

.viewer {
  padding: 5px;
  margin-top: 10px;
  border-radius: 5px;
  border-style: groove;
  margin: 0 auto;
  width: fit-content;   
}

.viewer:hover {
  color: #ECF3F1;
  background-color: #1EA086;
}

.closer {
  padding: 5px;
  margin: 0 auto;
  border-radius: 5px;
  border-style: groove;
  width: fit-content;          
}

.closer:hover {
  color: #ECF3F1;
  background-color: #C6190E;
}

input{
  padding: 5px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}

h3 {
  text-decoration: underline;
}

.detail-tile {
  background-color: lightgray;
  border-radius: 5px;
  border-style: groove;
  width: 300px;
  margin: 15px auto;
  padding: 15px;
}

.detail {
  background-color: whitesmoke;
  border-radius: 5px;
  width: fit-content;
  margin: 10px auto;
  padding: 8px;
  border-style: groove;
}
</style>