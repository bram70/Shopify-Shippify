class ServerResponse {
  constructor(status, code, payload = {}) {
    this.status = status
    this.code = code
    this.payload = payload
  }

  respond(response) {
    return response.status(this.status).json({
      code: this.code,
      payload: this.payload
    })
  }
}

ServerResponse.success = function (data) {
  return new ServerResponse(200, 'OK', { data })
}

ServerResponse.noContent = function () {
  return new ServerResponse(204, 'OK')
}

ServerResponse.unauthenticated = function () {
  return new ServerResponse(401, 'AU')
}

ServerResponse.unknownError = function (error) {
  console.log(error)
  return new ServerResponse(500, 'UE', { error })
}

ServerResponse.build = function (any) {
  if (any instanceof Error) return ServerResponse.unknownError(any)
  else if (any instanceof ServerResponse) return any
  else return ServerResponse.unknownError(new Error(any))
}

module.exports = ServerResponse
