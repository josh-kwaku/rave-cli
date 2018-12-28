module.exports = () => {
    const colors = ["black", "red", "yellow", "blue", "magenta", "cyan", "white", "gray"];
    let randomNumber = Math.floor(Math.random() * (colors.length - 1) + 1);
    return colors[randomNumber];
}