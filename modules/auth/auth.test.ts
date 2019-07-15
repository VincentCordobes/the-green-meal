import {AuthPayload} from "./auth-types"
import auth from "./auth"
import {ApiRequest} from "../api-types"
import signup from "../signup"
import {aRequest, initTestDb} from "../test-helpers"
import {closeDb} from "../database"
import {add} from "../users/users"

beforeEach(() => initTestDb())
afterAll(() => closeDb())

describe("Auth endpoint", () => {
  test("should authenticate a user and returns an access token", async () => {
    // given
    const req: ApiRequest<AuthPayload> = aRequest({
      body: {
        email: "Vincent",
        password: "toto",
      },
    })

    // when
    await signup(req)
    const response = await auth(req)

    // then
    if (!response.ok) {
      expect(response.ok).toBe(true)
      return
    }
    expect(response).toEqual({
      ok: true,
      value: {
        personId: expect.any(Number),
        token: expect.any(String),
      },
    })
  })

  test("should not authenticate the user when the password is wrong", async () => {
    // given
    const req: ApiRequest<AuthPayload> = {
      body: {
        email: "Vincent",
        password: "totoo",
      },
    }

    // when
    const response = await auth(req)

    // then
    expect(response).toEqual({
      ok: false,
      statusCode: 401,
      error: "InvalidCredentials",
      errorMessage: "Wrong email or password",
    })
  })

  test("should authenticate a newly added user", async () => {
    await add(
      aRequest({
        body: {
          lastname: "Cordobes",
          firstname: "Vincent",
          email: "VincentCordobes",
          password: "pass",
        },
      }),
    )
    const response = await auth(
      aRequest({
        body: {
          email: "VincentCordobes",
          password: "pass",
        },
      }),
    )

    // then
    if (!response.ok) {
      expect(response.ok).toBe(true)
      return
    }
    expect(response).toEqual({
      ok: true,
      value: {
        personId: expect.any(Number),
        token: expect.any(String),
      },
    })
  })
})
