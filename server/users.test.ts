import {dissoc} from "ramda"

import {
  aRequest,
  initDbWithFixtures,
  anAdminRequest,
  aManagerRequest,
} from "./test-helpers"
import {list, add, remove, update, listManagedUsers} from "./users"
import {findById} from "./person"
import {closeDb} from "./database"
import {UserPayload, RemoveUserPayload, UpdateUser} from "../shared/user-types"

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

beforeEach(() => initDbWithFixtures("test-fixtures.sql"))
afterAll(() => closeDb())

describe("List users", () => {
  test("should return all users but admin", async () => {
    // when
    const response = await list(anAdminRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: 1,
          email: "manager@toto.com",
          emailValidated: true,
          role: "manager",
          firstname: "firstname1",
          lastname: "lastname1",
        },
        {
          id: 2,
          email: "user2@toto.com",
          emailValidated: true,
          expectedCaloriesPerDay: 600,
          role: "regular",
          firstname: "firstname2",
          lastname: "lastname2",
        },
        {
          id: 3,
          email: "user3@toto.com",
          emailValidated: true,
          role: "regular",
          firstname: "firstname3",
          lastname: "lastname3",
        },
        {
          id: 4,
          email: "user4@toto.com",
          emailValidated: true,
          role: "regular",
          firstname: "firstname4",
          lastname: "lastname4",
        },
      ],
    })
  })

  test("should return only the users managed by the manager", async () => {
    // when
    const response = await list(aManagerRequest())

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        {
          id: 3,
          email: "user3@toto.com",
          emailValidated: true,
          role: "regular",
          firstname: "firstname3",
          lastname: "lastname3",
        },
        {
          id: 4,
          email: "user4@toto.com",
          emailValidated: true,
          role: "regular",
          firstname: "firstname4",
          lastname: "lastname4",
        },
      ],
    })
  })

  test("should return an error when the user is regular", async () => {
    // when
    expect.assertions(1)
    try {
      await list(
        aRequest({
          cookies: {
            token: "regular",
          },
        }),
      )
    } catch (e) {
      // then
      expect(e).toBeTruthy()
    }
  })
})

describe("Add users", () => {
  test("should add a user", async () => {
    // given
    const user: UserPayload = {
      email: "VincentCordobes@meals.com",
      password: "pass",
      lastname: "Cordobes",
      firstname: "Vincent",
    }

    // when
    const response = await add(anAdminRequest({body: user}))

    // then
    expect.assertions(2)
    if (response.ok) {
      expect(response).toEqual({
        ok: true,
        value: {
          ...dissoc("password", user),
          id: expect.any(Number),
          emailValidated: false,
          role: "regular",
        },
      })
      const personInDb = await findById(response.value.id)
      expect(personInDb).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: "VincentCordobes@meals.com",
          password: expect.not.stringContaining("pass"),
        }),
      )
    }
  })

  test("should not create the user when the email exists", async () => {
    const request = anAdminRequest({
      body: {
        email: "VincentC@toto.com",
        password: "toto",
        lastname: "Cordobes",
        firstname: "Vincent",
      },
    })

    // when
    await add(request)
    const response = await add(request)
    expect(response).toEqual({
      ok: false,
      statusCode: 400,
      error: "DuplicateUser",
      errorMessage: expect.any(String),
    })
  })

  test("should remove a user by its id", async () => {
    // given
    const userToRemove: RemoveUserPayload = {
      userId: 2,
    }

    // when
    await remove(anAdminRequest({body: userToRemove}))
    const response = await list(anAdminRequest())

    // then
    expect(
      response.ok &&
        response.value.find(user => user.id === userToRemove.userId),
    ).toBeFalsy()
  })

  test("should return the removed userId when asked by an admin", async () => {
    // given
    const user: RemoveUserPayload = {
      userId: 1,
    }

    // when
    const response = await remove(anAdminRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {userId: 1},
    })
  })

  test("should not remove anything when the user is not a managed", async () => {
    expect.assertions(1)
    // when
    try {
      await remove(
        aManagerRequest({
          body: {
            userId: 2,
          },
        }),
      )
    } catch (e) {
      // then
      expect(e).toBeTruthy()
    }
  })

  test("should throw if the user is not an admin or a manager", async () => {
    expect.assertions(1)
    // when
    try {
      await remove(
        aRequest({
          body: {
            userId: 1,
          },
        }),
      )
    } catch (e) {
      // then
      expect(e).toBeTruthy()
    }
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
    expect(response).toEqual(
      expect.objectContaining({
        id: 2,
        email: "user2@toto.com",
        password: expect.any(String),
        expectedCaloriesPerDay: 600,
        role: "regular",
        firstname: "firstname2",
        lastname: "lastname2",
      }),
    )
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
        email: "user2@toto.com",
        emailValidated: true,
        expectedCaloriesPerDay: 600,
        role: "regular",
        firstname: "Vincent",
        lastname: "lastname2",
      },
    })
  })

  test("should not update when the email already exists", async () => {
    // given
    const user: UpdateUser = {
      userId: 2,
      values: {email: "admin@toto.com"},
    }

    // when
    const response = await update(aRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: false,
      statusCode: 400,
      error: "DuplicateUser",
      errorMessage: expect.any(String),
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
        email: "actualemail",
        password: "titi",
      },
    }

    // when
    const response = await update(anAdminRequest({body: user}))

    // then
    expect(response).toEqual({
      ok: true,
      value: {
        id: 2,
        firstname: "Vincent",
        lastname: "Cordobes",
        role: "admin",
        expectedCaloriesPerDay: 600,
        email: "actualemail",
        emailValidated: true,
      },
    })
  })

  test("a manager should not be able to set admin role", async () => {
    expect.assertions(1)
    // given
    const user: UpdateUser = {
      userId: 1,
      values: {
        role: "admin",
      },
    }

    // when
    try {
      await update(aManagerRequest({body: user}))
    } catch (e) {
      expect(e.statusCode).toBe(401)
    }
  })
})

describe("manager", () => {
  test("should add and delete managers", async () => {
    // when
    await update(
      aManagerRequest({
        body: {
          userId: 2,
          values: {
            managedUserIds: [3, 4],
          },
        },
      }),
    )
    await update(
      aManagerRequest({
        body: {
          userId: 2,
          values: {
            managedUserIds: [2],
          },
        },
      }),
    )
    const response = await listManagedUsers(
      aManagerRequest({query: {managerId: 2}}),
    )

    // then
    expect(response).toEqual({
      ok: true,
      value: [
        expect.objectContaining({
          id: 2,
          firstname: "firstname2",
          lastname: "lastname2",
        }),
      ],
    })
  })
})
