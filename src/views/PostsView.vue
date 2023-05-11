<template>
  <div class="back">
    <header> 
      <h2> Blog Posts </h2>
    </header>
    <div class="post-back">
      <div v-for="post in posts" :key="post.title" class="post-tile">
        <h3>{{post.title}}</h3>
        <p>{{post.content}}</p>
        <div v-if="user.acctype === 'admin'">
          <p>POST ID: {{post.id}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

export default {
  setup() {
    const store = useStore()

    const posts = computed(() => store.state.posts)

    const user = computed(() => store.state.signedIn)

    return {
      posts,
      user
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
</style>