export const formatMoney = (money: number) => {
    const thousands = ','
    const integerArr = money.toString().split('')
    let index = integerArr.length
    while ((index -= 3) > 0) {
        integerArr.splice(index, 0, thousands)
    }
    return integerArr.join('')
}
