import { createStore } from 'vuex';
import { User, Creator, Admin, Post } from './accClass';

const store = createStore({
    state: {users: [],
            posts: [],
            signedIn: null,
            isLoggedIn: false,
            viewedPost: null
            },
    getters: {
        totalUsers(state) {
            return state.users.length;
        },
        isLoggedIn(state) {
            return state.isLoggedIn;
        },
        getSignedIn(state) {
            return state.signedIn
        }
    },
    mutations: {
        DELETE_USER(state, payload) {
            const { filteredUsers, userToBeDeleted } = payload
            state.users = filteredUsers
            const posts = state.posts.filter((post) => post.creator !== userToBeDeleted)
            state.posts = posts
        },
        DELETE_SELF(state, userToBeDeleted){
            const index = state.users.findIndex((value) => value.usern === userToBeDeleted.usern)
            state.users.splice(index, 1)
            const posts = state.posts.filter((post) => post.creator !== userToBeDeleted)
            state.posts = posts
        },
        LOG_IN(state) {
            state.isLoggedIn = true;
        },
        LOG_OUT(state) {
            state.isLoggedIn = false;
        },
        CREATE_ACC(state, payload){
            const { usernameInput, emailInput, passwordInput, role } = payload;
            if (role === 'user') {
                state.users.push(new User(usernameInput, emailInput, passwordInput))
            } else if (role === 'creator'){
                state.users.push(new Creator(usernameInput, emailInput, passwordInput))
            } else {
                state.users.push(new Admin(usernameInput, emailInput, passwordInput))
            }
        },
        EDIT(state, payload){
            const { value, newValue } = payload;
            if (value === 'usern') {
                const oldUsername = state.signedIn.usern
                const filteredUsers = state.users.filter((user) => user.usern === state.signedIn.usern);
                filteredUsers[0].changeUsern(newValue)
                const modifiedPosts = state.posts.map((post) => {
                    if (post.creator === oldUsername) {
                      return {
                        ...post,
                        creator: newValue
                      };
                    }
                    return post;
                  });
                state.posts = modifiedPosts
            } else if (value === 'passw') {
                const filteredUsers = state.users.filter((user) => user.passw === state.signedIn.passw);
                filteredUsers[0].changePassw(newValue);
            } else {
                const filteredUsers = state.users.filter((user) => user.email === state.signedIn.email);
                filteredUsers[0].changeEmail(newValue);
            }
        },
        NEW_SIGNIN(state, user){
            state.signedIn = user;
        },
        PUBLISH_POST(state, payload){
            const { titleInput, contentInput, tagsArr } = payload;
            const ID = state.posts.length + 1;
            const creator = state.users.filter((user) => user.usern === state.signedIn.usern)
            const fullDate = new Date()
            const y = fullDate.getFullYear()
            const m = fullDate.getMonth()
            const d = fullDate.getDate()
            const date = d + '/' + m + '/' + y
            const post = new Post(titleInput, contentInput, tagsArr, creator[0].usern, ID, date)
            creator[0].addPost(post)
            state.posts.push(post)
        },
        DELETE_POST(state, post){
            const index = state.posts.findIndex((value) => value.id === post.id)
            state.posts.splice(index, 1)
            const user = state.users.filter((val) => val.usern === post.creator)
            user[0].deletePost(post)
        }
    },
    actions: {}
})

export default store;