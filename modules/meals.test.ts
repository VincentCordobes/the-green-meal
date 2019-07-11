import {list} from "./meals"
import {aRequest, initDbWithFixtures} from "./test-helpers"
import {closeDb} from "./database"

beforeEach(() => initDbWithFixtures("meals.fixtures.sql"))
afterAll(() => closeDb())

describe("List meals", () => {
  test("should return user meals", async () => {
    // when
    const response = await list(aRequest())

    // then
    expect(response).toEqual({
      ok: true,
      meals: [
        {
          id: expect.any(Number),
          at: new Date("2019-01-01T00:00:00.000Z"),
          text: "Banana with ice",
          calories: 400,
        },
        {
          id: expect.any(Number),
          at: new Date("2018-01-01T00:00:00.000Z"),
          text: "Fried chicken with rice",
          calories: 500,
        },
      ],
    })
  })
})
