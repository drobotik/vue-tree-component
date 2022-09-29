export const createID = (items) => {
    let number = 0
    const maxId = ({identifier, children = []}) => {
        return Math.max (identifier, ...children.map(maxId))
    }
    for (let n = items.length - 1; n >= 0; n--) {
        let max = maxId(items[n])
        if(max > number)
            number = max
    }
    return number + 1
}