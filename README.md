# us-cbp-scheduler

Bindings for the United States Customs and Border Protection scheduling API for Global Entry, NEXUS, SENTRI and FAST interviews. 

This does not provide Date objects, as timezone information is not always present in the API. If you need this, you can: 

```ts
new Date(Date.parse(t))
```

This will work for both timestamp formats used in the API.