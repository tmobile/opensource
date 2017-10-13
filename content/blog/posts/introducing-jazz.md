+++
date = "2017-10-13T01:59:28-07:00"
draft = false
title = "Introducing Jazz: T-Mobile’s Serverless Development Platform"
categories = ["resources"]
tags = ["tools", "serverless", "cicd"]
author = "Satish Malireddi" 
 
+++

Ship production code with confidence to FaaS platforms & more!

*****

Serverless is fascinating! No server setup, no failover management, no scaling
issues, no infrastructure operations — Just the code! We’ll not get into the
definitions, benefits, serverless trends etc — lots of great speakers, authors
and writers have shared their excitement around serverless and a simple google
search can answer most of the basic questions around serverless. Instead, we’ll
focus on the serverless story in our organization, observations, learnings & the
work we have been doing in this space.

We have been thinking serverless at T-Mobile too! Our serverless journey began
after re:Invent ’15 showcased few exciting usecases with AWS Lambda and other
serverless services in AWS. We, cloud team at T-Mobile, identified couple of use
cases that fit very well with event-driven computing model to understand Lambda
and find the hidden gems. As expected, implementations for both these use cases
(just code!) are working perfectly well till date and costing us under $10
compared to thousands if we have used EC2 instances to host them instead. We
have started observing patterns where developers are taking serverless first
approach; all new services are being built in serverless fashion unless there is
an obvious reason not to go serverless. This is paving the way towards building
next generation infrastructure that is *application first* rather than building
applications that conform to the infrastructure that was built already.

Not just the cost factor, the idea of not managing servers running these
applications, built-in scaling, high availability, resiliency (and more) excited
us and we have started building complex event-driven applications. We have seen
developers writing more and more of these ‘Lambda’ functions, creating ‘API
Gateway’ endpoints, ‘DynamoDB’ tables etc. which is when we have started seeing
*‘service sprawl’*. Service discovery became harder. There was no auditability.
Cost control and security guardrails were not in place. Developers weren’t able
to monitor their services easily, getting to their service logs was getting
difficult, lack of continuous integration started increasing the time to market
for their features. Overall, gaps within the existing serverless tooling was
clearly felt and understood.

Let’s dive into few of these developer pain points in more detail; this is
important because some of these led to teams questioning the readiness of
serverless services for enterprise adoption.

1.  *New Tools*: While serverless promised the notion of ‘writing code and forget
everything else’, using these serverless services is not straightforward. Code
once ready has to be deployed into serverless infrastructure which should be
provisioned using cli/api or new serverless deployment tools. Each of these
tools requires developers to understand how they work and sometimes require
changes to their application which is not appreciated by the application
developers.
1.  *CI/CD*: Most of the available serverless deployment tools
(open-source/commercial) addresses major concerns related to easier/faster
development and deployment. However, integrating those with existing enterprise
CI/CD tooling is required to comply with the enterprise standards. This resulted
in more platform integration work for developers instead of focusing on their
application.
1.  *Monitoring & Logging*: Cloud providers have their own implementations to
support monitoring & logging. Developers always wanted an easier and quicker
access to their application logs preferably at a location that they are already
comfortable with (typically Splunk, Elasticsearch etc. within enterprises).
While it is not impossible, developers have to spend good amount of time to
understand and configure these details themselves. This is not considering the
fact that cloud providers do change (frequently) lower level details on how they
implement logging (log formats for example).
1.  *Security*: While building APIs in 2 minutes appear exciting, today’s serverless
service implementations like AWS API Gateway may leave us with a greater exposed
attack surface. Adding the security controls is required before we build a
production grade serverless application using these services. Continuous
compliance should be enforced to ensure services are always secure. Leaving
these details to developers might leave the surface open for attacks.
1.  *Multi Cloud*: Most of these pain points multiply when developers want to use
more than one cloud providers to host their applications built using serverless
architectures. In fact, these are not easy problems to solve even when they try
to use multiple accounts within a single cloud provider alone (in case of AWS).
1.  *DRY*: All in all, when developers started writing these smallest components of
their applications — now called functions — sharing best practices within teams
implementing decoupled services just got more difficult which led to
duplication.

We spoke with various serverless enthusiasts across the organization (and
outside) to discuss these gaps. What developers needed was an easier way for
them to create, deploy, manage (serverless) services with monitoring,
centralizing logging, stricter security guardrails and complete visibility on
the spend. We wanted application developers to truly focus on their application
— their code only — and leave all other issues discussed above to a platform
that can solve these pain points for them.

> Jazz to the rescue!

Jazz allows developers to seamlessly create, deploy, manage, monitor & debug
cloud native applications leveraging serverless services. Jazz helps developers
focus on code only and solves most of the operational issues around
deployment/management. Jazz provides cleaner reusable code templates with all
the best practices embedded into them providing the required quick start for
developers. With code commits triggering workflows to do rest of the action, a
suite of operational tools built into Jazz helps developers securely manage
code, configurations and deployments for their cloud native applications. Jazz
comes with CI/CD by default so that all the manual, error-prone build and
deployment work is completely automated resulting in high quality software with
continuous integration, automated tests, code metrics etc. It helps developers
focus on continuous code quality & find vulnerabilities in the code before the
code goes live! We have started identifying patterns for type of cloud native
applications that developers started building and created reusable code
templates for these service patterns (APIs, functions, static websites,
workflows etc.) so that they can get going in seconds. Pay-per-use makes
serverless applications appear insanely cheap. Jazz helps developers to see
their spending trend on a per service and environment basis so that they avoid
billing mishaps that are not uncommon. This immensely helps developers with not
much experience in server management and administration to focus on their code
and deliver value to their business. More about Jazz’s architecture will be
discussed in the future posts.

Jazz comes with a beautiful user interface for developers to easily create &
manage their services (Jazz supports APIs, Functions & Static Websites as of
now). Today, Jazz is helping our developers within T-Mobile build production
ready applications based on event driven architectures in minutes!

*****

Jazz is open-sourced & you can take it for a spin starting now! Get started with
jazz-installer which is available
[here](https://github.com/tmobile/jazz-installer) and do not forget to leave us
feedback!
