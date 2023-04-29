function matches(string) { 
    const regex = /^\w{5,}/gi;

    const test = string.match(regex);

    if (test) {
        const joined = test.join('');
        if ( string === joined ) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function validEmail(string) {
    const regex = /^\w+(.)\w+(@)[a-z]+(.)[a-z]{2,}(.)[a-z]{2,}$/gi;

    const test = string.match(regex);

    if (test) {
        const joined = test.join('');
        if ( string === joined ) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export { matches, validEmail}