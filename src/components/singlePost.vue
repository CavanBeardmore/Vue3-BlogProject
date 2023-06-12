<template>
    <div class="post" @dblclick="view(post.id)">
        <h3 class="title" @click="view(post.id)">{{post.title}}</h3>
        <h4> Created by {{post.creator}} </h4>
        <h4>{{snippet}}</h4>
        <h5> Tags: </h5>
        <div v-for="tag in post.tags" :key="tag"> 
            <h6>#{{tag}}</h6>
        </div>
        <h6> {{post.date}} </h6>
        <div v-if="user.acctype === 'admin'">
        <p>ID: {{post.id}}</p>
        </div>
    </div>
    <div v-show="user.usern === post.creator || user.acctype === 'admin'">
        <button @click="deletePost(post)" class="closer"> Delete </button>
        <br>
    </div>
    <br>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    props: ['post'],
    setup(props) {
        //useStore
        const store = useStore()
        const router = useRouter()
        
        //computed
        const user = computed(() => store.state.signedIn)
        const snippet = computed(() => {
            return props.post.content.substring(0, 400) + '...'
            })

        //funcs
        function deletePost(post) {
            store.commit('DELETE_POST', post)
        }

        function view(post) {
            router.push({ name: 'SinglePostView', params: { id: post } })
        }

        return {
            user,
            snippet,
            deletePost,
            view
        }
    }
}
</script>

<style>
 
</style>