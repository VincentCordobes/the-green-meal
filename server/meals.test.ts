import {
  AddMealRequest,
  MealsFilter,
  UpdateMealRequest,
  MealDTO,
} from "../shared/meals-types"
import {OKResponse} from "../shared/api-types"

import {list, add, remove, update} from "./meals"
import {aRequest, initDbWithFixtures, anAdminRequest} from "./test-helpers"
import {closeDb} from "./database"
import {withErrorHandler} from "./error-handler"

beforeEach(() => initDbWithFixtures("test-fixtures.sql"))
afterAll(() => closeDb())

jest.mock("jsonwebtoken", () => {
  const verify = jest.fn((token, _, cb) => {
    let userId
    if (token === "manager") {
      userId = 1
    } else if (token === "admin") {
      userId = 5
    } else if (token === "regular") {
      userId = 2
    }

    if (userId) {
      cb(null, {userId, role: token})
    } else {
      cb("error")
    }
  })

  return {verify}
})

describe("List meals", () => {
  test("should return all user meals ordered by date desc", async () => {
    // when
    const response = await list(aRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: 2,
          fullname: "firstname2 lastname2",
          expectedCaloriesPerDay: 600,
          atDate: "2019-01-01",
          atTime: "19:00",
          text: "Banana with ice",
          calories: 400,
        },
        {
          id: 1,
          fullname: "firstname2 lastname2",
          expectedCaloriesPerDay: 600,
          atDate: "2018-01-01",
          atTime: "12:00",
          text: "Fried chicken with rice",
          calories: 500,
        },
      ],
    })
  })
})

describe("Filter meals", () => {
  const getIds = (response: OKResponse<MealDTO[]>) =>
    response.value.map(meal => meal.id).sort()

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
      expect(getIds(response)).toEqual(ids)
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
    expect(getIds(response)).toEqual(ids)
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
    expect(getIds(response)).toEqual(ids)
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
      expect(getIds(response)).toEqual(ids)
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
      expect(getIds(response)).toEqual(ids)
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
      expect(getIds(response)).toEqual(ids)
    },
  )
})

describe("Add a meal", () => {
  test("should add meal", async () => {
    // given
    const meal: AddMealRequest = {
      calories: 350,
      text: "Pasta",
      atDate: "2018-07-12",
      atTime: "00:00",
    }

    // when
    const addResponse = await add(aRequest({body: meal}))
    const listResponse = await list(aRequest({body: meal}))

    // then
    const addedMeal = {
      id: expect.any(Number),
      atDate: "2018-07-12",
      atTime: "00:00",
      text: "Pasta",
      calories: 350,
    }
    expect(addResponse).toEqual({
      ok: true,
      value: addedMeal,
    })
    expect(listResponse).toEqual({
      ok: true,
      value: expect.arrayContaining([expect.objectContaining(addedMeal)]),
    })
  })
})

describe("Update a meal", () => {
  test("should update all meal fields", async () => {
    // given
    const meal: UpdateMealRequest = {
      mealId: 1,
      values: {
        calories: 350,
        text: "Pasta",
        atDate: "2018-07-12",
        atTime: "00:00",
      },
    }

    // when
    const response = await update(aRequest({body: meal}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 1,
        atDate: "2018-07-12",
        atTime: "00:00",
        text: "Pasta",
        calories: 350,
      },
    })
  })

  test("should update some meal fields", async () => {
    // given
    const meal: UpdateMealRequest = {
      mealId: 1,
      values: {
        calories: 350,
      },
    }

    // when
    const response = await update(aRequest({body: meal}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 1,
        atDate: "2018-01-01",
        atTime: "12:00",
        text: "Fried chicken with rice",
        calories: 350,
      },
    })
  })

  test("should not update a meal that belongs to an other user", async () => {
    // given
    expect.assertions(1)
    const meal: UpdateMealRequest = {
      mealId: 3, // An admin meal
      values: {
        calories: 350,
      },
    }

    // when
    try {
      await update(aRequest({body: meal}))
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })

  test("Admin can update all meals", async () => {
    // given
    const meal: UpdateMealRequest = {
      mealId: 1,
      values: {
        calories: 350,
      },
    }

    // when
    const response = await update(anAdminRequest({body: meal}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 1,
        atDate: "2018-01-01",
        atTime: "12:00",
        text: "Fried chicken with rice",
        calories: 350,
      },
    })
  })
})

describe("Remove a meal", () => {
  test("should remove a meal by its id", async () => {
    // given
    const mealToRemove = {
      mealId: 2,
    }

    // when
    await remove(aRequest({body: mealToRemove}))
    const response = await list(aRequest())

    // then
    expect(
      response.ok &&
        response.value.find(user => user.id === mealToRemove.mealId),
    ).toBeFalsy()
  })

  test("should not remove anything when the meal is not owned", async () => {
    expect.assertions(1)
    // when
    try {
      await remove(aRequest({body: {mealId: 5}}))
    } catch (e) {
      // then
      expect(e).toBeTruthy()
    }
  })

  test("should remove an UNowned meal when it's asked by an admin", async () => {
    // given
    const mealToRemove = {
      mealId: 2,
    }

    // when
    await remove(anAdminRequest({body: mealToRemove}))
    const response = await list(aRequest())

    // then
    expect(
      response.ok &&
        response.value.find(user => user.id === mealToRemove.mealId),
    ).toBeFalsy()
  })
})
