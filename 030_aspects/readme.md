# MyWebApp / Aspects

## Push the app:
Edit manifest.yml and change host part (xx) my your initials. Push the app

```
cf push
```

The old app will be overwritten, so no new registration is needed.

## Test the application
<https://academy2-mywebappxx-academy2.eu1.mindsphere.io/>

## Correct the errors in the code
1. What is the URL for the aspects for one asset? You can find it in Postman
2. Implement the correct filter that searches for anything inside the asset name ()

## Additional tasks
3. Add additional data from the aspect or asset to the view
4. Make the table nice :-)


































```
















































 
 
``` 
---

 
1. app/components/assetlist.js - Line 40 
url: '/api/assetmanagement/v3/assets/' + asset.assetId + '/aspects'

2. app/components/assetlist.js - Line 69: 
var filterAssetName =  '{"name": {"contains": {"value": "' + $scope.searchBoxText + '"}}}';
