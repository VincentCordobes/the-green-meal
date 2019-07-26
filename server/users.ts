import {head, pickBy, isNil} from "ramda"
import sql, {SQLStatement} from "sql-template-strings"
import Joi from "@hapi/joi"
import uuid from "uuid"

import {
  UserDTO,
  UserPayload,
  AddUserError,
  RemoveUserResponse,
  RemoveUserRequest,
  UpdateRequest,
} from "../shared/user-types"
import {ApiResponse, KOResponse} from "../shared/api-types"

import {
  query,
  DBError,
  DB_ERROR,
  buildUpdateFields,
  execute,
  buildValues,
} from "./database"
import {responseOK, responseKO, ApiRequest} from "./api"
import {validate} from "./validate"
import {Person, findAll, findById, findByManagerId} from "./person"
import {hashPassword} from "./auth"
import {confirmEmailTemplate, sendMail} from "./mailing"
import {withACLs, checkAccess} from "./with-auth"
import {HTTPError} from "./error-handler"
import {getRoles} from "../shared/auth"

export const list = withACLs(
  ["admin", "manager"],
  async (_, params): Promise<ApiResponse<UserDTO[]>> => {
    if (params.role === "manager") {
      const persons = await findByManagerId(params.userId)
      return responseOK(persons.map(toUserDTO))
    }

    const persons = await findAll()
    return responseOK(
      persons.filter(user => user.id !== params.userId).map(toUserDTO),
    )
  },
)

export const getCurrent = withACLs(
  ["admin", "manager", "regular"],
  async (_, params): Promise<ApiResponse<UserDTO>> => {
    const [user] = await query<Person>(
      sql`select * from person
          where id = ${params.userId}`,
    )
    if (!user) {
      throw new HTTPError(401)
    }

    return responseOK(toUserDTO(user))
  },
)

export const getById = withACLs(
  ["admin", "manager"],
  async (req, params): Promise<ApiResponse<UserDTO>> => {
    const {id} = validate<{id: number}>(
      Joi.object({id: Joi.number()}),
      req.query,
    )

    const sqlQuery: SQLStatement = sql`select * from person where id = ${id}`

    if (params.role === "manager") {
      sqlQuery.append(sql` and manager_id = ${params.userId}`)
    }

    const [user] = await query<Person>(sqlQuery)

    if (!user) {
      throw new HTTPError(401)
    }

    return responseOK(toUserDTO(user))
  },
)

function toUserDTO(person: Person): UserDTO {
  return pickBy((val, key) => {
    const fieldsToIgnore = ["password", "emailValidationToken", "managerId"]

    return !fieldsToIgnore.includes(key) && !isNil(val)
  }, person)
}

const roleSchema = Joi.string().valid("manager", "regular", "admin")

const addSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  role: roleSchema.optional(),
  expectedCaloriesPerDay: Joi.number()
    .max(900000)
    .optional(),
})

export const add = async (
  req: ApiRequest,
): Promise<ApiResponse<UserDTO, AddUserError>> => {
  const {
    email,
    password: plainPassword,
    firstname,
    lastname,
    role = "regular",
  } = validate<UserPayload>(addSchema, req.body)

  const user = await checkAccess(
    req.cookies.token || req.headers.authorization,
  ).catch(_ => null)

  const password: string = await hashPassword(plainPassword)
  const managerId = user && user.role === "manager" ? user.userId : null
  const emailValidationToken = uuid.v4()

  const values = buildValues({
    email: email.toLowerCase(),
    firstname,
    lastname,
    role,
    emailValidated: process.env.NODE_ENV !== "test", // For the demo
    emailValidationToken,
    password,
    managerId,
  })

  return query<Person>(
    sql`insert into person`.append(values).append(` returning *`),
  )
    .then(head)
    .then(user => responseOK(toUserDTO(user)))
    .then(response => {
      sendMail(email, confirmEmailTemplate(emailValidationToken))
      return response
    })
    .catch(handleDuplicateUser)
}

function handleDuplicateUser(e: DBError): KOResponse<AddUserError> {
  if (e.code === DB_ERROR.uniqueViolation) {
    return responseKO({
      error: "DuplicateUser",
      errorMessage: "email must be unique",
      statusCode: 400,
    })
  } else {
    throw e
  }
}

export const remove = withACLs(
  ["admin", "manager"],
  async (req, {userId, role}): Promise<ApiResponse<RemoveUserResponse>> => {
    const {userId: userIdToRemove} = validate<RemoveUserRequest>(
      Joi.object({userId: Joi.number()}),
      req.body,
    )

    let sqlQuery: SQLStatement
    if (role === "admin") {
      sqlQuery = sql`delete from person 
                     where id=${userIdToRemove}`
    } else {
      sqlQuery = sql`delete from person
                     where id=${userIdToRemove}
                     and manager_id = ${userId}`
    }

    const {rowCount} = await execute(sqlQuery)

    if (rowCount === 0) {
      throw new HTTPError(401)
    }

    return responseOK({userId: userIdToRemove})
  },
)

const updateUserSchema = Joi.object({
  userId: Joi.number(),
  values: Joi.object({
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    expectedCaloriesPerDay: Joi.number()
      .allow(null)
      .optional(),
    role: roleSchema.optional(),
    managedUserIds: Joi.array()
      .items(Joi.number())
      .optional(),
  }).optional(),
}).optional()

export const update = withACLs(
  ["regular", "admin", "manager"],
  async (
    req: ApiRequest<UpdateRequest>,
    params,
  ): Promise<ApiResponse<UserDTO>> => {
    const {userId, values} = validate<UpdateRequest>(updateUserSchema, req.body)

    if (!values) {
      const user = await findById(userId)
      return responseOK(toUserDTO(user))
    }

    if (values.role) {
      const permissions = getRoles(params.role)
      if (!permissions.includes(values.role)) {
        throw new HTTPError(401)
      }
    }

    const {managedUserIds, ...fields} = values

    if (managedUserIds) {
      await updateManagedUsers(userId, managedUserIds)
    }

    if (!Object.values(fields).length) {
      const user = await findById(userId)
      return responseOK(toUserDTO(user))
    }

    if (fields.password) {
      fields.password = await hashPassword(fields.password)
    }

    return query<UserDTO>(
      sql`update person set `
        .append(
          buildUpdateFields({
            ...fields,
            ...(fields.email ? {email: fields.email.toLowerCase()} : {}),
          }),
        )
        .append(sql` where id = ${userId} `)
        .append(` returning * `),
    )
      .then(head)
      .then(user => responseOK(toUserDTO(user)))
      .catch(handleDuplicateUser)
  },
)

async function updateManagedUsers(managerId: number, managedUserIds: number[]) {
  await query(sql`update person 
                  set manager_id = null 
                  where manager_id = ${managerId}`)

  if (managedUserIds.length) {
    await query(sql`update person 
                    set manager_id = ${managerId}
                    where person.id = any(${managedUserIds})`)
  }
}

export const listManagedUsers = withACLs(
  ["admin", "manager"],
  async (req): Promise<ApiResponse<UserDTO[]>> => {
    const {managerId} = validate<{managerId: number}>(
      Joi.object({
        managerId: Joi.number(),
      }),
      req.query,
    )
    const users = await query<Person>(
      sql`select *
          from person
          where person.manager_id = ${managerId}`,
    )

    return responseOK(users.map(toUserDTO))
  },
)
