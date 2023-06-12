<template>
  <div v-if="user.acctype === 'admin' || user.acctype === 'creator'">
    <br v-show="!ownPosts">
    <button @click="showPosts" v-show="!ownPosts" class="viewer">View my posts</button>
    <div v-show="ownPosts">
        <br>
        <button @click="showPosts" class="closer">Close my posts </button>

        <div v-if="posts.length">
            <div v-for="post in posts" :key="post.id">
                <div v-show="!post.edit" class="post-detail-tile">
                    <h2 class="detail">{{post.title}}</h2>
                    <h4 class="detail">Created by {{post.creator}}</h4>
                    <p class="detail">{{post.content}}</p>
                    <div class="detail">
                        <h4> Tags: </h4>
                        <div v-for="tag in post.tags" :key="tag" class="tags">
                            <h6> #{{tag}} </h6>
                        </div>
                    </div>
                    <h6 class="detail"> {{post.date}} </h6>
                    <div v-if="user.acctype === 'admin'">
                        <p class="detail"> Post ID:{{post.id}}</p>
                    </div>
                    <button @click="deletePost(post)" class="closer">Delete</button>
                    <br>
                    <br>
                    <button @click="enableEdit(post)" v-show="!post.edit" class="viewer">Edit</button>
                </div>
                <div v-show="post.edit" class="post-detail-tile">
                    <button @click="disableEdit(post)" v-show="post.edit" class="closer">Close Edit</button>
                    <h4> Title </h4>
                    <input type="text" v-model="editTitle" class="input-title" placeholder="Why do cats hate Mondays?">
                    <button @click="submitChange(post, editTitle, 5, 40, 'title')" class="viewer">Submit changes</button>
                    <br>
                    <h4> Content </h4>
                    <textarea rows="30" cols="65" v-model="editContent" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
                    <button @click="submitChange(post, editContent, 500, 6000, 'content')" class="viewer">Submit changes</button>
                    <br>
                    <h5 class="detail" style="color: red" v-show="editError"> {{editError}} </h5>
                    <h5 class="detail" style="color: green" v-show="editMessage"> {{editMessage}} </h5>
                    <h5 style=" color: red " class="detail" v-show="editTagError">{{editTagError}} </h5>
                    <h4> Content tags </h4>
                    <input type="text" v-model="editTag" class="cont-tags-input" placeholder="Enter a tag relevant to your post and click add tag.">
                    <br>
                    <br>
                    <button class="viewer" @click="addTag(post)">Add Tag</button>
                    <br>
                    <br>
                    <input type="text" v-model="deletedTag" class="cont-tags-input" placeholder="Enter a tag you wish to delete.">
                    <br>
                    <br>
                    <button @click="deleteTag(post)" class="closer">Delete Tag</button>
                    <div class="detail" v-show="editTags.length">
                        <h5> Your Tags: </h5>
                        <p v-for="tag in editTags" :key="tag">
                            #{{tag}}
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
        <div v-else>
            <h5 class="detail"> You have no posts. </h5>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUpdated, ref } from 'vue'
import { useStore } from 'vuex'
import { meetsLengthReqs, doesExist } from '../helperFuncs'
import { validTag } from '../regex'

export default {
    setup(){
        //use store
        const store = useStore()

        //computed 
        const user = computed(() => store.state.signedIn)
        const posts = computed(() => store.state.signedIn.posts)

        //boolean refs
        const ownPosts = ref(false)
        const editing = ref(false)

        //string refs
        const userPosts = ref('')
        const editTitle = ref('')
        const editContent = ref('')
        const editTags = ref('')
        const deletedTag = ref('')
        const editTagError = ref('')
        const editError = ref('')
        const editTag = ref('')
        const editMessage = ref('')

        //toggle func
        function showPosts() {
            ownPosts.value = !ownPosts.value
        }

        function enableEdit(post) {
            post.toggleEditPost()
            editing.value = true
            editTitle.value = post.title
            editContent.value = post.content
            editTags.value = post.tags
        }

        function disableEdit(post) {
            post.toggleEditPost()
            editing.value = false
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
                editMessage.value = 'Changes successful.'
                } else {
                    editTagError.value = 'Tag does not exist'
                    editMessage.value = ''
                }
            } else {
                editTagError.value = 'There must always be one tag, please add a tag before deleting one.'
                editMessage.value = ''
            }
        }

        function addTag(post) {
            if (validTag(editTag.value)) {
                if (!doesExist(editTag.value, editTags.value)) {
                if (editTags.value.length < 3) {
                    console.log(editTag.value, post.tags)
                    post.tags.push(editTag.value)
                    editTag.value = ''
                    editTagError.value = ''
                    editMessage.value = 'Changes successful.'
                } else {
                    editTagError.value = 'You can only have up to 3 tags.'
                    editMessage.value = ''
                }
                } else {
                editTagError.value = 'This tag already exists.'
                editMessage.value = ''
                }
            } else {
                editTagError.value = 'Tag must not be empty, must compromise of only letters, and be a minimum of 3 characters long.'
                editMessage.value = ''
            }
        }

        function submitChange(post, value, lowerNum, higherNum, component) {
            if (meetsLengthReqs(value, lowerNum, higherNum)) {
                component === 'title' ? post.changeTitle(value) : post.changeContent(value)
                editError.value = ''
                editMessage.value = 'Changes successful.'
            } else {
                editError.value = 'New value does not meet requirements.'
                editMessage.value = ''
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
            editError,
            editing,
            addTag,
            editMessage
        }
    }
}
</script>

<style>
.post-detail-tile {
  background-color: lightgray;
  border-radius: 5px;
  border-style: groove;
  width: 500px;
  margin: 15px auto;
  padding: 15px;
}
</style>