+++
date = "2019-03-11T10:00:00-07:00"
draft = false
title = "Introducing Codeless: T-Mobile’s Take on Test Automation Frameworks"
categories = ["resources", "framework", "automation"]
tags= ["oss", "t-mobile", "test", "automation", "framework"]
author = "Rob Graff"

+++
Reliable, maintainable test automation, delivered by anyone.

Continuous Delivery drives towards faster time to market which in turns
demands new code to be tested and verified at high speed. For many
years, QA and development teams have leveraged test automation tools to
allow more tests to be run in a shorter amount of time. However, some
teams may not have enough runway to build test automation "SDET"
skillsets to meet demanding release timeline.

In order to gain the most value from an automated test suite, teams look
for automation frameworks that allow tests to be created quickly and
maintained easily, with minimal effort required. T-Mobile has developed
the Codeless Automation Framework with this goal in mind. Built on
leading opensource test frameworks, i.e., Selenium and REST Assured,
Codeless lets users creates tests in Excel format, alleviating the
learning curve of authoring tests found in Selenium and REST Assured
frameworks. By building the abstraction layer on top of Selenium and
REST Assured, Codeless allows users to mix UI and API in the same test
case -- this is not something that can easily be done by writing code on
those frameworks.

Codeless allows anyone in the organization to rapidly stand up and
manage large test suites, by leveraging the following principals:

-   Providing a simple keyword-driven language that is easy to use, yet
    powerful enough to meet any testing needs

-   Utilizing reusable model artifacts to form the foundation of
    tests

-   Taking a smart, layered approach to test data management

**Configurable UI Actions -- Simple to Use & Powerful to Expand**

Automating web UIs can be finicky at times. One link responds correctly
to a simple selenium click command, while another link may fail, and
require a JavaScript snippet or keyboard command to produce the desired
result. Waiting strategies to handle low performance pages, and
asynchronous operations need to be configured to the application under
test. Codeless streamlines these configurations, by allowing selenium
actions to be fine-tined at an application level, via simple property
configuration. At a test step level, these configurations can be
overridden to handle specific selenium steps that might require more
waiting, or a unique action strategy.

**Reusable Test Objects -- Leverage Existing Assets**

API First development practices have led to increased usage of service
definition files, such as swagger files. Codeless provides support to
leverage existing API specs while creating and executing test cases.
Service calls are built directly on top of the model Swagger defines,
requiring the tester to only provide the data inputs for their
transaction.

For web application testing, Page Object Patterns have long been used in
supporting selenium based automation. Codeless allows full page objects
to be defined as simple YAML files, creating a single source of truth
for UI control locators that are reused across all test cases.

**Layered Data Inputs -- Minimize Effort**

Defining test data inputs for multiple test scenarios becomes a
cumbersome, time consuming task. Codeless less takes a layered approach
to test data definitions, allowing default data values to be embedded
within the application model itself. Individual test steps can then
modify the default inputs as required for that specific test case. At
runtime, environment and system properties can be invoked to pass
execution specific inputs, such as service host locations, or user
credentials.

**Extendable Functionality -- Customize Your Result**

Different teams have different framework requirements. Codeless supports
java-based plugins to be hooked into the lifecycle of the core framework
execution, providing additional functionality on top of the core
offering. A simple plugin can be configured to push your team's test
results to a custom reporting service, or pull environment-based test
data from a custom TDM source, to be made available to your test during
runtime.

**The Future**

-   Database interaction support, for test data setup and system
    validation

-   WSDL support for modeling SOAP based services

-   Data Driven Testing support

Rapid test development, and reduced maintenance effort are the pillars
of T-Mobile's Codeless Automation Framework. With the above feature
enhancements, and many more planned, codeless will enable simple test
automation delivery for an ever-increasing number of scenarios. The
Codeless Team welcomes your feedback, and ideas on how to simplify the
automation delivery requirements for your team and applications.

Learn more and contribute on GitHub -- code
(<https://github.com/tmobile/codeless>) and wiki
(<https://github.com/tmobile/codeless/wiki>).

Click [here](https://web.microsoftstream.com/video/4822f8a4-9efa-481d-b13c-4e8116ee80a3) to watch the video.  

_“T-Mobile has made every reasonable effort to test the code for its purposes.  However, there are a wide range of platforms and contexts that the code may be used for.  Accordingly, it is likely you will have to modify the code.  Please have your IT team validate the code prior to any production use.”_
