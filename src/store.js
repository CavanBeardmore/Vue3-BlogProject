import { createStore } from 'vuex';
import { User, Creator, Admin } from './accClass';

const store = createStore({
    state: {users: [{usern: 'Cavan', email: 'cav@hotmail.com', passw: 'cavan123', acctype: 'admin'},
                    {usern: 'Gary', email: 'gary@hotmail.com', passw: '12345678', acctype: 'user'},
                    {usern: 'Phil', email: 'phil@hotmail.com', passw: 'kangaroo123', acctype: 'creator'},
                    {usern: 'John', email: 'john@hotmail.com', passw: 'galapagosketchup1', acctype: 'admin'}],
            posts: [{title: 'Lorem ipsum', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Cavan', id: 1},
                    {title: 'Lorem ipsum1', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Phil', id: 2},
                    {title: 'Lorem ipsum2', content: 'Lorem ipsum dolor sit amet. Ex omnis asperiores qui quia ipsum qui maxime quibusdam! Ea rerum nihil qui fugiat maiores et vero blanditiis ad iure numquam eum distinctio quibusdam aut quia eius. Id error dolor quo enim iusto est dolore ipsam. At minus illo a quam molestias aut alias reprehenderit aut delectus vitae ab veritatis molestiae non atque officia id quidem impedit.', tags: ['Lorem', 'Ipsum'], creator: 'Phil', id: 3}],
            newUser: null,
            signedIn: null,
            activeUser: null,
            errorMsg: '',
            isLoggedIn: false
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
                state.newUser = new User(username, email, password)
                state.users = state.users.concat(state.newUser)
            } else if (role === 'creator'){
                state.newUser = new Creator(username, email, password)
                state.users = state.users.concat(state.newUser)
            } else {
                state.newUser = new Admin(username, email, password)
                state.users = state.users.concat(state.newUser)
            }
        },
        CHANGE_USER(state, payload){
            const { username, password } = payload;
            state.activeUser = {usern: username, passw: password}
        },
        EDIT(state, payload){
            const { value, newValue } = payload;
            if (value === 'usern') {
                const filteredUsers = state.users.filter((user) => user.usern === state.signedIn.usern);
                filteredUsers[0].usern = newValue;
                const user = state.signedIn
            } else if (value === 'passw') {
                const filteredUsers = state.users.filter((user) => user.passw === state.signedIn.passw);
                filteredUsers[0].passw = newValue;
                const user = state.signedIn
            } else {
                const filteredUsers = state.users.filter((user) => user.email === state.signedIn.email);
                filteredUsers[0].email = newValue;
                const user = state.signedIn
            }
        },
        NEW_SIGNIN(state, user){
            state.signedIn = user;
        },
        PUBLISH_POST(state, payload){
            const { title, content, tagsArr } = payload;
            const ID = state.posts.length + 1;
            state.posts = state.posts.concat({title: title, content: content, tags: tagsArr, creator: state.signedIn.usern, id: ID})
        },
        DELETE_POST(state, id){
            const index = state.posts.findIndex((post) => post.id === id)
            state.posts.splice(index, 1)
        }
    },
    actions: {}
})

export default store;