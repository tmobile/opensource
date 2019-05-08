
+++
date = "2018-03-01T12:12:54-08:00"
draft = false
title = "Serverless Development Challenges"
categories = ["resources"]
tags = ["jazz", "serverless", "tools", "devops", "faas", "cicd"]
author = "Deepu Sundaresan"
+++

This article describes the challenges I faced and my observations while designing and developing the Jazz framework.

Jazz is an application development framework for developing and managing serverless (aka FaaS) services. Jazz itself is built on top of Jazz and currently supports the best known FaaS implementation from AWS, ‘AWS Lambda’. Jazz started as an internal initiative in T-Mobile and is now available on github as an open source project.

You can check out Jazz here — [https://github.com/tmobile/jazz](https://github.com/tmobile/jazz)

My intention here is not to give a complete set of challenges when you do serverless development in general, but specific challenges that I faced as part of my Jazz development work.


## Achieving Simplicity

Serverless means…

* Absolutely no servers to provision and manage

* Ability to scale with usage

* Never pay for idle resources

* High availability and fault-tolerance built-in


Serverless simplifies the development and deployment of services with infrastructure resources that requires zero administration from development teams and your in-house infrastructure support teams.

What it means is that, as an application developer I do not need to worry about spinning up servers, installing runtimes and dependencies, managing deployment configurations and addressing other concerns like scaling, availability etc. which is kind of very cool! I have less components to manage and which means more time for me to focus on business logic and lower operational costs.

While looking at how Jazz evolved over a period which initially started as a simple application with a few stateless micro-services and a SPA UI app on the front-end, the entire process was superfast and very efficient in the beginning. This is the phase where I did not pay a lot of attention to cost and code optimizations. I developed AWS Lambda functions (just NodeJS code) and plugged it in API gateway — I was ready to go!

As I started developing more complex features in Jazz such as multi-environment support, configuration driven approach, module support etc., there was a need for creating an extensible framework which is easy to maintain, easy to unit test and troubleshoot at the same time optimized in terms of costs and performance. An enterprise application is not just a set of micro-services and SPA. It needs to be designed and architected properly just like in a traditional application development — to leverage FaaS simplicity and its pay-as-you-go cost benefits. It is very easy to end up paying more money than a traditional server based architecture if the application is not designed properly.

For example, even a trivial code optimization you make to improve the performance will have a direct impact to the operational costs. Based on the current charging scheme of all Serverless implementations, it only charges for the time your code gets executed (the granularity of it varies across vendors). If you optimize your lambda function to execute in 300ms down from 1 second, you get a 70% savings in costs immediately! This signifies the importance of how your application and every component in it should be designed to perfection in a Serverless world. And this applies to every Serverless resource we create and leverage!!

Check [this](https://www.youtube.com/watch?v=Xi_WrinvTnM) out to know more about several Serverless architectural patterns and best practices/recommendations from AWS.

## Security

Serverless is inherently multi-tenant which means that a single instance of a running service is used for serving multiple clients (And that’s how it’s cost effective). This strategy poses problems with security, stability or even performances.

AWS has recommendations specifically for securing APIs and addressing issues related to multitenancy. For example, employing a multi-account strategy would provide isolation between different client’s services or even different environments of the same service. This is again very vendor specific and so by using Serverless we give up control to these vendor implementations which can fail and be compromised.

You can check out the [video](https://www.youtube.com/watch?v=VZqG7HjT2AQ) from AWS reinvent sessions on how to implement authentication and authorization in your Serverless application.

As Jazz evolved, it needed to have its own security and ACL features. Designing and implementing ACL for Jazz has been a challenging task for us, considering we need to operate within the constraints of AWS specific implementations such as API gateway and resource limits constraints at account level etc.

## Optimizing Cost

As I mentioned earlier, using FaaS could be more expensive than a traditional server based architecture if not designed properly and if you do not make your choices correctly. Services that are being built using FaaS needs additional work to make them operationally ready and in fact we should be aware of where and how we deploy functions across regions, accounts etc. to develop a performing cost-effective solution. Designing a Serverless application which is secure and cost effective does require significant work than traditional application development.

## Vendor lock-in

This is another problem which we have never thought about while going with vendor specific Serverless technologies. FaaS is simpler to use but that comes with the cost of giving up control to vendor solutions and the resulting vendor lock-in. This lock-in would eventually come as unexpected costs, forced upgrades (could be expensive), system downtime (more operational costs) etc.

We are yet to see an open standard that defines how a serverless architecture should be. Now we have different vendors implementing Serverless platforms differently. So, in the future if you want to switch your solution to a different vendor (Google Cloud Functions or Microsoft Azure Functions), you will most probably need to migrate your code to use the new FaaS interface or you may need to change the design or architecture based on how the vendor implementation operates.

One way to alleviate this problem is to evolve a generic abstraction layer on top of multiple Serverless platforms or other vendor specific components that is being leveraged. Jazz currently uses the open source project [Serverless framework](https://serverless.com/) under the hood that makes it vendor neutral at least with respect to where and how the serverless functions are deployed. Also, it has a roadmap to develop abstraction layers for other components as well such as API Gateway, Kinesis streams, Monitoring etc.



## AWS Infrastructure limits


This is another major challenge we currently face while developing Jazz. Every resource has a limit set. For example, for AWS Lambda there is limit set for the maximum number of concurrent instances that can be run in an account. The same applies for every Serverless resource type being used such as API Gateway, S3 buckets etc.

Check [this](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html) out for AWS docs to know more about AWS service limits.

We have started to approach the default AWS limits for most of the services that the Jazz platform uses. Additionally, there are issues in the AWS Serverless infrastructure itself and it fails occasionally for reasons such as throttling of AWS resources, unknown internal resource limits, CLI bugs etc. AWS technical support teams have been available to us to help resolve the challenges. If the issue is related to service limits (soft limits), AWS provides an option to bump up the limits with a support ticket.

## Conclusion

Having said that, Jazz has a very impressive roadmap — Ability to deploy services in multiple accounts and regions, support for Serverless platforms like Azure & Google functions, support for additional application templates, security features & ACLs for fine-grained access control, CLI support etc.

I expect all the challenges mentioned above to be resolved as Serverless architectures mature further. Open-source based portable FaaS implementations such as [Apache OpenWhisk](https://openwhisk.apache.org/), [Kubeless](https://github.com/kubeless/kubeless) etc. are gaining momentum in the Serverless space. I’d would expect to see some standardization around these Serverless platforms in the future and it would be cool to be able to plug-in different integration components such as API Gateway, Apigee, S3, Kinesis or other based on vendor platform capability or specific use cases without modifying my service code or writing more abstraction layers.


Finally, to know more about open source **Jazz** framework, please do check out the below links and give it a try! Do not forget to send us your feedback!

Opensource repository: [https://github.com/tmobile/jazz](https://github.com/tmobile/jazz)

Wiki: [https://github.com/tmobile/jazz/wiki](https://github.com/tmobile/jazz/wiki)
