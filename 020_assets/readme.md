# MyWebApp / Assets

## Push the app:
Edit manifest.yml and change host part (xx) my your initials. Push the app

```
cf push
```

## Create and register the application in Developer Copckpit

### Create the application
* Name: mywebappxx
* Display Name: My Webapp XX 
* Version: 1.0.0
* Icon: is needed
* Components
  * Name: ui
  * Cloud Foundry Direct URL: https://mywebapp-xx-academy2.apps.eu1.mindsphere.io
  * Endpoint: /**

Click on button *Save*

### Register the application
Open the app again and click on button *Register*

## Add the application scope to your user
Go to *User Management*, search for you user and add the right scope

## Test the application
<https://academy2-mywebappxx-academy2.eu1.mindsphere.io/>

## Add the Core Roles
* Go to the Developer Cockpit => Roles & Scopes
* Select your application
* Add New Core Role
* Add the role *mdsp:core:assetmanagement.standarduser*

## Correct the errors in the code
1. What is the URL for the assets? You can find it in Postman
2. What is the name of the JSON data structure?




















































1. /api/assetmanagement/v3/assets
2. '_embedded'
