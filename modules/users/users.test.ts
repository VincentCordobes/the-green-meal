import {aRequest, initDbWithFixtures} from "../test-helpers"
import {list} from "./users"
import {closeDb} from "../database"

beforeEach(() => initDbWithFixtures("users/fixtures.sql"))
afterAll(() => closeDb())

describe("List users", () => {
  test("should return all users", async () => {
    // when
    const response = await list(aRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: 1,
          username: "user1",
          role: "regular",
          firstname: "firstname1",
          lastname: "lastname1",
        },
        {
          id: 2,
          username: "user2",
          role: "regular",
          firstname: "firstname2",
          lastname: "lastname2",
        },
        {
          id: 3,
          username: "user3",
          role: "regular",
          firstname: "firstname3",
          lastname: "lastname3",
        },
        {
          id: 4,
          username: "user4",
          role: "regular",
          firstname: "firstname4",
          lastname: "lastname4",
        },
      ],
    })
  })
})
