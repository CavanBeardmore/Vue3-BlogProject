<template>
    <div class="post" @dblclick="view(post.id)">
        <h3 class="post-title" @click="view(post.id)">{{post.title}}</h3>
        <div class="post-info">
            <h4 class="created-by"> Created by {{post.creator}} </h4>
            <h6 class="date"> {{post.date}} </h6>
            <div v-if="user.acctype === 'admin'">
                <h6 class="detail">Post ID: {{post.id}}</h6>
            </div>
        </div>
        <p class="detail">{{snippet}}</p>
        <div v-for="tag in post.tags" :key="tag" class="tag-list"> 
            <p class="tag">#{{tag}}</p>
        </div>
        

        <div v-show="user.usern === post.creator || user.acctype === 'admin'">
            <button @click="deletePost(post)" class="closer"> Delete </button>
            <br>
        </div>
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
    width: 300px;
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

.post-title:hover{
    transform: scale(1.015);
    border-style: solid;
    background-color: #becbd2;
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
