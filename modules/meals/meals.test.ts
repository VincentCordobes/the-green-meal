import {list, add} from "./meals"
import {aRequest, initDbWithFixtures} from "../test-helpers"
import {closeDb} from "../database"
import {AddMealDTO} from "./meals-types"

beforeEach(() => initDbWithFixtures("meals/meals.fixtures.sql"))
afterAll(() => closeDb())

describe("List meals", () => {
  test("should return user meals", async () => {
    // when
    const response = await list(aRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: expect.any(Number),
          at: "2019-01-01T00:00:00.000Z",
          text: "Banana with ice",
          calories: 400,
        },
        {
          id: expect.any(Number),
          at: "2018-01-01T00:00:00.000Z",
          text: "Fried chicken with rice",
          calories: 500,
        },
      ],
    })
  })
})

describe("Add a meal", () => {
  test("should add meal", async () => {
    // given
    const meal: AddMealDTO = {
      calories: 350,
      text: "Pasta",
      at: "2018-07-12T00:00:00.000Z",
    }

    // when
    const response = await add(aRequest(meal))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: expect.any(Number),
        at: "2018-07-12T00:00:00.000Z",
        text: "Pasta",
        calories: 350,
      },
    })
  })
})
