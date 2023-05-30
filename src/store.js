import { createStore } from 'vuex';
import { User, Creator, Admin, Post } from './accClass';

const store = createStore({
    state: {users: [{usern: 'Cavan', email: 'cav@hotmail.com', passw: 'cavan123', acctype: 'admin'},
                    {usern: 'Gary', email: 'gary@hotmail.com', passw: '12345678', acctype: 'user'},
                    {usern: 'Phil', email: 'phil@hotmail.com', passw: 'kangaroo123', acctype: 'creator'},
                    {usern: 'John', email: 'john@hotmail.com', passw: 'galapagosketchup1', acctype: 'admin'}],
            posts: [{title: 'Lorem ipsum', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Cavan', id: 1},
                    {title: 'Lorem ipsum1', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Phil', id: 2},
                    {title: 'Lorem ipsum2', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Phil', id: 3}],
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
        DELETE_USER(state, selectedUser) {
            if (state.signedIn.usern !== selectedUser) {
                const filteredUsers = state.users.filter((user) => user.usern !== selectedUser)
                if (filteredUsers.length === state.users.length) {
                    state.errorMsg = 'This user does not exist, please change this and try again.'
                } else {
                    state.users = filteredUsers
                    state.errorMsg = 'User deleted!'
                }
            } else if (state.signedIn.usern === selectedUser){
                state.errorMsg = 'You have entered your own username, please change this and try again.'
            } 
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
            const { title, content, tagsArr } = payload;
            const ID = state.posts.length + 1;
            const creator = state.users.filter((user) => user.usern === state.signedIn.usern)
            const post = new Post(title, content, tagsArr, creator[0].usern, ID)
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