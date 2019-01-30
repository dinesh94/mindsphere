## Setup environment

### Cloud Foundary Login:
```
cf login -sso -a https://api.cf.eu1.mindsphere.io
```

### List Services:
```
cf marketplace
```

### Create MongoDb Service
```
cf create-service mongodb32 mongodb-xs mymongodb
```

### Validate Service Creation
```
cf service mymongodb
```

### Binging Service to Application
```
cf bind-service mybackendapp mymongodb
```

### Restage the Application
```
cf restage mybackendapp
```

## URLs

### App Url:
<https://academy2-mybackendappxx-academy2.eu1.mindsphere.io/>


### App Url - get all data from the mongoDB:
<https://academy2-mybackendappxx-academy2.eu1.mindsphere.io/get?pretty>


### App Url - clear mongoDB:
<https://academy2-mybackendappxx-academy2.eu1.mindsphere.io/clear>


### App Url:
<https://academy2-mybackendappxx-academy2.eu1.mindsphere.io/write?name="datapoint_name">


### App Url - get data for a specific datapoint from the mongoDB filtered by name:
<https://academy2-mybackendappxx-academy2.eu1.mindsphere.io/get/"datapoint_name">


