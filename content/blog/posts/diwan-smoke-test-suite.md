
+++

tags = ["cf", "pcf", "cloud foundry", "pivotal", "monitoring", "platform", "workflow", "pipeline", "operations", "configuration", "scale", "continuous", "tests", "smoke", "Splunk", "InfluxDB", "Elasticsearch", "Hashicorp Vault", "Concourse"]
categories = ["Resources", "Opensource"]
author = "Piyush Diwan"
draft = false
date =  2020-05-28T05:59:21-04:00
title = "Monitoring Cloud Foundry at Scale with cf-smoke-tests suite"

+++


T-Mobile runs Pivotal Cloud Foundry platform at a very large scale (≈100K application instances!),
with a wide range of applications from across the organization spanning finance, payments, retail,
and customer care. Monitoring such a large-scale Cloud Foundry environment is super challenging,
yet mission-critical, for running the business operations seamlessly. We need to not only monitor
important platform KPIs, but also the most frequently exercised workflows involving critical
platform components and services. The platform-engineering team at T-Mobile have developed
[a suite of customized smoke-tests](https://github.com/tmobile/cf-smoke-tests) to address the
observability of critical workflows, and to ensure swift real-time identification of problems
before they impact the platform applications.


## Where Did We Start?


Our journey started with the open-source community. They provided smoke-tests that were aimed at
monitoring specific platform services. However, we found a few gaps that restricted us from using
those tests at the scale we need. For example, inadequate and unreliable clean-ups resulted in high
volume of resource wastage. Execution of high-privilege, yet, non-essential operations during
test runs posed security risks, as well as wasted time and resources. Frequent
upstream changes caused failures in our pipelines, and compromised the reliability of the tests.
The lack of a unified framework to deploy and run the tests on multiple foundations on a
continuous basis introduced operational overhead. To address these gaps, and other use-cases
unique to our environment, we attempted to build a customized
[suite of pipelines, configuration, scripts, and sample-apps](https://github.com/tmobile/cf-smoke-tests)
to monitor our platform components and services.


## What Does Our Solution Offer?


We designed a solution keeping __reliability__, __accuracy__, and __maintainability__ in the
center of our focus. We wanted to ensure that a failure of a smoke-test run indicated a legitimate
problem in a foundation by eliminating false positive alerts. With our flexible plug-n-play
framework, and reusable libraries, onboarding new foundations or adding new smoke-tests is lean in
terms of time and efforts required. To complete our observability suite, we added capabilities
around visualization, alerting, and retention of historical information by integrating our
smoke-tests suite with monitoring platforms like Splunk, InfluxDB, and Elasticsearch. The
metrics emitted by the smoke-tests, and stored in these metrics-platforms, showed all critical
operations carried out by each of the smoke-test runs in easy-to-read dashboards and actionable
alerts.


## What Are the Core Components?


The smoke-tests suite is comprised of the following components:
 1. __Pipelines__:
      1. __Bootstrap-pipeline__: Deploys a separate instance of the smoke-tests-pipeline for every
    foundation.
      2. __Smoke-tests-pipeline__: Runs all the smoke-tests jobs for a single foundation.
 2. __Environment Configurations__: Common and foundation-specific configurations parameters
 available to the pipelines as environment variables.
 3. __Smoke-Tests scripts and libraries__: Shared libraries and scripts for each specific
 smoke-test that run the workflows and report results to a metrics store.
 4. __Sample-Apps__: Simple, lightweight, dedicated apps to be used by specific smoke-tests as
 part of exercising the end-to-end user workflows.


## How Does Deployment Work?


The following diagram depicts the deployment approach we have followed. Here, each Concourse
deployment is dedicated to a specific hardware region, and has Concourse teams dedicated to each
specific CF foundation. This hierarchy can be different for each organization. Any such deployment
approach only needs to be reflected in foundation-specific configuration files, so that the
bootstrap pipeline knows where to deploy the smoke-test pipeline for a specific foundation. The
pipeline monitors the Git repo as a resource, and on change to the repo, deploys the smoke-test
pipeline for each foundation. The smoke-test pipeline contains the test jobs dedicated to
specific services or components. Each of those jobs can be configured to run at a different
frequency, based on how much time each run of job would take. We used __Hashicorp Vault__ as a secret
management tool for both bootstrap and smoke-test pipelines, to fetch the secret parameters
that are not defined in environment config files. All such parameters were stored at a Vault path
that is accessible to the corresponding pipelines running in Concourse. There are other
alternatives to Vault that can integrate with Concourse.

![Workflow diagram showing how Git, Concourse, CF foundation, and Hashicorp Vault work together in both the bootstrap and smoke-test pipelines](/blog/diwan-cf-smoke-test-suite/diagram1.png#center)


## How Do Smoke-Tests Work?


Spring-Cloud-Services are among the most frequently used services offered on Cloud Foundry platform.
To understand the workflow of the smoke-tests in this suite, lets dive into the smoke-test for SCS
suite. The following diagram depicts the end-to-end workflow of the SCS smoke-test. This smoke-test
executes the entire lifecycle of a typical Spring-boot application that leverages SCS suite of
services. It starts with logging-in to a `foundation/org/space` and creating all the service-instances.
Then, sample spring-boot applications are pushed and bound to all the service-instances. Once the
applications start and are ready to receive traffic, the smoke-test hits various application endpoints to
validate the functionalities delivered by the app and the SCS services. Finally, the test performs
all the necessary clean-ups, and reports results of every operation as a separate metric to the
metric-store of choice. All the other smoke-tests in this suite also execute similar workflows with
the necessary customizations around the services they intend to test.

![Workflow diagram showing a single smoke-test lifecycle.](/blog/diwan-cf-smoke-test-suite/diagram2.png#center)


## How Does Reporting Work?


This suite offers library functions to report results of every run of all the critical smoke-test
operations as individual metrics with necessary tags. These metrics can be shipped to a choice of
metric stores via these functions. This gives the ability to the platform operators to create
dashboards and alerts for real-time monitoring on at-scale CF deployments. The alerts can be
triggered on consecutive failures of any operation that the operators want to monitor. Similarly,
dashboards can be set up to show continuously failing smoke-tests on a foundation with a link to
the most recently failed concourse job where the detailed logs can be viewed. All the necessary
datapoints are available for holistic dashboards that include all passed and failed smoke-tests
on each foundation.


## Summary


T-Mobile's Platform-Engineering team uses these smoke-tests to monitor the CF deployments hosting
thousands of applications. These tests continue to help our operators get the real-time health
information of platform components and services, and take actions to mitigate the issues before
they impact the hosted applications. They have been particularly invaluable during
platform-upgrades (when the state of the components is unstable), as well as new phone launches,
and retail seasons (when traffic to hosted applications is tremendously high). These tests have
helped identify issues with critical platform components such as auto-scaler, logging-service,
spring-cloud-services broker, cloud-cache service broker, and almost all the other components
that come under the scope of these tests. We hope that the CF community also reaps the benefits
of these smoke-tests, and help strengthening the tests in future through contributions to the repo.


## Resources


 - [Github repository for cf-smoke-tests](https://github.com/tmobile/cf-smoke-tests)
 - [Video of Piyush introducing the suite to Cloud Foundry Community Advisory Board](https://youtu.be/2_-cQub8IzM?t=1405)
