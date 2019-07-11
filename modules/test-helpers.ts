import {ApiRequest} from "./api-types"
import {execute} from "./database"
import fs from "fs"
import path from "path"

export function aRequest<T>(body?: T): ApiRequest<T> {
  return {body}
}

export async function initDbWithFixtures(fixturesPath: string) {
  await initTestDb()

  const fullPath = path.join("modules/", fixturesPath)
  await execSqlFile(fullPath)
}

export async function initTestDb() {
  const migrationPath = "migrations"

  const migrations = fs
    .readdirSync(migrationPath)
    .filter(file => file.indexOf("down") === -1)
    .sort()

  for (let i = 0; i < migrations.length; i++) {
    const file = migrations[i]
    await execSqlFile(path.join(migrationPath, file))
  }
}

async function execSqlFile(filePath: string) {
  const sqlContent = fs.readFileSync(filePath, "utf8")
  const queries = sqlContent.split(";")

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    await execute(query)
  }
}
