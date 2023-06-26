<template>
  <nav>
    <div class="router">
      <router-link to="/home">Home</router-link> 
    </div>
    <div class="router">  
      <router-link to="/about">About</router-link> 
    </div>
    <div class="router">
      <router-link to="/posts">Posts</router-link> 
    </div>
    <div class="router">
      <router-link to="/account">Account</router-link>
    </div>
  </nav>
  <div class="posts-container">

    <!-- create post section -->
    <div class="create" v-if="signedIn.acctype === 'creator' || signedIn.acctype === 'admin'">
      <div v-show="!create">
        <button @click="toggleCreate" class="viewer">Create Post</button>
      </div>
      <div v-show="create">
        <div class="button-container">
          <button @click="closeCreate" class="button-close">Close</button>
          <button @click="toggleExpand" v-show="!expand" class="button">Expand Posts</button>
          <button @click="toggleRequirements" class="button" v-show="!requirements"> View Requirements </button>
          <button @click="toggleRequirements" class="button-close" v-show="requirements">Hide Requirements</button>
        </div>
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
        <textarea rows="15" cols="100" v-model="content" placeholder="Garfields influence upon the feline population cannot be underestimated."></textarea>
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
        <button @click="deleteTag()" class="closer">Delete Tag</button>
        <div v-show="tags.length">
          <h5> Your Tags: </h5>
          <div v-for="tag in tags" :key="tag">
            <h6> #{{tag}} </h6>
          </div>
        </div>
        <h5 class="detail" style="color: red" v-show="tagError">{{tagError}}</h5>
        <h5 class="detail" style="color: green" v-show="postMessage">{{postMessage}}</h5>
        <h5 class="detail" style="color: red" v-show="postError">{{postError}}</h5>
      </div>
    </div>

    <!-- search -->
    <div v-show="!expand" class="search">
      <select name="search-criteria" id="search-criteria" v-model="criteria">
        <option class="option" value="Tag" selected>Tag</option>
        <option class="option" value="Title">Title</option>
        <option class="option" value="Creator">Creator</option>
      </select>
      <input type="text" placeholder="" v-model="searchInput">
      <br>
      <br>
      <button @click="searchFunc" class="viewer">Search</button>
      <br>
      <br>
      <button @click="clearSearch" class="closer">Clear</button>
      <h5 class="detail" style="color: red" v-show="searchError">{{searchError}}</h5>
      <div v-for="post in filteredSearch" :key="post.id">
        <SinglePost :post="post" />
      </div>
    </div>

    <!-- posts section -->
    <div class="posts" v-show="!expand">
      <div v-if="posts.length">
        <h3>Posts:</h3>
        <div v-for="post in posts" :key="post.title">
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
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue';
import { hasLength, lessThan, doesExist, moreThan } from '../helperFuncs';
import SinglePost from '../components/SinglePost.vue';
import { validTag } from '../regex'

export default {
  components: { SinglePost },
  setup() {
    //use 
    const store = useStore()
    const router = useRouter()

    //computed
    const posts = computed(() => store.state.posts)
    const signedIn = computed(() => store.getters.getSignedIn)

    //boolean refs
    const create = ref(false)
    const requirements = ref(false)
    const expand = ref(false)

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
    function toggleExpand() {
      expand.value = !expand.value
    }
    function closeCreate() {
      expand.value = false
      create.value = false
      tagError.value = ''
      postMessage.value = ''
      postError.value = ''
      requirements.value = ''
    }

    //provides a snippet of post content to save space
    function snippet(post) {
        return post.content.substring(0, 400) + '...'
    }

    //redirects to a full post view page
    function view(post) {
        router.push({ name: 'SinglePostView', params: { id: post } })
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

    function clearSearch() {
      filteredSearch.value = ''
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
        tagError.value= ''
        tags.value = []
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
        } else {
          tagError.value = 'Tag does not exist.'
        }
    }

    return {
      posts,
      signedIn,
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
      deletedTag,
      snippet,
      view,
      expand,
      toggleExpand,
      closeCreate,
      clearSearch
  }
}
}
</script>

<style>

  .posts-container{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .posts {
    margin-top: .5em;
    flex-basis: 30%;
    flex-grow: 0;
    flex-shrink: 0;
    background: #B7EEF8;
    border-style: ridge;
  }

  .search {
    margin-top: .5em;
    padding-top: 10px;
    padding-bottom: 10px;
    flex-basis: 30%;
    flex-grow: 0;
    flex-shrink: 0;
    background: #B7EEF8;
    border-style: ridge;
  }

  .create {
    margin-top: .5em;
    padding-top: 10px;
    flex-basis: 30%;
    flex-grow: 0;
    flex-shrink: 0;
    background: #B7EEF8;
    border-style: ridge;
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

  .button-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .button {
    padding-top: 10px;
    padding-bottom: 10px;
    flex-basis: 30%;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    margin-top: 10px;
    border-radius: 5px;
    border-style: groove;
    width: fit-content; 
  }

  .button-close {
    padding-top: 10px;
    padding-bottom: 10px;
    flex-basis: 30%;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    margin-top: 10px;
    border-radius: 5px;
    border-style: groove;
    width: fit-content; 
  }

  .button:hover {
  color: #ECF3F1;
  background-color: #1EA086;
}

.button-close:hover {
  color: #ECF3F1;
  background-color: #C6190E;
}

select {
  padding: 4px;
  border-radius: 5px;
}

textarea{
  resize: vertical;
}
</style>