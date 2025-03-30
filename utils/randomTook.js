const randomTook = (length) => {
    if (length <= 0) return 0;
    return Math.floor(Math.random() * length);
};

module.exports = randomTook;
