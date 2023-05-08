function doesUserExist(username, usersArray) {
    const lowerCaseUsername = username.toLowerCase()
    const usernames = usersArray.map((user) => user.usern.toLowerCase())
    const filteredUsernames = usernames.filter((user) => lowerCaseUsername === user)
    console.log(lowerCaseUsername, filteredUsernames)
    if (filteredUsernames.length) {
        return true
    }
    else {
        return false
    }
}

export { doesUserExist }