<template>
  <p>{{post}}</p>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['id'],
    setup(props) {

        //useStore
        const store = useStore()

        //refs
        const post = ref(null)

        //lifecycle hooks
        onMounted(() => {
            post.value = store.state.posts.filter((obj) => obj.id == props.id)
        })

        return {
            post,
        }
    }
}
</script>

<style>

</style>