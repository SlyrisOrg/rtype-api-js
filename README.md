# RType general API

*Still in development*

> **Note**: this guide assumes you are conscious of what you are doing due of the liberty offer by the API.

> **Default auth key**: eAVZepqfXsrSW6LVjTuqb3W3CHsf9mAUa5776cGZ2hLGzztK4PAT5gkJE52h


## Introduction

### User Data Structure

```json
{
  "_id": "ObjectId",
  "new": "Boolean",
  "name": "String",
  "email": "String",
  "password": "String",

  "profile": {
    "level": "Number",
    "gold": "Number"
  }
}
```

### Request Headers

```
  Content-"Type": "application/json"
  "Authorization": "jwt ${token}"
  X-Hub-"Signature": "String"
```

### Data Response

```json
{
  "id": "String",
  "success": "Boolean",
  "payload": "Number",
  "message": "String",
  "content": "Object",
  "timestamp": "Date"
}
```

### Payload

```json
{
  "success": {
    "payload": "0",
    "message": "Requrest success",
  },
  "notFound": {
    "payload": "101",
    "message": "No entrypoint here",
  },
  "internalError": {
    "payload": "102",
    "message": "Unexpected internal error",
  },
  "unvalidSignature": {
    "payload": "103",
    "message": "Unvalid signature",
  },
  "unvalidToken": {
    "payload": "104",
    "message": "Unvalid token",
  },
  "badRequest": {
    "payload": "105",
    "message": "Bad JSON format",
  },
  "emptyCredential": {
    "payload": "1101",
    "message": "Username or email is missing",
  },
  "emptyNickname": {
    "payload": "201",
    "message": "Empty nickname",
  },
  "badFormatNickname": {
    "payload": "202",
    "message": "Bad nickname format",
  },
  "alreadyTakenNickname": {
    "payload": "203",
    "message": "This nickname already exist in current database state",
  },
  "emptyName": {
    "payload": "301",
    "message": "Empty name",
  },
  "badFormatName": {
    "payload": "302",
    "message": "Bad name format",
  },
  "alreadyTakenName": {
    "payload": "303",
    "message": "This username already exist in current database state",
  },
  "emptyEmail": {
    "payload": "401",
    "message": "Empty email",
  },
  "badFormatEmail": {
    "payload": "402",
    "message": "Bad email format",
  },
  "alreadyTakenEmail": {
    "payload": "403",
    "message": "This email already exist in current database state",
  },
  "emptyPassword": {
    "payload": "501",
    "message": "Empty password",
  },
  "badFormatPassword": {
    "payload": "502",
    "message": "Bad password format",
  },
  "emptyLevel": {
    "payload": 1201,
    "message": "Empty level",
  },
  "badFormatLevel": {
    "payload": 1202,
    "message": "Bad level format",
  },
  "emptyFaction": {
    "payload": 1301,
    "message": "Empty faction",
  },
  "badFormatFaction": {
    "payload": 1302,
    "message": "Bad faction format",
  },
  "emptyExperience": {
    "payload": 1401,
    "message": "Empty experience",
  },
  "badFormatExperience": {
    "payload": 1402,
    "message": "Bad experience format",
  },
  "emptyIcon": {
    "payload": 1501,
    "message": "Empty icon",
  },
  "badFormatIcon": {
    "payload": 1502,
    "message": "Bad icon format",
  },

  "readUserData": {
    "payload": "601",
    "message": "Fail to fetch user data",
  },
  "putUserData": {
    "payload": "701",
    "message": "Fail to update data",
  },
  "postUserData": {
    "payload": "801",
    "message": "Fail to create player",
  },
  "signinUser": {
    "payload": "901",
    "message": "Couldn't signin",
  },
  "signupUser": {
    "payload": "1001",
    "message": "Couldn't signup",
  },
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
  - [1.1](#user--connection_signup) **Signup**: "Register" a new user

  "name": "between" 1 and 25 characters.

  "email": "between" 3 and 20 characters.

  "Request":
   ```json
   {
     "name": "String",
     "email": "String",
     "password": "String"
   }
   ```

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": "Object",
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Signup

  <a name="user--connection_signin"></a><a name="1.2"></a>
  - [1.1](#user--connection_signin) **Signin**: "Sigin" user and get a 48 hours valid token

  "name": "between" 1 and 25 characters.

  "email": "between" 3 and 20 characters.

  "Request":
   ```json
   {
     "name": "String?",
     "email": "String?",
     "password": "String"
   }
   ```

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": {
       "_id": "ObjectId",
       "new": "Boolean",
       "name": "String",
       "email": "String",
       "nickname": "String",
        "profile": {
          "icon": "Number",
          "level": "Number",
          "experience": "Number",
          "faction": "Number",
        },
       "token": "String"
     },
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Create

  <a name="user--crud_create"></a><a name="1.3"></a>
  - [1.1](#user--crud_create) **Create**: "Implement" new fresh data to a new registered user

  "nickname": "between" 1 and 25 characters.

  "Request":
   ```json
   {
     "nickname": "String",
     "icon": "Number",
     "profile": {
       "faction": "Number"
     }
   }
   ```

  > **Flag**: "token" needed.

  > **Note**: "this" data structure is a model of how to do, the api give access to all user field be carefull to do not override any field without reason.

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": "Object",
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Update

  <a name="user--crud_update"></a><a name="1.4"></a>
  - [1.1](#user--crud_update) **Update**: "Update" current data of a user

  "nickname": "between" 1 and 25 characters.

  "Request":
   ```json
   {
    "name": "String?",
    "email": "String?",
    "nickname": "String?",
    "icon": "Number?",
    "profile": {
      "level": "Number?",
      "experience": "Number?",
      "faction": "Number?",
    },
   }
   ```

  > **Flag**: "token" needed.

  > **Note**: "this" data structure is a model of how to do, the api give access to all user field be carefull to do not override any field without reason.

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": "Object",
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Read

  <a name="user--crud_read"></a><a name="1.5"></a>
  - [1.1](#user--crud_read) **Read**: "Get" current data of a user

  "Request":
   ```json
   {
   }
   ```

  > **Flag**: "token" needed.

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": {
        "_id": "ObjectId",
        "new": "Boolean",
        "name": "String",
        "email": "String",
        "nickname": "String",
        "icon": "Number",
        "profile": {
          "level": "Number",
          "experience": "Number",
          "faction": "Number",
        },
     },
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**

## User Delete

  <a name="user--crud_delete"></a><a name="1.6"></a>
  - [1.1](#user--crud_delete) **Delete**: "Delete" user

  "Request":
   ```json
   {
   }
   ```

  > **Flag**: "token" needed.

   "Response":
   ```json
   {
     "id": "String",
     "success": "Boolean",
     "payload": "Number",
     "message": "String",
     "content": "Object",
     "timestamp": "Date"
   }
   ```

**[⬆ back to top](#table-of-contents)**
