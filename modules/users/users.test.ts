import {aRequest, initDbWithFixtures} from "../test-helpers"
import {list, add, remove} from "./users"
import {closeDb} from "../database"
import {dissoc} from "ramda"
import {AddUserPayload, RemoveUserPayload} from "./types"

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
    const user: AddUserPayload = {
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

  test("should remove a userId", async () => {
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
