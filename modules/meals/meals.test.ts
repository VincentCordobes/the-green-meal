import {list, add} from "./meals"
import {aRequest, initDbWithFixtures} from "../test-helpers"
import {closeDb} from "../database"
import {AddMealDTO, MealsFilter} from "./meals-types"
import {withErrorHandler} from "../error-handler"

beforeEach(() => initDbWithFixtures("meals/meals.fixtures.sql"))
afterAll(() => closeDb())

describe("List meals", () => {
  test("should return all user meals", async () => {
    // when
    const response = await list(aRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: 1,
          at: "2018-01-01T12:00:00.000Z",
          text: "Fried chicken with rice",
          calories: 500,
        },
        {
          id: 2,
          at: "2019-01-01T19:00:00.000Z",
          text: "Banana with ice",
          calories: 400,
        },
      ],
    })
  })

  test("should return KO when the meal filter is invalid", async () => {
    // when
    const query: MealsFilter = {
      fromDate: "invalid from ",
      toDate: "2019-02-11",
    }
    const response = await withErrorHandler(list)(aRequest({query}))

    // then
    expect(response).toEqual({
      ok: false,
      statusCode: 400,
      error: "BadRequest",
      errorMessage: expect.any(String),
    })
  })

  test.each([
    ["2017-05-21", "2019-02-11", [1, 2]],
    ["2018-05-21", "2019-02-11", [2]],
    ["2017-05-21", "2018-02-11", [1]],
    ["2018-01-01", "2019-01-01", [1, 2]],
    ["2019-01-02", "2019-02-01", []],
  ])(
    "should return user meals between the range %s - %s",
    async (fromDate, toDate, ids) => {
      const response = await list(aRequest({query: {fromDate, toDate}}))
      if (!response.ok) {
        expect(response.ok).toBe(true)
        return
      }
      expect(response.value.map(meal => meal.id)).toEqual(ids)
    },
  )

  test.each([
    ["2017-05-21", [1, 2]],
    ["2018-05-21", [2]],
    ["2018-01-01", [1, 2]],
    ["2019-01-01", [2]],
    ["2019-01-02", []],
  ])("should return user meals from the date %s", async (fromDate, ids) => {
    const response = await list(aRequest({query: {fromDate}}))
    if (!response.ok) {
      expect(response.ok).toBe(true)
      return
    }
    expect(response.value.map(meal => meal.id)).toEqual(ids)
  })

  test.each([
    ["2017-05-21", []],
    ["2018-05-21", [1]],
    ["2019-01-01", [1, 2]],
    ["2019-01-02", [1, 2]],
  ])("should return user meals untill the date %s", async (toDate, ids) => {
    const response = await list(aRequest({query: {toDate}}))
    if (!response.ok) {
      expect(response.ok).toBe(true)
      return
    }
    expect(response.value.map(meal => meal.id)).toEqual(ids)
  })

  test.each([
    ["12:00", "13:00", [1]],
    ["13:01", "15:00", []],
    ["18:00", "21:00", [2]],
  ])(
    "should return user meals between the time range %s -%s",
    async (fromTime, toTime, ids) => {
      const response = await list(aRequest({query: {fromTime, toTime}}))
      if (!response.ok) {
        expect(response.ok).toBe(true)
        return
      }
      expect(response.value.map(meal => meal.id)).toEqual(ids)
    },
  )
  test.each([
    // prettier-ignore
    ["12:00", [1, 2]],
    ["13:01", [2]],
    ["11:00", [1, 2]],
    ["21:00", []],
  ])(
    "should return user meals between from the time %s",
    async (fromTime, ids) => {
      const response = await list(aRequest({query: {fromTime}}))
      if (!response.ok) {
        expect(response.ok).toBe(true)
        return
      }
      expect(response.value.map(meal => meal.id)).toEqual(ids)
    },
  )
  test.each([
    // prettier-ignore
    ["10:00", []],
    ["13:01", [1]],
    ["21:00", [1, 2]],
  ])(
    "should return user meals between until the time %s",
    async (toTime, ids) => {
      const response = await list(aRequest({query: {toTime}}))
      if (!response.ok) {
        expect(response.ok).toBe(true)
        return
      }
      expect(response.value.map(meal => meal.id)).toEqual(ids)
    },
  )
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
    const response = await add(aRequest({body: meal}))

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
