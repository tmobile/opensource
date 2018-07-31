+++
date = "2018-07-25T10:00:00-07:00"
draft = false
title = "Introducing Project Casquatch"
categories = ["resources"]
tags= ["oss", "t-mobile", "casquatch", "java"]
author = "Josh Turner"

+++

# Introducing Project Casquatch

At T-Mobile, we have been rapidly developing new applications on top of a micro-service architecture through a combination of Java and Cassandra, including all the latest and greatest technologies. This is great except that Cassandra pushes a significant amount of the performance tuning and high availability configuration from the database layer up to the application layer. This leads to a few problems for the enterpise as all these policies are individually implemented (or not) by each service and database availability is now out of central control, leaving each developer to implement as they see fit. Not to mention the level of knowledge a developer needs to have about the underlying database technology. This is just not scalable.

## Enter Project Casquatch.

Project Casquatch is a database abstraction layer with code generation designed to streamline Cassandra development. Out of the box it comes pre-tuned with high available policies including load balancing, geo-redundancy, connection pooling, etc, sitting on top of the Datastax driver using native APIs. All of this is abstracted behind the ever prevalent POJO. Instead of writing CQL, we utilize generic programming that allows you to simply pass a generated POJO to a save() method or populate with a getById().

## Implementation

Implementation with a Spring Boot application couldn’t be easier as the configuration class is prebuilt and annotated for auto wiring. If you don’t wish to use Spring then configure through a standard Builder pattern. Checkout the [README.md](https://github.com/tmobile/casquatch/blob/master/README.md) for a full breakdown.

To show you how easy it is to get going with Spring here are the basic steps:

Create an artifact for your data model using the included code generator through a simple shell script (Manual steps in [README.md](https://github.com/tmobile/casquatch/blob/master/README.md) if you don’t have bash):

```
./install.sh <KEYSPACE>
```
Copy and paste the maven artifacts into the pom
```
<dependency>
    <groupId>com.tmobile.opensource.casquatch</groupId>
    <artifactId>CassandraDriver</artifactId>
    <version>1.2-RELEASE</version>
</dependency>
<dependency>
    <groupId>com.tmobile.opensource.casquatch.<KEYSPACE></groupId>
    <artifactId>CassandraGenerator-Models-<KEYSPACE></artifactId>
    <version>1.2-RELEASE</version>
</dependency>
```

Add the configuration import in Application.java:
```
@Import(CassandraDriverSpringConfiguration.class)
```

Configure a couple application.properties (See [README.md#Configuration](https://github.com/tmobile/casquatch/blob/master/README.md#configuration)):
```
cassandraDriver.contactPoints=localhost
cassandraDriver.localDC=local
cassandraDriver.keyspace=<KEYSPACE>
```

Add an @Autowired variable to your controller:
```
@Autowired
private CassandraDriver db;
```

Then you are good to go. Checkout the [javadocs](https://tmobile.github.io/casquatch)



# Open Source Only – You Get It All

This project is being released with an open source only model which means there is no proprietary magic we are holding back. The code we are releasing today has been reported as used by national platforms including the activation of the Series 3 Apple Watch, T-Mobile Payments, Digits, and multiple others that are yet to be announced.

Project Casquatch, as open source project, is continuously evolving.  Please refer to your IT group to determine suitability for any production or critical needs. Cassandra is also open sourced under Apache License 2.0. Check out the project in  [Github](https://github.com/tmobile/casquatch/)  and this short [demo video](https://www.youtube.com/watch?v=XNVZFzTsM04).

Apple is a trademark of Apple Inc.  T-Mobile and Digits  are trademarks of T-Mobile US.

