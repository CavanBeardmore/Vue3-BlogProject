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
  <div class="home">
    <h1> Blog Project! </h1>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

export default {
  setup() {
    const store = useStore()


    
  }
}
</script>
