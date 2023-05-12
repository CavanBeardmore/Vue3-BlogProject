function doesUserExist(username, usersArray) {
    const lowerCaseUsername = username.toLowerCase()
    const usernames = usersArray.map((user) => user.usern.toLowerCase())
    const filteredUsernames = usernames.filter((user) => lowerCaseUsername === user)
    if (filteredUsernames.length) {
        return true
    }
    else {
        return false
    }
}

function hasLength(value) {
    if (value.length) {
        return true
    } else {
        return false
    }
}

function lessThan(value, num) {
    if (value.length <= num) {
        return true 
    } else {
        return false
    }
}

function moreThan(value, num) {
    if (value.length >= num) {
        return true 
    } else {
        return false
    }
}

function doesExist(value, arrayOfValues) {
    const lowerCaseValue = value.toLowerCase()
    const lowerCaseArray = arrayOfValues.map((v) => v.toLowerCase())
    const filteredValues = lowerCaseArray.filter((v) => lowerCaseValue === v)
    if (filteredValues.length) {
        return true
    }
    else {
        return false
    }
}


export { doesUserExist, hasLength, lessThan, doesExist, moreThan }