const { CloudstoreError } = require('./errors')

const errorHandler = (error, req, res, next) => {
    if (error instanceof CloudstoreError) {
        return res.status(error.status).json({
            status: 'error',
            message: error.message
        })
    }
    res.status(500).json({ status: 'error', message: error.message })

}

module.exports = {
    errorHandler
}