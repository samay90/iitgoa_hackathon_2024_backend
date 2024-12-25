const getDate = (d = new Date()) => {
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${year}-${month}-${day}`
}
module.exports = getDate