<template>
  <div class="back">

    <!-- create post section -->
    <div class="creator-controls" v-if="user.acctype === 'creator' || user.acctype === 'admin'">
      <div v-show="!create">
        <button @click="toggleCreate" class="viewer">Create Post</button>
        <br>
        <br>
      </div>
      <div v-show="create">
        <button @click="toggleCreate" class="viewer">View Posts</button>
        <br>
        <br>
        <button @click="toggleRequirements" class="viewer" v-show="!requirements"> View Requirements </button>
        <button @click="toggleRequirements" class="closer" v-show="requirements">Hide Requirements</button>
        <div v-show="requirements" class="detail-tile">
          <h3> Requirements: </h3>
          <p class="detail"> The title is 40 characters maximum and more than 5 characters minimum. </p>
          <p class="detail"> The content section is 6000 characters maximum and 500 characters minimum. </p>
          <p class="detail"> There is a minimum of 1 tag and a maximum of 3 tags.</p>
        </div>
        <br>
        <br>
        <button @click="publishPost(title, content, tags)" class="viewer">Publish Post</button>
        <br>
        <h4> Title </h4>
        <input type="text" v-model="title" class="input-title" placeholder="Why do cats hate Mondays?">
        <br>
        <h4> Content </h4>
        <textarea rows="4" cols="100" v-model="content" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
        <br>
        <h4> Content tags </h4>
        <input type="text" v-model="tag" class="cont-tags-input" placeholder="Enter a tag relevant to your post and click add tag.">
        <br>
        <br>
        <button @click="addTag" class="viewer">Add Tag</button>
        <br>
        <br>
        <input type="text" v-model="deletedTag" class="cont-tags-input" placeholder="Enter a tag you wish to delete.">
        <br>
        <br>
        <button @click="deleteTag" class="closer">Delete Tag</button>
        <div class="list-container" v-show="tags.length">
          <h5> Your Tags: </h5>
          <li v-for="tag in tags" :key="tag" class="tag-list">
            {{tag}}
          </li>
        </div>
        <h5 class="detail" style="color: red" v-show="tagError">{{tagError}}</h5>
        <h5 class="detail" style="color: green" v-show="postMessage">{{postMessage}}</h5>
        <h5 class="detail" style="color: red" v-show="postError">{{postError}}</h5>
      </div>
    </div>

    <!-- search -->
    <div v-show="!create">
      <select name="search-criteria" id="search-criteria" v-model="criteria">
        <option value="Tag" selected>Tag</option>
        <option value="Title">Title</option>
        <option value="Creator">Creator</option>
      </select>
      <input type="text" placeholder="" v-model="searchInput">
      <br>
      <br>
      <button @click="searchFunc" class="viewer">Search</button>
      <br>
      <h5 class="detail" style="color: red" v-show="searchError">{{searchError}}</h5>
      <div v-for="post in filteredSearch" :key="post.id" class="detail-tile">
        <p class="detail" >{{post.title}}</p>
        <p class="detail">{{post.content}}</p>
        <p class="detail">{{post.creator}}</p>
        <p class="detail">{{post.tags}}</p>
        <p class="detail">{{post.id}}</p>
      </div>
    </div>

    <!-- posts section -->
    <div class="post-back" v-show="!create">
      <div v-if="posts.length">
        <div v-for="post in posts" :key="post.title" class="post-tile">
          <SinglePost :post="post" />
        </div>
      </div>
      <div v-else>
        <h5 class="detail"> There are no posts here. </h5>
      </div>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
import { hasLength, lessThan, doesExist, moreThan } from '../helperFuncs';
import SinglePost from '../components/SinglePost.vue';
import { validTag } from '../regex'

export default {
  components: { SinglePost },
  setup() {
    //use 
    const store = useStore()

    //computed
    const posts = computed(() => store.state.posts)
    const user = computed(() => store.state.signedIn)

    //boolean refs
    const create = ref(false)
    const requirements = ref(false)

    //input refs
    const title = ref('')
    const content = ref('')
    const tag = ref('')
    const searchInput = ref('')
    const criteria = ref('Tag')
    const deletedTag = ref('')

    //error & message refs
    const tagError = ref('')
    const postError = ref('')
    const postMessage = ref('')
    const searchError = ref('')

    //other refs
    const tags = ref([])
    const filteredSearch = ref()

    //toggle funcs
    function toggleCreate() {
      create.value = !create.value
    }
    function toggleRequirements() {
      requirements.value = !requirements.value
    }

    /* search function, checks the value of criteria (selected in the drop down), and then runs code dependant on this and assigns the filteredSearch variable
    with the value of the search or displays the error code */
    function searchFunc() {
      if (criteria.value === 'Creator') {
          const creatorFiltered = posts.value.filter((post) => post.creator === searchInput.value)
          filteredSearch.value = creatorFiltered
          searchError.value = ''
          if (!creatorFiltered.length) {
          searchError.value = 'No results found'
        }
      } else if (criteria.value === 'Tag') {
          const tagFiltered = posts.value.filter((post) => post.tags.includes(searchInput.value))
          filteredSearch.value = tagFiltered
          searchError.value = ''
          if (!tagFiltered.length) {
          searchError.value = 'No results found'
        }
      } else if (criteria.value === 'Title') {
        const titleFiltered = posts.value.filter((post) => post.title.split(' ').includes(searchInput.value))
        filteredSearch.value = titleFiltered
        searchError.value = ''
        if (!titleFiltered.length) {
          searchError.value = 'No results found'
        }
      }
    }

    /*publish post function takes the v-modeled refs as arguments and uses import funcs to check their lengths
    if they pass then they */
    function publishPost(titleInput, contentInput, tagsArr) {
      if (lessThan(titleInput, 40) && moreThan(titleInput, 5) && lessThan(contentInput, 6000) && moreThan(contentInput, 500) && lessThan(tagsArr, 3) && moreThan(tagsArr, 1)) {
        store.commit('PUBLISH_POST', { titleInput, contentInput, tagsArr })
        postMessage.value = 'Post has been published!'
        postError.value = ''
        title.value = ''
        content.value = ''
        tags.value = ''
      } else {
        postMessage.value = ''
        postError.value = 'Post does not meet requirements.'
        requirements.value = true
    }

    }

    //function that checks if the tag exists, runs code if doesnt, error code if does then checks its length to ensure there is no more than 3
    function addTag() {
      if (validTag(tag.value)) {
        if (!doesExist(tag.value, tags.value)) {
          if (tags.value.length < 3) {
            tags.value = tags.value.concat(tag.value)
            tag.value = ''
            tagError.value = ''
          } else {
            tagError.value = 'You can only have up to 3 tags.'
        }
        } else {
          tagError.value = 'This tag already exists.'
        }
      } else {
        tagError.value = 'Tag must not be empty, must compromise of only letters, and be a minimum of 3 characters long.'
      }
    }

    function deleteTag() {
      if (tags.value.includes(deletedTag.value)) {
          const index = tags.value.indexOf(deletedTag.value)
          tags.value.splice(index, 1)
          deletedTag.value = ''
        }
    }

    return {
      posts,
      user,
      toggleCreate,
      title,
      content,
      create,
      publishPost,
      tag,
      tags,
      addTag,
      tagError,
      requirements,
      toggleRequirements,
      postError,
      postMessage,
      searchInput,
      criteria,
      searchFunc,
      filteredSearch,
      searchError,
      deleteTag,
      deletedTag
  }
}
}
</script>

<style>
  .post-tile {
    border-radius: 10px;
    background-color: #c9d4da;
    width: 70%;
    margin: auto;
    border-style: ridge;
    padding: 10px;
  }

  .post-tile:hover{
    border-style: solid;
    background-color: #becbd2;
  }

  .post-tile:hover .title{
    text-decoration: underline;
  }

  .back{
    background-color: #f4f6f7;
  }

  .input-title{
    width: 400px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .cont-tags-input {
    width: 400px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .list-container {
    width: 30%;
    margin: auto;
    text-align: left;
  }
</style>