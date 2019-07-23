# 🍒 The Green Meal

> Keep track of your meals calories

This is a [nextjs](https://nextjs.org/) app written in TypeScript.

- [Setup](#setup)
  - [Requirements](#requirements)
  - [Install dependencies](#install)
  - [Start](#start)
  - [Database](#database)
- [Tests](#tests)
- [Usage](#usage)
  - [Login](#login)
  - [Signup](#signup)

## Setup

### Requirements

- Node.js (tested on `v10`)
- PostgreSQL >= `11.3`

### Install dependencies

```
npm install
```

### Start

```
npm run build && npm run start
```

### Database

Init a db, create the tables and insert some dummy data.

```
npm run db:setup
```

## Tests

⚠️ Tests make db calls, so an instance of postgres being up is required.

```
npm test
```

## Usage

### Login

You can login, by default with:

- An admin user → login: `admin@meals.com`, password: `meals`
- A regular user → login: `regular@meals.com`, password: `meals`
- A manager → login: `manager@meals.com`, password: `meals`

### Signup

When creating an account—to confirm the provided email addres—a confirmation link is printed to the server stdout. This is to simulate the link normally sent to user mailbox.
Same for password reset.
