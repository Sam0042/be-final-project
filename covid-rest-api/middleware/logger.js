const logger = (req,res,next) => {
    console.log("LOGGER MIDDLEWARE");

    next()
}

export default logger;