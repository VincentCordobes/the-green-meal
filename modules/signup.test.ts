import signup from "./signup"
import Person from "./users/person"
import {initTestDb} from "./test-helpers"
import {closeDb} from "./database"

beforeEach(() => initTestDb())
afterAll(() => closeDb())

describe("sign up a new user", () => {
  test("should create a new user with a hashed password", async () => {
    // given
    const request = {
      body: {
        email: "VincentC",
        password: "toto",
      },
    }

    // when
    const response = await signup(request)
    if (!response.ok) {
      expect(response.ok).toBe(true)
      return
    }

    // then
    const personInDb = await Person.findById(response.value.personId)
    expect(personInDb).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: "VincentC",
        password: expect.not.stringContaining("toto"),
      }),
    )
  })

  test("should not create the user when the email exists", async () => {
    const request = {
      body: {
        email: "VincentC",
        password: "toto",
      },
    }

    // when
    await signup(request)
    const response = await signup(request)
    expect(response).toEqual({
      ok: false,
      statusCode: 400,
      error: "email already exists",
    })
  })
})
