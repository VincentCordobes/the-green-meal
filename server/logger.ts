export function info<T>(value: T, ...optionalParams: any[]): T {
  if (process.env.NODE_ENV !== "test") {
    console.info(value, ...optionalParams)
  }
  return value
}

export function log<T>(value: T, ...optionalParams: any[]): T {
  console.log(value, ...optionalParams)
  return value
}

const logger = {
  info,
  log,
}

export default logger
