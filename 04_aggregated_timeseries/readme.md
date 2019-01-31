# MyWebApp / Aggregated timeseries

## Push the app:
Edit manifest.yml and change host part (xx) my your initials. Push the app

```
cf push
```

The old app will be overwritten, so no new registration is needed.

## New scope needed
The app needs a new scope to access the timeseries data.
Open Developer Cockpit and add the correct scope.

## Test the application
<https://academy2-mywebappxx-academy2.eu1.mindsphere.io/>

# Exercises

## Correct the errors in the code
1. What is the URL for the aggregate timeseries API? You can find it in Postman
2. tbd

## Additional tasks
3. Implement another date/time picker :-)
4. Implement or discuss a logic to go around the 200 values restriction in combination with different timeframes
5. Find the bug why the chart-series is not poulated :-) ("undefined")
6. Fix the bug with the moment.js timestamp format (timeseries.js line 137-147)

































```
















































 
 
``` 
---


1. Line 94 
```javascript
        var timeUrl = '/api/iottsaggregates/v3/aggregates/' + filter.assetId + '/' + filter.aspectName + aggrParams;
```
