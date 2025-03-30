const randomTook = (length) => {
    if (length <= 0) return 0;
    return Math.ceil(Math.random() * length);
};

module.exports = randomTook;
