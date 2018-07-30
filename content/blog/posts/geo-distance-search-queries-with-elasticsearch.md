+++
tags = ["elasticsearch", "golang", "t-mobile"]
categories = ["Resources", "Elasticsearch", "Golang"]
author = "Ram Gopinathan"
draft = false
date = 2018-05-24T21:00:00-07:00
title = "Dude where's my store? using geo distance search queries with Elasticsearch to provide store locator experience"

+++

In this post, I will walk through how we use geo distance search queries with Elasticsearch to provide "find a store" experience within our mobile application. Currently, the microservice that powers this experience in our mobile app is developed using Vert.x which is a Java based framework that is quite commonly used for developing microservices. We recently ported this service to a serverless application and decided to develop in golang.

## Interacting with Elasticsearch
Since we decided to develop the new services in golang, we needed a golang SDK to interact with Elasticsearch as we didn't want to write low-level REST/HTTP calls to Elasticsearch APIs.  With a bit of research on the interwebz, I came across two options, 

* Official [Elasticsearch SDK](https://github.com/elastic/go-elasticsearch) for go from Elasticsearch team 

* Third party [Elasticsearch SDK](https://olivere.github.io/elastic/) for go created by [Oliver Eilhard](https://github.com/olivere)

I ended up settling with the third party SDK mainly for reasons listed below:

1. Official GitHub repo for Elasticsearch Golang SDK doesn't seem to be under active development. We noticed open PRs from Sept of 2017 and 0 releases. It did not look like it's ready for any production workloads.

2. Design for the third party library seemed to be well thought out and clean, specifically the use of builder pattern. Resulting code written was much more readable and maintainable than dealing with JSON documents and low level REST API calls to Elasticsearch APIs.

## High level solution design
![](/img/storelocator.png?raw=true)

There are two primary components of the architecture diagram above

1. Indexer function accepts a CSV feed of all the stores and does an upsert into an Elasticsearch index. Indexer service also exposes some admin operations such as creation of index, deletion of index, etc.

2. Query function accepts a lat/lon value as well as radius and returns a list of stores.

### Indexer function
As mentioned before indexer service exposes admin operations such as creation of index as well as deleting indexes etc. Table below shows the REST endpoints for this service.

Path                         | Method | Description
--------------------         | ------ | ------------------
/1.0/admin/index             | POST   | Create a new index
/1.0/admin/index/{indexName} | DELETE | Delete index
/1.0/index/{indexName}       | PUT    | Add records in CSV file posted to elastic search index

<br />
To enable geo searches, we have to manually create the mapping and explicitly set the field mapping at the time of index creation. 

```go
const mapping = `
{
    "settings":{
        "number_of_shards": %v,
        "number_of_replicas": %v
    },
    "mappings":{
        "store":{
            "_source" : { "enabled" : true },
            "properties":{
                "location":{
                    "type":"geo_point"
                }
            }
        }
    }
}`
```
In the code above, you can see we are specifying the location field for store as geo point so that we can provide latitude/longitude pair at the time of indexing.

Using the Elasticsearch SDK for Golang, we create store locator index as shown in the code below

```go
exists, _ := p.client.IndexExists(indexName).Do(p.context)
if !exists {
    result, err := p.client.CreateIndex(indexName).
        BodyString(mapping).
        Pretty(true).
        Do(p.context)

    if err != nil {
        return err
    }
    log.Printf("Acknowledged : %v Shards Acknowledged : %v", result.Acknowledged, result.ShardsAcknowledged)
} else {
    return fmt.Errorf("Index %s already exists", indexName)
}
return nil
```

You can see in the code example above; we are checking to see if the index already exists before creating and using the BodyString method to specify additional index parameters that we discussed earlier.

For this post, we can use CURL To index store data feed in CSV file as shown below. 

```sh
curl -H "Content-Type: application/json"  -X PUT http://localhost:8080/1.0/index/storelocator --data-binary @20180509.StoreLocator.csv | jq
```

In the service, we first retrieve the index name. I'm using [gorilla/mux](https://github.com/gorilla/mux) package which implements a request router and dispatcher for matching incoming requests to its handler. We can retrieve the index name from path parameters as shown in the code below

```go
params := mux.Vars(r)
indexName := params["indexName"]
```

Next, we read the CSV payload, if there was an error reading we are merely returning HTTP BadRequest status code as shown in the code sample below

```go
defer r.Body.Close()
payload, err = ioutil.ReadAll(r.Body)
if err != nil {
    httpStatus = http.StatusBadRequest
    log.Printf("Error loading CSV payload from request %v", err)
    e = models.Error{
        Message: serverError,
    }
    goto done
}

```

Once we can successfully read CSV payload from request body, we use the [csv](https://golang.org/pkg/encoding/csv/) package to parse and index the store records as shown in the code below.

```sh
csvPayload := string(payload)
reader := csv.NewReader(strings.NewReader(csvPayload))

records, err := reader.ReadAll()
if err != nil {
    log.Fatal(err)
}

for i, record := range records {
    if i == 0 {
        continue //skip header
    }
    lat, _ := strconv.ParseFloat(record[15], 64)
    lon, _ := strconv.ParseFloat(record[16], 64)
    storeRecord := models.StoreRecord{
        StoreCode:       record[0],
        BusinessName:    record[1],
        Address1:        record[2],
        Address2:        record[3],
        City:            record[4],
        State:           record[5],
        PostalCode:      record[6],
        Country:         record[7],
        PrimaryPhone:    record[8],
        Website:         record[9],
        Description:     record[10],
        PaymentTypes:    getPaymentTypes(record[11]),
        PrimaryCategory: record[12],
        Photo:           record[13],
        Hours:           parseHours(record),
        Location: models.StoreLocation{
            Latitude:  lat,
            Longitude: lon,
        },
        SapID: record[17],
    }

    //for debugging
    storeJSON, _ := json.Marshal(storeRecord)
    log.Printf("Indexing Store Record %v", string(storeJSON))

    //index the doc
    result, err := p.client.Index().
        Index(indexName).
        Type("store").
        Id(record[0]).
        BodyJson(storeRecord).
        Do(p.context)
    if err != nil {
        log.Printf("Error adding store record for store code %s to index : %v", record[0], err)
    }
    log.Printf("Added store %s to index %s", result.Id, result.Index)
}
```

#### Additional considerations
With the above indexing mechanism, we can index about 5300 stores in about 20 seconds. Larger the file, you have to consider timeouts, etc. It would be a good practice to break the file down into smaller files and process them into separate requests.

### Query Function
This service handles store locator queries. Query requests include latitude, longitude and distance as parameter, service uses geo distance queries based on lat/lon and distance values passed in request and returns a collection of stores in response.

If you want to learn more about geo distance queries, head over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html) 

Here is what the actual query that gets sent to Elasticsearch instance looks like during a store locator query

```sh
curl -X POST \
  http://localhost:9200/storelocator/_search \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
        "bool": {
            "must": {
                "match_all": {}
            },
            "filter": {
                "geo_distance": {
                        "distance": "1km",
                        "location": {
                        "lat":  40.715,
                        "lon": -73.988
                    }
                }
            }
        }
    }
}'
```

With that in mind, it was quite easy to translate this into go code. Let's dig into this bit more detail.

First, we set up a geo distance query based on lat/lon and distance values from the request as shown in the sample code below

```go

gdq := elastic.NewGeoDistanceQuery("location").
    GeoPoint(elastic.GeoPointFromLatLon(request.Lat, request.Lon)).
    Distance(request.Radius)

```

Next, we set up a bool query and use the geo distance query that was set up in the previous step as a filter as shown in the code below

```go

bq := elastic.NewBoolQuery().
    Must(
        elastic.NewMatchAllQuery(),
    ).
    Filter(
        gdq,
    )

```

At this point, we can now execute the search against Elasticsearch instance as shown in the code below.

```go
results, err := p.client.Search(indexName).
        Query(bq).
        Pretty(true).
        From(0).
        Size(20).
        Do(p.context)
```

Assuming the search request was successful, we iterate through the results and deserialize the JSON to "StoreRecord" type and append to an array of "StoreRecord" objects to be returned to the caller as shown in the code below.

```go

if results.Hits.TotalHits > 0 {
    for _, hit := range results.Hits.Hits {
        var sr models.StoreRecord

        if err := json.Unmarshal(*hit.Source, &sr); err != nil {
            log.Printf("Error serializing hit source to StoreRecord %v", err)
            return nil, fmt.Errorf("Error serializing hit source to StoreRecord")
        }
        stores = append(stores, sr)
    }
}

```

So there you have it. Elasticsearch is awesome, and the Golang SDK makes building applications that leverage Elasticsearch much easier, the nice part about all of this is store locator queries are super performant, so everybody wins :)

Drop a comment or reach out to me via twitter or email if you have any questions.

Huge shout out to my boss [Tim Shelton](https://twitter.com/TimothyAShelton) who originally created the store locator APIs and also graciously agreeing to review this post and sharing his feedback. 

Thanks,
Ram