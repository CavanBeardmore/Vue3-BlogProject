<template>
  <div>
    <button @click="showPosts" v-show="!ownPosts">View my posts</button>
    <div v-show="ownPosts">
        <button @click="showPosts">Close my posts </button>
        <div v-if="userPosts.length">
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
                <button @click="deletePost(post.id)">Delete</button>
                <br>
                <br>
                <button @click="enableEdit(post)" v-show="!editPost">Edit</button>
                <div v-show="editPost">
                    <button @click="disableEdit()" v-show="editPost">Close Edit</button>
                    <h4> Title </h4>
                    <input type="text" v-model="editTitle" class="input-title" placeholder="Why do cats hate Mondays?">
                    <br>
                    <h4> Content </h4>
                    <textarea rows="4" cols="100" v-model="editContent" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
                    <br>
                    <h4> Content tags </h4>
                    <input type="text" v-model="tag" class="cont-tags-input" placeholder="Enter a tag relevant to your post and click add tag.">
                    <br>
                    <br>
                    <button>Add Tag</button>
                    <div class="list-container" v-show="editTags.length">
                        <h5> Your Tags: </h5>
                        <li v-for="tag in editTags" :key="tag" class="tag-list">
                            {{tag}}
                        </li>
                    </div>
                </div>
                
            </div>
        </div>
        <div v-else>
            <p> You have no posts. </p>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUpdated, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    setup(){
        //use store
        const store = useStore()

        //computed 
        const user = computed(() => store.state.signedIn)
        const posts = computed(() => store.state.posts)

        //boolean refs
        const ownPosts = ref(false)
        const editPost = ref(false)

        //string refs
        const userPosts = ref('')
        const editTitle = ref('')
        const editContent = ref('')
        const editTags = ref('')

        //lifecycle hook
        onMounted(() => {
            const postsArray = store.state.posts.filter((post) => post.creator === user.value.usern)
            userPosts.value = postsArray
        })

        //toggle func
        function showPosts() {
            ownPosts.value = !ownPosts.value
        }

        function enableEdit(post) {
            editPost.value = true
            editTitle.value = post.title
            editContent.value = post.content
            editTags.value = post.tags
        }

        function disableEdit() {
            editPost.value = false
            editTitle.value = ''
            editContent.value = ''
            editTags.value = ''
        }

        //delete function submits the mutation that deletes the post, and then updates the userPosts ref
        function deletePost(post) {
            store.commit('DELETE_POST', post)
            const postsArray = posts.value.filter((post) => post.creator === user.value.usern)
            userPosts.value = postsArray
        }

        return {
            ownPosts,
            showPosts,
            user,
            deletePost,
            userPosts,
            editPost,
            editTitle,
            editContent,
            editTags,
            enableEdit,
            disableEdit,
        }
    }
}
</script>

<style>

</style>