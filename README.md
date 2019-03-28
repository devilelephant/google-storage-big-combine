# google-storage-big-combine 

_Rationale_: Google Storage java api's ```bucket.combine()``` method has a limit of 30 or so files.

There are use cases where there are more than the max-allowed parts so a utility method to iterate and comnbine is required

__Prerequisites__

You already know how to install and use the Google Cloud Storage javascript api

__Usage:__

```
const {combine} = require('google-storage-big-combine')

< Create your instance of google storage >

let bucket =  <GCS bucket instance> 
let fileList = <list of GCS files> 
let file = <destination GCS file for the combine>

await combine(bucket, fileList, file)

```

