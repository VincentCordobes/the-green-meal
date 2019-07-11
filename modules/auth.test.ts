import {AuthPayload} from "./auth-types"
import auth from "./auth"
import {ApiRequest} from "./api-types"
import signup from "./sign-up"

describe("Auth endpoint", () => {
  test("should successfully authenticate the user", async () => {
    // given
    const req: ApiRequest<AuthPayload> = aRequest({
      username: "Vincent",
      password: "toto",
    })

    // when
    await signup(req)
    const response = await auth(req)

    // then
    expect(response).toEqual({
      ok: true,
      personId: expect.any(Number),
    })
  })

  test("should not authenticate the user when the password is wrong", async () => {
    // given
    const req: ApiRequest<AuthPayload> = {
      body: {
        username: "Vincent",
        password: "totoo",
      },
    }

    // when
    const response = await auth(req)

    // then
    expect(response).toEqual({
      ok: false,
      statusCode: 401,
      error: "Wrong username or password",
    })
  })
})

function aRequest<T>(body: T): ApiRequest<T> {
  return {
    body,
  }
}
