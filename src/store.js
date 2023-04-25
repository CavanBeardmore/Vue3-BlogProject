import { createStore } from 'vuex';
import { User, Creator, Admin } from './accClass';

const store = createStore({
    state: {users: [{usern: 'Gary', email: 'gary@hotmail.com', passw: '12345678', acctype: 'user'},
                    {usern: 'Phil', email: 'phil@hotmail.com', passw: 'kangaroo123', acctype: 'creator'},
                    {usern: 'John', email: 'john@hotmail.com', passw: 'galapagosketchup1!', acctype: 'admin'}],
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
        }
    },
    mutations: {
        DELETE_USER(state, selectedUser) {
            if (state.activeUser.usern !== selectedUser) {
                const filteredUsers = state.users.filter((user) => user.usern !== selectedUser)
                if (filteredUsers.length === state.users.length) {
                    state.errorMsg = 'This user does not exist, please change this and try again.'
                } else {
                    state.users = filteredUsers
                    state.errorMsg = 'User deleted!'
                }
            } else if (state.activeUser.usern === selectedUser){
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
            console.log(username, email, password, role)
            if (role === 'user') {
                state.activeUser = new User(username, email, password)
                state.users = state.users.concat(state.activeUser)
            } else if (role === 'creator'){
                state.activeUser = new Creator(username, email, password)
                state.users = state.users.concat(state.activeUser)
            } else {
                state.activeUser = new Admin(username, email, password)
                state.users = state.users.concat(state.activeUser)
            }
        }
    },
    actions: {}
})

export default store;