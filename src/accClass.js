class User {
    constructor(usern, email, passw) {
        this.usern = usern;
        this.email = email;
        this.passw = passw;
        this.acctype = 'user';
    }

    changeUsern(newName){
        if(this.usern !== newName && newName.length > 0){
            return this.usern = newName;
        }
    }

    changeEmail(newEmail){
        if(this.email !== newEmail && newEmail.length > 0){
            return this.email = newEmail;
        } 
    }

    changePassw(newPassw){
        if(this.passw !== newPassw && newPassw.length > 0){
            return this.passw = newPassw;
        } 
    }
}

class Creator extends User {
    constructor(usern, email, passw){
        super(usern, email, passw)
        this.acctype = 'creator'
        this.posts = [];
    }

    addPost(post){
        if(!this.posts.includes(post) && post.length > 0){
            this.posts = this.posts.concat(post)
        }
    }

    deletePost(post){
        if(this.posts.includes(post) && post.length > 0){
            this.posts = this.posts.pop(post)
        }
    }
}

class Admin extends User {
    constructor(usern, email, passw){
        super(usern, email, passw)

        this.acctype = 'admin'
    }
}

export { User, Creator, Admin }