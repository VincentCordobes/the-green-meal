import fs from "fs"
import path from "path"

import {execute} from "./database"
import {ApiRequest} from "./api"

export function aRequest<T = any>(
  props: Partial<ApiRequest<T>> = {},
): ApiRequest<T> {
  return {
    cookies: {
      token: "regular",
    },
    headers: {},
    ...props,
  }
}

export function anAdminRequest<T = any>(props: Partial<ApiRequest<T>> = {}) {
  return aRequest({
    cookies: {
      token: "admin",
    },
    ...props,
  })
}

export function aManagerRequest<T = any>(props: Partial<ApiRequest<T>> = {}) {
  return aRequest({
    cookies: {
      token: "manager",
    },
    ...props,
  })
}

export async function initDbWithFixtures(fixturesPath: string) {
  await initTestDb()

  const fullPath = path.join("server/", fixturesPath)
  await execSqlFile(fullPath)
}

export async function initTestDb() {
  const migrationPath = "migrations"

  const migrations = ["0000_clean.sql", "0001_create_tables.up.sql"]

  for (let i = 0; i < migrations.length; i++) {
    const file = migrations[i]
    await execSqlFile(path.join(migrationPath, file))
  }
}

export async function execSqlFile(filePath: string) {
  const sqlContent = fs.readFileSync(filePath, "utf8")
  const queries = sqlContent.split(";")

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    await execute(query)
  }
}
