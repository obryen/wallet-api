<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Installation

1. Clone the repository to your local machine.
2. Open a terminal or command prompt and navigate to the root directory of the project.
3. Copy the env.example file to .env:
4. Update the values in the .env file as necessary to match your environment.
## Running the app

To start the app, follow these steps:

- Open a terminal or command prompt and navigate to the directory containing your docker-compose.yml file.
- Run the command docker-compose up to start the app and its dependencies.
- Wait for the containers to start and the app to be ready. You should see some output in the terminal indicating the progress of the startup process.
- Once the app is running, you can access it by opening a web browser and navigating to the URL http://localhost:3000.

## using the APIs

To test the Graphql API ,here is the base schema:
type Query {
account: Account
balance: Float!
transactions: [Transaction]
}

type Mutation {
createAccount(createAccountDto: {name: String!, email: String!, password: String!}): Account
login(loginDto: {email: String!, password: String!}): SessionDto
transfer(makePaymentDto: {email: String!, amount: Float!}): Transaction
}

type SessionDto{
  token: String!
  Sstatus: String!
}

type Account {
id: ID!
name: String!
email: String!
password: String!
}

type Transaction {
id: ID!
sender: Account!
recipient: Account!
amount: Float!
timestamp: String!
senderRunningBalance: Float!
}

## Stay in touch

- Author - [Bryan Toromo]

## License

Nest is [MIT licensed](LICENSE).
