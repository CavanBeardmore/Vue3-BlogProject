import { createStore } from 'vuex';
import { User, Creator, Admin } from './accClass';

const store = createStore({
    state: {users: [{usern: 'Gary', email: 'gary@hotmail.com', passw: '12345678', acctype: 'user'},
                    {usern: 'Phil', email: 'phil@hotmail.com', passw: 'kangaroo123', acctype: 'creator'},
                    {usern: 'John', email: 'john@hotmail.com', passw: 'galapagosketchup1!', acctype: 'admin'}],
            newUser: null,
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
            if (state.newUser.usern !== selectedUser) {
                const filteredUsers = state.users.filter((user) => user.usern !== selectedUser)
                if (filteredUsers.length === state.users.length) {
                    state.errorMsg = 'This user does not exist, please change this and try again.'
                } else {
                    state.users = filteredUsers
                    state.errorMsg = 'User deleted!'
                }
            } else if (state.newUser.usern === selectedUser){
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
        }
    },
    actions: {}
})

export default store;