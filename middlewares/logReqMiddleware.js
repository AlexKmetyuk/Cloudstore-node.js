const logReq = (req, _, next) => {
    console.log("Method: ", req.method, "\nBody: ", req.body, );
    next()
}

module.exports = {
    logReq
}