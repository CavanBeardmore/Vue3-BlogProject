export function validData(data, ...funcs) {
    console.log(data, funcs)
    const resultArr = funcs.map((func) => func(data) );;
    
    const result = resultArr.includes('false')
    if (result === true) {
        return false
    }
}


