<template>
  <div class="home">
    <h1> Hello World </h1>
    {{$store.state.title}}
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
