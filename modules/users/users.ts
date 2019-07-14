import {ApiRequest, ApiResponse} from "../api-types"
import {query, DBError, DB_ERROR, buildUpdateFields} from "../database"
import {responseOK, responseKO} from "../api"
import {validate} from "../validate"
import {dissoc, head} from "ramda"
import sql from "sql-template-strings"
import {Person, findAll, findById} from "./person"
import Joi from "@hapi/joi"
import {
  UserDTO,
  UserPayload,
  AddUserError,
  RemoveUserResponse,
  RemoveUserPayload,
  UpdateUser,
} from "./types"
import {hashPassword} from "../auth/auth"

export async function list(req: ApiRequest): Promise<ApiResponse<UserDTO[]>> {
  const persons = await findAll()
  return responseOK(persons.map(toUserDTO))
}

function toUserDTO(person: Person): UserDTO {
  return dissoc("password", person)
}

const roleSchema = Joi.string().valid("manager", "regular", "admin")

export async function add(
  req: ApiRequest,
): Promise<ApiResponse<UserDTO, AddUserError>> {
  const {username, password, firstname, lastname, role = "regular"} = validate<
    UserPayload
  >(
    Joi.object({
      username: Joi.string(),
      password: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      role: roleSchema.optional(),
    }),
    req.body,
  )

  return query<Person>(
    sql`insert into person (username, password, firstname, lastname, role)
        values (${username}, ${password}, ${firstname}, ${lastname}, ${role})
        returning *`,
  )
    .then(head)
    .then(user => responseOK(toUserDTO(user)))
    .catch((e: DBError) => {
      if (e.code === DB_ERROR.uniqueViolation) {
        return responseKO({
          error: "DuplicateUser",
          errorMessage: "Username must be unique",
          statusCode: 400,
        })
      } else {
        throw e
      }
    })
}

export async function remove(
  req: ApiRequest,
): Promise<ApiResponse<RemoveUserResponse>> {
  const {userId} = validate<RemoveUserPayload>(
    Joi.object({userId: Joi.number()}),
    req.body,
  )

  return query<RemoveUserResponse>(
    sql`delete from person where id=${userId}`,
  ).then(() => responseOK({userId}))
}

export async function update(
  req: ApiRequest<UpdateUser>,
): Promise<ApiResponse<UserDTO>> {
  const {userId, values: fields} = validate<UpdateUser>(
    Joi.object({
      userId: Joi.number(),
      values: Joi.object({
        username: Joi.string().optional(),
        password: Joi.string().optional(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        role: roleSchema.optional(),
      }).optional(),
    }).optional(),
    req.body,
  )
  if (!fields || !Object.values(fields).length) {
    const user = await findById(userId)
    return responseOK(toUserDTO(user))
  }

  if (fields.password) {
    fields.password = await hashPassword(fields.password)
  }

  return query<UserDTO>(
    sql`update person set `
      .append(buildUpdateFields(fields))
      .append(` where id = ${userId} `)
      .append(` returning * `),
  )
    .then(head)
    .then(user => responseOK(toUserDTO(user)))
}
