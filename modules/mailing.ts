import {info} from "./logger"

export function sendMail(emailAddress: string, body: string): void {
  // This should use a service like sendgrid or something
  info(`> Sending email to ${emailAddress} with content: 
  ${body}`)
}

export function confirmEmailTemplate(token: string) {
  return `You must follow this link to activate your account:
http://localhost:3000/api/confirm-email/${token}`
}
