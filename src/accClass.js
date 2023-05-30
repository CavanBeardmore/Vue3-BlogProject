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
       this.posts.push(post)
    }

    deletePost(post){
        const index = this.posts.findIndex((value) => value.id === post.id)
        this.posts.splice(index, 1)
    }
}

class Admin extends Creator {
    constructor(usern, email, passw){
        super(usern, email, passw)

        this.acctype = 'admin'
    }
}

class Post{
    constructor(title, content, tags, creator, id) {
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.creator = creator;
        this.id = id
    }
}

export { User, Creator, Admin, Post }

