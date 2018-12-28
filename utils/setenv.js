module.exports = (varname, value) => {
    try {
        console.log("In here: ", varname, value)
        process.env.varname = value;
        console.log(process.env.varname)
    }catch(error) {
        return error;
    } 
}