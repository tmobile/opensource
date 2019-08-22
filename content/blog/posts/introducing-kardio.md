
+++
tags = ["oss", "t-mobile", "kardio", "telemetry", "health"]
categories = ["resources"]
author = "Amreth Chandrasehar"
draft = true
date = 2017-10-17T13:19:22-07:00
title = "Introducing Kardio"

+++

![kardio-logo](/themes/tmo-oss-theme/static/blog/introducing-kardio/logo.png#center)


Containers, Kubernetes and Health Checks for the Win! With the massive adoption of containers, many large enterprises as well as startups embracing containers in their application architecture patterns. With this huge growth, we have new challenges to monitor 1000’s of containers running in 10’s and 100’s of Container Platforms such as Kubernetes. 

There are many APM (Application Performance Management) products that provide end to end monitoring of application services. However, it can be complicated to build dashboards to get simple status of these services. Often times, a custom script is required to get status of services deployed on Kubernetes. We wanted to keep that simple!

## Introducing Kardio - Health Check tool for Services running on Kubernetes. 

Kardio is a simple tool that can be configured to perform health checks on any endpoint. Kardio has a rich UI showing status and availability based on responses from REST endpoints, TCP ports, etc. It is also integrated with Slack and email for alerting.

At T-Mobile, USA, Inc. we run several massive multi-tenant Container Orchestration platforms and these platforms rely on monitoring tools such as Prometheus, Grafana, etc. A status check system that is standalone and is independent of the primary monitoring stack was required in the event of degraded performance in any part of the primary monitoring system. We started Kardio as a simple status UI for services on our platforms, and later added more features as our platforms grew and adopted Kubernetes.

![kardio-dashboard](/themes/tmo-oss-theme/static/blog/introducing-kardio/dashboard.png#center)

*Screenshot of Kardio - Dashboard Page*

Features
The Kardio home page has a responsive user interface and displays below features:

* *Counters:*
    Display Total Transactions (http requests), Current Requests per Second, Total Containers Run, Current Running Containers, Number of services running and Uptime in percentage on all clusters individually and combined.

    *Application components* list the applications deployed in the environment, and the number of services and containers running for each application.

    *Service Component* lists provide platform information and real-time data of each service if available in Prometheus.


* *Dashboard:*
    All services deployed in a cluster will be visible by environments and region. 

* *History:*
    The History page displays the service history of the application components and platform components in an environment for seven consecutive days prior to the current date. Application component history includes the application status history as well as the API status history. Any service that has undergone service degradation or service disruption are highlighted. The history lists are searchable.

* *API Dashboard:*
    Trend of Services, Containers, RPS and Latency over period of time will be displayed in a graph. Filters based on Platform, Environment, Application will be displayed with an option to export the graph in PDF file. 

* *Admin Console:*
    Authentication is based on LDAP and admins will have ability to add/modify/delete Counters, Environments and Messages. Admins can add any endpoints to monitor and also to alert users, include release notifications on top of each environments as well.

    Logged in users have the ability to add messages per service to explain any outages. Announcements and release dates can be posted at the dashboard level or per environment separately for application services and platform services. 

* *Availability and health history:*
    The service list shows the maximum latency period and region-wide availability percentage (during the current day/month/year) and health status of each resource. Any service with state changes in the last 24 hours is highlighted, and contains a icon to provide detailed messages associated with the state changes. Users can click the icon to view the health history for up to 7 days prior to the current date.

* *Alerts and Subscriptions:*
    Kardio supports email and Slack alerts on health check failures for any service. Users can subscribe to status change alerts via email or Slack by clicking Subscribe for a specific service in the list. After subscribing, the user receives a validation email. The alert system is activated once the user completes the validation process.

* *Searching and sorting:*
    The service list can be searched and sorted. The search feature enables users to easily search for a specific application, service or component in a list.

* *High Availability:*
    Kardio supports a High Availability (HA) mode with a two-node cluster in active-passive configuration. The HA mode is designed to work across multiple regions if required.

* *Multi-Region/Multi Environment Support:*
    Kardio has the capability to run on multiple Regions. The Kardio dashboard displays data for every available Environment/Region. 

* *RBAC:*
    Kardio allows access to the dashboard pages without authentication. The admin pages and edits on the dashboard are protected by authentication using LDAP integration.



Below is the Architecture Diagram of Kardio:

![kardio-architecture](/themes/tmo-oss-theme/static/blog/introducing-kardio/architecture.png#center)


Upcoming features…

We initially started with a simple theme of just showing the list of services by status and then started adding many other features. We always wanted to take it back to the root of providing a simple page with for status of all services, this is a planned in the future. 
Along with a new Home page, an export functionality of API dashboard services and Sharable links for service status are also planned.
More details on these will be shared soon. PR’s, Contribution are welcome!

*****

*(Note: Kardio is open-sourced under the terms of the Apache 2.0 license and is released AS-IS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND pursuant to Section 7 of the Apache 2.0 license.)*

Please check more on Kardio @ [GitHub](https://github.com/tmobile/kardio).
