# App 1 - Token App

## Setup environment

### Cloud Foundary Login:
```
cf login -sso -a https://api.cf.eu1.mindsphere.io
```

## Push the app:
Edit manifest.yml and change host part (xx) my your initials. Push the app

```
cf push
```

## Create and register the application in Developer Copckpit

### Create the application
* Name: mywebappappxx
* Display Name: Token App
* Version: 1.0.0
* Icon: is needed
* Components
  * Name: ui
  * Cloud Foundry Direct URL: https://token-app-xx-academy2.apps.eu1.mindsphere.io
  * Endpoint: /**

Click on button *Save*

### Register the application
Open the app again and click on button *Register*

## Add the application scope to your user
Go to *User Management*, search for you user and add the right scope

## Test the application
<https://academy2-tokenappxx-academy2.eu1.mindsphere.io/>

## Correct the error in the code
Have a look at the Authorization-Header and what we decode and how
https://www.npmjs.com/package/jwt-simple



