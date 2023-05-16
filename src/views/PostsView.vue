<template>
  <div class="back">

    <!-- create post section -->
    <div class="creator-controls" v-if="user.acctype === 'creator'">
      <div v-show="!create">
        <button @click="toggleCreate">Create Post</button>
      </div>
      <div v-show="create">
        <button @click="toggleCreate">View Posts</button>
        <br>
        <br>
        <button @click="toggleRequirements"> View Requirements </button>
        <div v-show="requirements">
          <p> The title is 40 characters maximum and more than 5 characters minimum. </p>
          <p> The content section is 6000 characters maximum and 500 characters minimum. </p>
          <p> There must be a minimum of one tag and a maximum of 3 tags.</p>
        </div>
        <br>
        <br>
        <button @click="publishPost(title, content, tags)">Publish Post</button>
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
        <button @click="addTag">Add Tag</button>
        <div class="list-container" v-show="tags.length">
          <h5> Your Tags: </h5>
          <li v-for="tag in tags" :key="tag" class="tag-list">
            {{tag}}
          </li>
        </div>
        <h5 style="color: red">{{tagError}}</h5>
        <h5 style="color: green">{{postMessage}}</h5>
        <h5 style="color: red">{{postError}}</h5>
      </div>
    </div>

    <!-- search -->
    <div>
      <select name="search-criteria" id="search-criteria" v-model="criteria">
        <option value="Tag" selected>Tag</option>
        <option value="Title">Title</option>
        <option value="Creator">Creator</option>
      </select>
      <input type="text" placeholder="" v-model="searchInput">
      <br>
      <br>
      <button @click="searchFunc">Search</button>
      <br>
      <p style="color: red">{{searchError}}</p>
      <div v-for="post in filteredSearch" :key="post.id">
        <p>{{post.title}}</p>
        <p>{{post.content}}</p>
        <p>{{post.creator}}</p>
        <p>{{post.tags}}</p>
        <p>{{post.id}}</p>
      </div>
    </div>

    <!-- posts section -->
    <div class="post-back" v-show="!create">
      <div v-for="post in posts" :key="post.title" class="post-tile">
        <h3>{{post.title}}</h3>
        <h4> Created by {{post.creator}} </h4>
        <h4>{{post.content}}</h4>
        <h5> Tags: </h5>
        <div v-for="tag in post.tags" :key="tag"> 
          <h6>{{tag}}</h6>
        </div>
        <div v-if="user.acctype === 'admin'">
          <p>ID: {{post.id}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { hasLength, lessThan, doesExist, moreThan } from '../funcs';

export default {
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

    //error & message refs
    const tagError = ref('')
    const postError = ref('')
    const postMessage = ref('')
    const searchError = ref('')

    //array ref
    const tags = ref([])
    const filteredSearch = ref()

    //toggle funcs
    function toggleCreate() {
      create.value = !create.value
    }
    function toggleRequirements() {
      requirements.value = !requirements.value
    }

    function searchFunc() {
      if (criteria.value === 'Creator') {
        const creatorFiltered = posts.value.filter((post) => post.creator === searchInput.value)
        console.log(creatorFiltered.length)
        filteredSearch.value = creatorFiltered
        if (creatorFiltered.length === 0) {
        searchError.value = 'No results found'
        }
      } 
    }

    //publish post function takes the v-modeled refs as arguments and uses import funcs to check their lengths
    //if they pass then they
    function publishPost(title, content, tagsArr) {
      if (hasLength(title) && hasLength(content) && hasLength(tagsArr)) {
        if (lessThan(title, 40) && moreThan(title, 5) && lessThan(content, 6000) && moreThan(content, 500) && lessThan(tagsArr, 3)) {
          store.commit('PUBLISH_POST', { title, content, tagsArr })
          postMessage.value = 'Post has been published!'
          postError.value = ''
        }
      } else {
        postMessage.value = ''
        postError.value = 'Post does not meet requirements.'
        requirements.value = true
      }
    }

    function addTag() {
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
      searchError
    }
  }
}
</script>

<style>
  .post-tile {
    border-radius: 10px;
    background-color: aquamarine;
    width: 70%;
    margin: auto;
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