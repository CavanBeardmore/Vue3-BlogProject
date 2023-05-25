<template>
<div class="backer">
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
            console.log(user.acctype)
        })

        return {
            post,
            user
        }
    }
}
</script>

<style>

</style>