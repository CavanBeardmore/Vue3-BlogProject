<template>
  <div v-if="user.acctype === 'admin' || user.acctype === 'creator'">
    <button @click="showPosts" v-show="!ownPosts">View my posts</button>
    <div v-show="ownPosts">
        <button @click="showPosts">Close my posts </button>
        <div v-if="posts.length">
            <div v-for="post in posts" :key="post.id">
                <div class="header">
                    <h2>{{post.title}}</h2>
                    <h4>Created by {{post.creator}}</h4>
                </div>
                <div class="body">
                    <p>{{post.content}}</p>
                    <div v-for="tag in post.tags" :key="tag" class="tags">
                        <h6 class="tag"> #{{tag}} </h6>
                    </div>
                    <h6> {{post.date}} </h6>
                </div>
                <div v-if="user.acctype === 'admin'">
                    <p> Post ID:{{post.id}}</p>
                </div>
                <button @click="deletePost(post)">Delete</button>
                <br>
                <br>
                <button @click="enableEdit(post)" v-show="!post.edit">Edit</button>
                <div v-show="post.edit">
                    <button @click="disableEdit(post)" v-show="post.edit">Close Edit</button>
                    <h4> Title </h4>
                    <input type="text" v-model="editTitle" class="input-title" placeholder="Why do cats hate Mondays?">
                    <button @click="submitChange(post, editTitle, 5, 40, 'title')">Submit changes</button>
                    <br>
                    <h4> Content </h4>
                    <textarea rows="4" cols="100" v-model="editContent" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
                    <button @click="submitChange(post, editContent, 500, 6000, 'content')">Submit changes</button>
                    <br>
                    <p style="color: red"> {{editError}} </p>
                    <h4> Content tags </h4>
                    <input type="text" v-model="editTag" class="cont-tags-input" placeholder="Enter a tag relevant to your post and click add tag.">
                    <br>
                    <br>
                    <button>Add Tag</button>
                    <br>
                    <br>
                    <input type="text" v-model="deletedTag" class="cont-tags-input" placeholder="Enter a tag you wish to delete.">
                    <br>
                    <br>
                    <button @click="deleteTag(post)">Delete Tag</button>
                    <p style=" color: red ">{{editTagError}} </p>
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
import { meetsLengthReqs } from '../helperFuncs'

export default {
    setup(){
        //use store
        const store = useStore()

        //computed 
        const user = computed(() => store.state.signedIn)
        const posts = computed(() => store.state.signedIn.posts)

        //boolean refs
        const ownPosts = ref(false)

        //string refs
        const userPosts = ref('')
        const editTitle = ref('')
        const editContent = ref('')
        const editTags = ref('')
        const deletedTag = ref('')
        const editTagError = ref('')
        const editError = ref('')
        const editTag = ref('')

        //toggle func
        function showPosts() {
            ownPosts.value = !ownPosts.value
        }

        function enableEdit(post) {
            post.toggleEditPost()
            editTitle.value = post.title
            editContent.value = post.content
            editTags.value = post.tags
        }

        function disableEdit(post) {
            post.toggleEditPost()
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

        function deleteTag(post) {
            if (editTags.value.length != 1) {
                if (editTags.value.includes(deletedTag.value)) {
                const index = editTags.value.indexOf(deletedTag.value)
                post.tags.splice(index, 1)
                deletedTag.value = ''
                editTagError.value = ''
                } else {
                    editTagError.value = 'Tag does not exist'
                }
            } else {
                editTagError.value = 'There must always be one tag, please add a tag before deleting one.'
            }
        }

        function submitChange(post, value, lowerNum, higherNum, component) {
            if (meetsLengthReqs(value, lowerNum, higherNum)) {
                component === 'title' ? post.changeTitle(value) : post.changeContent(value)
            } else {
                editError.value = 'New value does not meet requirements.'
            }
        }

        return {
            ownPosts,
            showPosts,
            user,
            deletePost,
            userPosts,
            editTitle,
            editContent,
            editTags,
            enableEdit,
            disableEdit,
            posts,
            deletedTag,
            deleteTag,
            editTagError,
            editTag,
            submitChange,
            editError
        }
    }
}
</script>

<style>

</style>