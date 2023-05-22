<template>
    <div>
        <h3>{{post.title}}</h3>
        <h4> Created by {{post.creator}} </h4>
        <h4>{{snippet}}</h4>
        <h5> Tags: </h5>
        <div v-for="tag in post.tags" :key="tag"> 
            <h6 v-if="post.tags.length">{{tag}}</h6>
            <h6 v-else> No tags have been created </h6>
        </div>
        <div v-if="user.acctype === 'admin'">
        <p>ID: {{post.id}}</p>
        </div>
    </div>
    <div v-show="user.usern === post.creator || user.acctype === 'admin'">
        <button @click="deletePost(post.id)"> Delete </button>
        <br>
    </div>
    <br>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: ['post'],
    setup(props) {
        //useStore
        const store = useStore()
        
        //computed
        const user = computed(() => store.state.signedIn)
        const snippet = computed(() => {
            return props.post.content.substring(0, 400) + '...'
            })

        //funcs
        function deletePost(post) {
            store.commit('DELETE_POST', post)
        }

        return {
            user,
            snippet,
            deletePost
        }
    }
}
</script>

<style>

</style>