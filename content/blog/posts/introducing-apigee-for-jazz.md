+++
date = "2018-09-18T01:59:28-07:00"
draft = false
title = "Introducing Apigee API Gateway for T-Mobile's Jazz Serverless Development Platform"
categories = ["Resources", "Apigee"]
tags = ["Apigee", "Jazz", "API", "Serverless", "FaaS", "AWS Lambda", "RESTful"]
author = "Mudit Purwar"

+++

We are thrilled to announce that serverless (aka FaaS) developers now have a choice to expose their serverless functions as RESTful APIs from within the Jazz serverless development platform at a click of a button. If you are not aware of T-Mobile's Jazz Serverless Development Platform, you can check it out on [Github](https://github.com/tmobile/jazz).

With this integration, Jazz developers will have an option to choose between multiple API Gateway providers for their serverless functions - APIGEE & AWS API Gateway depending on their business needs & their enterprise compliance requirements. Choice is always necessary as we learned this internally at T-Mobile with our serverless development challenges. Some of the challenges our development teams encountered echoed serverless industry wide problems like :

* Security
* Multi-Tenancy
* Vendor Lock-in
* Infrastructure Limits

## What does Apigee integration bring for Jazz developers ?

Apigee's integration with Jazz brings all the robust capabilities of the Apigee API gateway platform like key validation, quota management, transformation, authorization, and access control as out-of-the-box policies, all pre-built from within the Jazz serverless platform. This integration simplifies the life of Jazz developers who just want to write the FaaS code and get their API endpoint with all the security features inbuilt, to provide it to their customer for consumption.

## Typical Integration Approach

A simple flow to access the AWS Lambda function from Apigee would need to include AWS SDK as a resource in every API Proxy that you deploy to expose your Lambda function. Its not scalable at enterprise level, as it can eat  up chunk of system resources on the Apigee run time components impacting the performance of the other APIs sharing the API platform. Also you would need to store the AWS credentials safely for each and every API Proxy that needs to talk to the AWS Lambda function.

![](/img/Google-Apigee.png?raw=true)


## Our Approach

In pursuit of performance and scalability, we came up with an integration framework for enterprise needs. Instead of installing the AWS SDK with every API Proxy for each Lambda function, we created a single Common API proxy which which acts as an interface (written in Node.js) with Common AWS Lambda Function. We leveraged the Proxy Chaining feature of Apigee to chain the individual functional API Proxies (Created for AWS Lambda Functions) to the Common API Proxy. Common API Proxy written in Node.js retrieves and injects the AWS Access Key and Access Secret at runtime from the encrypted KVM within Apigee and constructs the request object to be sent to the Common Lambda function as an event.  Common Lambda function on the AWS side then unmarshals the object to read the functional Lambda name attribute and other attributes to construct a new event for the functional Lambda function call. Common Lambda function assumes a pre-defined IAM role for execution of Lambda functions and  invokes the user specific function.

![](/img/Apigee-Jazz-Int.png#center)

## Benefits

With the realization that our dedication and hard work will bear fruitful results at the end of few grilling development sprints, our self realization came to life and we had our deja vu moment when we achieved the following:

* *Standardization of security in APIs :* We embedded some of the industry wide standard security protection by default in each and every API that is built through Jazz platform with Apigee's out-of-box policies like the JSON Threat Protection, XML Threat Protection, Access Control, OAuth, etc.

* *Traffic Management within APIs :* In addition to the security, we also embedded few traffic management policies like the Quota, Spike Arrest, etc. by default through our API build process.

* *Analytics for the APIs :* Apigee API Platform provides a very robust analytics capabilities for complete API lifecycle. Some of the data points captured within the analytics are the API Proxy performance, Target endpoint performance, Latency and Error Code analysis from the API perspective. It also captures data points for the API users engagement and traffic composition of the API consumption.

* *Simplicity for Developers :* Since Jazz users are already familiar with Jazz's user intuitive and simple UI, we provided another radio button to select Apigee API Gateway. Jazz user does not need to know the API proxy code if he or she does not wish to.

* *Overcome limitations of other API Gateway platforms :* Some of AWS API Gateway's innate restrictions like the limits on resource usage, throttle on # deployments, etc. were eliminated as Apigee API gateway does not present similar restrictions.

* *Scalability :* Apigee is a multi-component platform and the API run time components being horizontally scalable. Its pretty robust in scaling up or down based on the API traffic.

* *Agility :* Jazz user at the end of complete serverless development orchestration (few mins) takes away an Apigee API Endpoint to provide it to her/his service customer for consumption.

## Future Optimizations

We strongly believe in providing choices to the Jazz users community internally as well as externally, Apigee + Jazz integration is an effort of that strong belief. We are not stopping here as we work towards providing more options by integrating with other FaaS providers like Microsoft Azure Functions & Google Cloud Functions. Also in the product roadmap are providing  optional features like the OAuth, Basic Auth, JWT Auth, etc. if the user wants to opt in for them. Stay tuned.

Learn more about Apigee API Gateway for T-Mobile's Jazz Serverless Development Platform [here](https://github.com/tmobile/jazz/).

Thanks to Satish Malireddi, Mike Merrell & Siddharth Vidhani for their valuable contribution to this project.

*****
