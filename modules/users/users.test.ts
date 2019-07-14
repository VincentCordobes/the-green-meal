import {aRequest, initDbWithFixtures} from "../test-helpers"
import {list, add, remove, update} from "./users"
import {findById} from "./person"
import {closeDb} from "../database"
import {dissoc} from "ramda"
import {UserPayload, RemoveUserPayload, UpdateUser} from "./types"

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
  test("should add a user", async () => {
    // given
    const user: UserPayload = {
      lastname: "Cordobes",
      firstname: "Vincent",
      username: "VincentCordobes",
      password: "pass",
    }

    // when
    const response = await add(aRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        ...dissoc("password", user),
        id: expect.any(Number),
        role: "regular",
      },
    })
  })

  test("should remove a user by its id", async () => {
    // given
    const userToRemove: RemoveUserPayload = {
      userId: 2,
    }

    // when
    await remove(aRequest({body: userToRemove}))
    const response = await list(aRequest())

    // then
    expect(
      response.ok &&
        response.value.find(user => user.id === userToRemove.userId),
    ).toBeFalsy()
  })

  test("should return the removed userId", async () => {
    // given
    const user: RemoveUserPayload = {
      userId: 1,
    }

    // when
    const response = await remove(aRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {userId: 1},
    })
  })
})

describe("Update user", () => {
  test("should not update anything when no field are provided", async () => {
    // given
    const user: UpdateUser = {
      userId: 2,
    }

    // when
    await update(aRequest({body: user}))
    const response = await findById(user.userId)

    // then
    expect(response).toEqual({
      id: 2,
      username: "user2",
      password: expect.any(String),
      role: "regular",
      firstname: "firstname2",
      lastname: "lastname2",
    })
  })

  test("should update only provided fields only and returns the whole record", async () => {
    // given
    const user: UpdateUser = {
      userId: 2,
      values: {firstname: "Vincent"},
    }

    // when
    const response = await update(aRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 2,
        username: "user2",
        role: "regular",
        firstname: "Vincent",
        lastname: "lastname2",
      },
    })
  })

  test("should update all fields", async () => {
    // given
    const user: UpdateUser = {
      userId: 2,
      values: {
        firstname: "Vincent",
        lastname: "Cordobes",
        role: "admin",
        username: "actualUsername",
        password: "titi",
      },
    }

    // when
    const response = await update(aRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 2,
        firstname: "Vincent",
        lastname: "Cordobes",
        role: "admin",
        username: "actualUsername",
      },
    })
  })
})
