# Introduction

This npm package helps us interact with various workflows in deployed on AWS lambda. These lambda functions work with variouse AWS reeources such as cognito

# Contents

1. [Installation](#Installation)
2. [Authentication](#Authentication)
3. **[SMS](#SMS)**

# Installation

Run

`npm install nevar-cognito-sdk`

## Authentication

App actions

```typescript
import App from 'nevar-aws-sdk/lib/auth/app';

const app  = new User("test@gmail.com","testpassword");

/** get access token @param clientSecret */
let response = await app.getAccessToken(clientSecret);

/** verify token @param userPoolId @param tokenUse @param userPoolId */
let response = await app.verify(token,tokenUse,userpoolId);

```

User actions

```typescript

import User from 'nevar-aws-sdk/lib/auth/user'

const user  = new User("test@lami.world","testpassword");

/** Login @param clientId */
let response = await user.login(clientId);

/** Register @param userPoolId */
let response = await user.register(userPoolId);


```

## SMS

Sending and SMS/Text message

```typescript

import SMS from 'nevar-aws-sdk/lib/sms'

const sms  = new SMS();

/** Send @param message - message
     * @param subject - subject of the message
     * @param phoneNumber - user phone number */
let response = await sms.send(message: string,subject: string,phoneNumber: string);



```
