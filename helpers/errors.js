class CloudstoreError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends CloudstoreError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class WrongParametersError extends CloudstoreError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = {
  CloudstoreError,
  ValidationError,
  WrongParametersError,
};
