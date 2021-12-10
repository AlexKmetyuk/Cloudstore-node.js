class CloudstoreError extends Error {
    constructor(message) {
        super(message)
        this.status = 400
    }
}

class ValidationError extends CloudstoreError {
    constructor(message) {
        super(message)
        this.status = 400
    }
}

class WrongParametersError extends CloudstoreError {
    constructor(message) {
        super(message)
        this.status = 400
    }
}

class NotAuthorizedError extends CloudstoreError {
    constructor(message) {
        super(message)
        this.status = 401
    }
}

module.exports = {
    CloudstoreError,
    ValidationError,
    WrongParametersError,
    NotAuthorizedError
}