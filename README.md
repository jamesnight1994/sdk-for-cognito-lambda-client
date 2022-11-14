# Introduction

This npm package helps us interact with various Lami services.

# Contents

1. [Installation](#Installation)
2. [Authentication](#Authentication)

# Installation

Run 

`npm install lami-sdk`

## Authentication

App actions

```typescript
import App from 'lami-sdk/lib/app';

const app  = new LamiUser("test@lami.world","testpassword");

/** get access token @param clientSecret */
let response = await app.getAccessToken(clientSecret);

/** verify token @param userPoolId @param tokenUse @param userPoolId */
let response = await app.verify(token,tokenUse,userpoolId);

```

User actions

```typescript

import LamiUser from 'lami-sdk/lib/user'

const lamiUser  = new LamiUser("test@lami.world","testpassword");

/** Login @param clientId */
let response = await lamiUser.login(clientId);

/** Register @param userPoolId */
let response = await lamiUser.register(userPoolId);


```
