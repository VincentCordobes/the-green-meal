import signup from "./signup"
import Person from "./person"
import {initTestDb} from "./test-helpers"
import {closeDb} from "./database"

beforeEach(() => initTestDb())
afterAll(() => closeDb())

describe("sign up a new user", () => {
  test("should create a new user with a hashed password", async () => {
    // given
    const request = {
      body: {
        username: "VincentC",
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
    const personInDb = await Person.findById(response.personId)
    expect(personInDb).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        username: "VincentC",
        password: expect.not.stringContaining("toto"),
      }),
    )
  })

  // TODO: test("should not create the user when the username exists", async () => {
  // })
})
