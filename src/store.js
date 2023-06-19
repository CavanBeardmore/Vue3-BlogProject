import { createStore } from 'vuex';
import { User, Creator, Admin, Post } from './accClass';

const store = createStore({
    state: {users: [],
            posts: [],
            signedIn: null,
            activeUser: null,
            errorMsg: '',
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
        getActiveUser(state){
            return state.activeUser;
        },
        getAccount(state){
            const user = state.users.filter((user) => user.usern === state.activeUser.usern);
            return user[0];
        }
    },
    mutations: {
        DELETE_USER(state, filteredUsers) {
            state.users = filteredUsers
        },
        LOG_IN(state) {
            state.isLoggedIn = true;
        },
        LOG_OUT(state) {
            state.isLoggedIn = false;
        },
        CREATE_ACC(state, payload){
            const { username, email, password, role } = payload;
            if (role === 'user') {
                state.users.push(new User(username, email, password))
            } else if (role === 'creator'){
                state.users.push(new Creator(username, email, password))
            } else {
                state.users.push(new Admin(username, email, password))
            }
        },
        CHANGE_USER(state, payload){
            const { username, password } = payload;
            state.activeUser = {usern: username, passw: password}
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