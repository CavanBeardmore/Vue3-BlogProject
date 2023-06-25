<template>
<!-- can only see this page if you're an admin or creator as user cannot create posts -->
  <div v-if="signedIn.acctype === 'admin' || signedIn.acctype === 'creator'">
    <br v-show="!ownPosts">
    <!-- shows either close or view buttons depending on if ownposts is true or false -->
    <button @click="showPosts" v-show="!ownPosts" class="viewer">View my posts</button>
    <div v-show="ownPosts">
        <br>
        <button @click="showPosts" class="closer">Close my posts </button>

        <div v-if="posts.length">
            <!-- if there is posts it will show the details for each post -->
            <div v-for="post in posts" :key="post.id">
                <div v-show="!post.edit" class="post-detail-tile">
                    <!-- if edit is false for this post it shows the post details -->
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
                    <div v-if="signedIn.acctype === 'admin'">
                        <p class="detail"> Post ID:{{post.id}}</p>
                    </div>
                    <!-- button options to delete, and edit the post -->
                    <button @click="deletePost(post)" class="closer">Delete</button>
                    <br>
                    <br>
                    <button @click="enableEdit(post)" v-show="!post.edit" class="viewer">Edit</button>
                </div>
                <div v-show="post.edit" class="post-detail-tile">
                    <!-- if edit is true for this post it shows the edit method and a toggle button to turn edit off -->
                    <button @click="disableEdit(post)" v-show="post.edit" class="closer">Close Edit</button>
                    <h4> Title </h4>
                    <!-- post info is shown in the input fields so this can be changed easily -->
                    <input type="text" v-model="editTitle" class="input-title" placeholder="Why do cats hate Mondays?">
                    <!-- submit change function -->
                    <button @click="submitChange(post, editTitle, 5, 40, 'title')" class="viewer">Submit changes</button>
                    <br>
                    <h4> Content </h4>
                    <textarea rows="30" cols="65" v-model="editContent" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
                    <button @click="submitChange(post, editContent, 500, 6000, 'content')" class="viewer">Submit changes</button>
                    <br>
                    <!-- edit messages and errors -->
                    <h5 class="detail" style="color: red" v-show="editError"> {{editError}} </h5>
                    <h5 class="detail" style="color: green" v-show="editMessage"> {{editMessage}} </h5>
                    <h5 style=" color: red " class="detail" v-show="editTagError">{{editTagError}} </h5>
                    <h4> Content tags </h4>
                    <!-- method for adding tags -->
                    <input type="text" v-model="editTag" class="cont-tags-input" placeholder="Enter a tag relevant to your post and click add tag.">
                    <br>
                    <br>
                    <button class="viewer" @click="addTag(post)">Add Tag</button>
                    <br>
                    <br>
                    <!-- method for deleting tags -->
                    <input type="text" v-model="deletedTag" class="cont-tags-input" placeholder="Enter a tag you wish to delete.">
                    <br>
                    <br>
                    <button @click="deleteTag(post)" class="closer">Delete Tag</button>
                    <div class="detail" v-show="editTags.length">
                        <!-- shows the tags within the tag array -->
                        <h5> Your Tags: </h5>
                        <p v-for="tag in editTags" :key="tag">
                            #{{tag}}
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
        <div v-else>
            <!-- if there is no posts it displays this message -->
            <h5 class="detail"> You have no posts. </h5>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { meetsLengthReqs, doesExist } from '../helperFuncs'
import { validTag } from '../regex'

export default {
    setup(){
        //use store
        const store = useStore()

        //computed 
        const signedIn = computed(() => store.getters.getSignedIn)
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
        
        //enables edit and enters post details into input fields
        function enableEdit(post) {
            post.toggleEditPost()
            editing.value = true
            editTitle.value = post.title
            editContent.value = post.content
            editTags.value = post.tags
        }

        //disables edit and clears input fields
        function disableEdit(post) {
            post.toggleEditPost()
            editing.value = false
            editTitle.value = ''
            editContent.value = ''
            editTags.value = ''
        }

        //delete function submits the mutation that deletes the post, and then updates the userPosts ref
        function deletePost(post) {
            //uses delete post mutation first
            store.commit('DELETE_POST', post)
            //updates the user posts array now this has been changed
            const postsArray = posts.value.filter((post) => post.creator === signedIn.value.usern)
            userPosts.value = postsArray
        }

        function deleteTag(post) {
            //ensures there is at least one tag
            if (editTags.value.length != 1) {
                //if the tags array includes the tag entered to be deleted it executes
                if (editTags.value.includes(deletedTag.value)) {
                //finds the tags index within the tag array
                const index = editTags.value.indexOf(deletedTag.value)
                //then removes it using the index
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
            //ensures tag is valid
            if (validTag(editTag.value)) {
                //ensures tag doesnt already exist within the tag array
                if (!doesExist(editTag.value, editTags.value)) {
                    //ensures there is less than 3 tags within the tag array
                if (editTags.value.length < 3) {
                    //adds tag to the posts tags array
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
            //ensures the title or content meets length requirements
            if (meetsLengthReqs(value, lowerNum, higherNum)) {
                //then if the change is made to title it runs the title change obj method, if not then the content change obj method
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
            signedIn,
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