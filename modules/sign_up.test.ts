import signup from "./sign-up"
import Person from "./person"

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
    expect(personInDb).toEqual({
      id: expect.any(Number),
      username: "VincentC",
      password: expect.not.stringContaining("toto"),
    })
  })
})
