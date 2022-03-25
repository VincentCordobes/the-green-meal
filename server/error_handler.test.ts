import {withErrorHandler, HTTPError} from "./error_handler"

describe("error-handler", () => {
  test("should reply with statusCode 500 on unhandled error", async () => {
    // given
    const requestHandler = () => {
      throw new Error("My error")
    }

    // when
    const res = await withErrorHandler(requestHandler)(aReq())

    // then
    if (res.ok) {
      expect(res.ok).toBe(false)
    } else {
      expect(res.statusCode).toBe(500)
      expect(res.errorMessage).not.toContain("My error")
      expect(res.error).toBe("InternalServerError")
    }
  })

  test("should reply with the given http error status code and message", async () => {
    // given
    const requestHandler = () => {
      throw new HTTPError(400, "Hello world")
    }

    // when
    const res = await withErrorHandler(requestHandler)(aReq())

    // then
    if (res.ok) {
      expect(res.ok).toBe(false)
    } else {
      expect(res.statusCode).toBe(400)
      expect(res.error).toBe("BadRequest")
      expect(res.errorMessage).toContain("Hello world")
    }
  })
})

function aReq(): any {
  return {}
}
