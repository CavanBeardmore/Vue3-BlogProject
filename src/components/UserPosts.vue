<template>
  <div>
    <button @click="showPosts" v-show="!ownPosts">View my posts</button>
    <div v-show="ownPosts">
        <button @click="showPosts">Hide my posts </button>
        <div v-for="post in userPosts" :key="post.id">
            <div class="header">
                <h2>{{post.title}}</h2>
                <h4>Created by {{post.creator}}</h4>
            </div>
            <div class="body">
                <p>{{post.content}}</p>
                <div v-for="tag in post.tags" :key="tag" class="tags">
                    <h6 class="tag"> #{{tag}} </h6>
                </div>
            </div>
            <div v-if="user.acctype === 'admin'">
                <p> Post ID:{{post.id}}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    props:['userPosts'],
    setup(){
        
        const store = useStore()

        const user = computed(() => store.state.signedIn)

        const ownPosts = ref(false)

        function showPosts() {
            ownPosts.value = !ownPosts.value
        }

        return {
            ownPosts,
            showPosts,
            user
        }
    }
}
</script>

<style>

</style>