# RType general API

*Still in development*

> **Note**: this guide assumes you are conscious of what you are doing due of the liberty offer by the API.

## Introduction

### User Data Structure

```json
{
  "_id": ObjectId,
  "new": Boolean,
  "name": String,
  "email": String,
  "password": String,

  "profile": {
    "level": Number,
    "gold": Number
  }
}
```

### Request Headers

```
  Content-Type: "application/json"
  Authorization: "jwt ${token}"
  X-Hub-Signature: String
```

### Data Response

```json
{
  "id": String,
  "payload": Number,
  "message": String,
  "content": Object,
  "timestamp": Date
}
```

## Table of Contents

  1. [User Signup](#user--connection_signup)
  1. [User Signin](#user--connection_signin)
  1. [User Create](#user--crud_create)
  1. [User Update](#user--crud_signup)
  1. [User Read](#user--crud_signup)
  1. [User Delete](#user--crud_signup)

## User Signup

  <a name="user--connection_signup"></a><a name="1.1"></a>
  - [1.1](#user--connection_signup) **Signup**: Register a new user

  name: between 1 and 25 characters
  email: between 3 and 20 characters

  Request:
   ```json
   {
     "name": String,
     "email": String,
     "password": String
   }
   ```

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": Object,
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Signup

  <a name="user--connection_signin"></a><a name="1.2"></a>
  - [1.1](#user--connection_signin) **Signin**: Sigin user and get a 48 hours valid token

  name: between 1 and 25 characters
  email: between 3 and 20 characters

  Request:
   ```json
   {
     "name": String?,
     "email": String?,
     "password": String
   }
   ```

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": {
       "token": String
     },
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Create

  <a name="user--crud_create"></a><a name="1.3"></a>
  - [1.1](#user--crud_create) **Create**: Implement new fresh data to a new registered user

  nickname: between 1 and 25 characters

  Request:
   ```json
   {
     "nickname": String
   }
   ```

  > **Flag**: token needed.

  > **Note**: this data structure is a model of how to do, the api give access to all user field be carefull to do not override any field without reason.

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": Object,
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Update

  <a name="user--crud_update"></a><a name="1.4"></a>
  - [1.1](#user--crud_update) **Update**: Update current data of a user

  nickname: between 1 and 25 characters

  Request:
   ```json
   {
     "nickname": String
   }
   ```

  > **Flag**: token needed.

  > **Note**: this data structure is a model of how to do, the api give access to all user field be carefull to do not override any field without reason.

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": Object,
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Read

  <a name="user--crud_read"></a><a name="1.5"></a>
  - [1.1](#user--crud_read) **Read**: Get current data of a user

  Request:
   ```json
   {
   }
   ```

  > **Flag**: token needed.

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": {
       "_id": ObjectId,
       "name": String,
       "email": String,
       "nickname": String,
       "profile": {
         "level": Number,
         "gold": Number,
         "ship": Object
       }
     },
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Read

  <a name="user--crud_delete"></a><a name="1.6"></a>
  - [1.1](#user--crud_delete) **Delete**: Delete user

  Request:
   ```json
   {
   }
   ```

  > **Flag**: token needed.

   Response:
   ```json
   {
     "id": String,
     "payload": Number,
     "message": String,
     "content": Object,
     "timestamp": Date
   }
   ```

**[⬆ back to top](#table-of-contents)**
