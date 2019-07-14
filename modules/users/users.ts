import {ApiRequest, ApiResponse} from "../api-types"
import {query, DBError, DB_ERROR} from "../database"
import {responseOK, responseKO} from "../api"
import {validate} from "../validate"
import {dissoc, head} from "ramda"
import SQL from "sql-template-strings"
import {Person, findAll} from "./person"
import Joi from "@hapi/joi"
import {
  UserDTO,
  AddUserPayload,
  AddUserError,
  RemoveUserResponse,
  RemoveUserPayload,
} from "./types"

export async function list(req: ApiRequest): Promise<ApiResponse<UserDTO[]>> {
  const persons = await findAll()
  return responseOK(persons.map(toUserDTO))
}

function toUserDTO(person: Person): UserDTO {
  return dissoc("password", person)
}

export async function add(
  req: ApiRequest,
): Promise<ApiResponse<UserDTO, AddUserError>> {
  const {username, password, firstname, lastname, role = "regular"} = validate<
    AddUserPayload
  >(
    Joi.object({
      username: Joi.string(),
      password: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      role: Joi.string()
        .valid("manager", "regular", "admin")
        .optional(),
    }),
    req.body,
  )

  return query<Person>(
    SQL`insert into person (username, password, firstname, lastname, role)
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
    SQL`delete from person where id=${userId}`,
  ).then(() => responseOK({userId}))
}
