<template>
    <div class="post" @dblclick="view(post.id)">
        <h3 class="post-title" @click="view(post.id)">{{post.title}}</h3>
        <div class="post-info">
            <h4 class="created-by"> Created by {{post.creator}} </h4>
            <h6 class="date"> {{post.date}} </h6>
        </div>
        <h4 class="detail">{{snippet}}</h4>
        <div class="tag-list"> 
            <p class="tag">#{{post.tags[0]}}</p>
            <p class="tag">#{{post.tags[1]}}</p>
            <p class="tag">#{{post.tags[2]}}</p>
        </div>
        
        <div v-if="user.acctype === 'admin'">
        <p class="detail">ID: {{post.id}}</p>
        </div>
    </div>
    <div v-show="user.usern === post.creator || user.acctype === 'admin'">
        <button @click="deletePost(post)" class="closer"> Delete </button>
        <br>
    </div>
    <br>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    props: ['post'],
    setup(props) {
        //useStore
        const store = useStore()
        const router = useRouter()
        
        //computed
        const user = computed(() => store.state.signedIn)
        const snippet = computed(() => {
            return props.post.content.substring(0, 400) + '...'
            })

        //funcs
        function deletePost(post) {
            store.commit('DELETE_POST', post)
        }

        function view(post) {
            router.push({ name: 'SinglePostView', params: { id: post } })
        }

        return {
            user,
            snippet,
            deletePost,
            view
        }
    }
}
</script>

<style>
  .post{
    border-radius: 10px;
    background-color: #c9d4da;
    width: 70%;
    margin: 20px auto;
    border-style: ridge;
    padding: 10px;
  }

  .post:hover{
    border-style: solid;
    background-color: #becbd2;
  }

  .post:hover{
    transform: scale(1.015);
  }

.post-title {
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding: 8px;
    border-style: groove;
    }

.post-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}

.created-by {
    flex-basis: 40%;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding: 8px;
    border-style: groove;
}

.date {
    flex-basis: 20%;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding-top: 9px;
    font-size: small;
    border-style: groove;
}

.tag-list{
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}

.tag {
    flex-grow: 0;
    flex-shrink: 0;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    margin: 10px auto;
    padding: 5px;
    font-size: small;
    border-style: groove;
}

</style>