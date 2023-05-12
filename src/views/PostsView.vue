<template>
  <div class="back">

    <div class="creator-controls" v-if="user.acctype === 'creator'">
      <button @click="toggleCreate">Create Post</button>
      <div v-show="create">
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
          <h5 style="color: red">{{tagError}}</h5>
        </div>
      </div>
    </div>
    
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
    const store = useStore()

    //computed
    const posts = computed(() => store.state.posts)
    const user = computed(() => store.state.signedIn)

    //refs
    const create = ref(false)
    const title = ref('')
    const content = ref('')
    const tag = ref('')
    const tags = ref([])
    const tagError = ref('')

    function toggleCreate() {
      create.value = !create.value
    }

    function publishPost(title, content, tagsArr) {
      if (hasLength(title) && hasLength(content) && hasLength(tagsArr)) {
        if (lessThan(title, 40) && moreThan(title, 5) && lessThan(content, 6000) && moreThan(content, 500) && lessThan(tagsArr, 3)) {
          store.commit('PUBLISH_POST', { title, content, tagsArr })
        }
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
      tagError
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