let arr = [1,2,3,4,5,6]

console.log(
    arr.reduce((acc, el) => (acc + (el%2 == 0) ? acc + el : 0), 0)
)