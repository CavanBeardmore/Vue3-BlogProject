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
<div class="backer">
    <h2 class="post-title">{{post.title}}</h2>
    <div class="post-info">
        <h4 class="created-by">Created by {{post.creator}}</h4>
        <h6 class="date"> {{post.date}} </h6>
        <div v-if="user.acctype === 'admin'">
            <p class="id"> Post ID:{{post.id}}</p>
        </div>
    </div>
    <div class="body">
        <p class="content">{{post.content}}</p>
        <div v-for="tag in post.tags" :key="tag" class="tag-list">
            <h6 class="tag"> #{{tag}} </h6>
        </div>
    </div>
</div>

</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['id'],
    setup(props) {

        //useStore
        const store = useStore()

        //computed
        const user = computed(() => store.state.signedIn)

        //refs
        const post = ref('')

        //lifecycle hooks
        onMounted(() => {
            const postArray = store.state.posts.filter((obj) => obj.id == props.id)
            post.value = postArray[0]
        })

        return {
            post,
            user
        }
    }
}
</script>

<style scoped>

.backer {
background-color: lightgray;
  border-radius: 5px;
  border-style: groove;
  width: 95%;
  margin: 15px auto;
  padding: 15px; ;
}

.post-title {
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding: 8px;
    border-style: groove;
    }

.post-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}

.created-by {
    flex-basis: 20%;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px;
    padding-top: 16px;
    border-style: groove;
}

.content{   
    background-color: whitesmoke;
    border-radius: 5px;
    width: 70%;
    margin: 10px auto;
    padding: 8px;
    border-style: groove;
}

.date {
    flex-basis: 20%;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px;
    padding-top: 18px;
    font-size: small;
    border-style: groove;
}

.id {
    flex-basis: 20%;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px;
    padding: 20px;
    font-size: small;
    border-style: groove;
}


.tag-list{
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: left;
    flex-wrap: wrap;
}

.tag {
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding: 5px;
    font-size: small;
    border-style: groove;
}

</style>