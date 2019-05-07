
---
tags : ["oss", "t-mobile", "aws", "cloud foundry", "chaos engineering", "chaos-tool-kit", "cf-app-blocker", "pivotal cloud foundry", "pcf app blocker", "turbulence"]
categories : ["resources"]
author : "Matthew Conover & Karun Chennuri"
draft : false
date : 2018-09-13T17:10:22-07:00
title : "The Start of Chaos Engineering at T-Mobile"

---

# Overview

At T-Mobile, we have been making a large push toward cloud infrastructures. Through this process, we have been taking large monoliths from the past and breaking them into a series of microservices. This allows us to easily scale parts of services which are overloaded with requests and to increase the redundancy of our systems by having backups ready to go in the event one of them crashes or the hosting hardware has issues.

We are already seeing benefits from migrating to the cloud, and we are ready to take the next steps to ensure our customers get the best possible experience. To take our services to the next level, we want to start breaking things to make them better! Don't get me wrong, this can be just as much fun as it sounds, but it is also an important method of finding complicated dependency bugs which can cause downtime in production.

In short: The real-world is not perfect. So when our developers are developing and testing their code in near-perfect sandbox environments, they can find and fix issues with code logic, but not issues regarding assumptions made about the underlying hardware. The illusion we construct with cloud abstractions shatters when things go wrong and these assumptions are at the forefront of failure. We want&mdash;no&mdash;we need to be ready for failures because they will happen without fail.

By breaking things on purpose, we can find false assumptions which were made while both minimizing the impact to our customers and preventing future downtime.

# Chaos Engineering

Enter Chaos Engineering. Now, the first thing I thought when I heard the name is that it is random. Chaos tends to be disordered&mdash;so it is a logical conclusion&mdash;but it is **not** random!

While it would be amusing to the people who do not have to fix things if we just started unplugging cords in our datacenter like a pack of rampant bonobos high on energy drinks, we want to provide the developers useful feedback about how their application performs in a specific set of circumstances. Thus, Chaos Engineering is about the **targeted injection of failures** into a complex system which leads to very-difficult-to-predict results.

For us "Chaos" referrers to how the slightest variation in the initial state can yield a very different outcome such as in Chaos Theory. Think of Dr. Ian Malcolm from *Jurassic Park* declaring inevitable doom from the beginning because he knew that it only takes a slight deviation from the normal operating state to cause a series of cascading failures.

With an experiment, we can assess how the system performs, and then make changes as needed to the code to build in resilience to a specific type of failure. If resilience is then built and verified for every network call in an application, the system as a whole will no longer be at risk of a small error propagating up the line and causing an outage.

Chaos Engineering was originally developed at Netflix in 2010 after migrating to AWS as a way to verify their service could handle the loss of an instance without any downtime. Netflix's approach was to develop the [Simian Army](https://medium.com/netflix-techblog/the-netflix-simian-army-16e57fbab116) which provided a way to simulate an AWS instance going down and other hardware-level issues which can bleed-through to the customer experience. Netflix went so far as to create Chaos Gorilla which simulates entire AWS availability zone failing.

As a rule, the more assumptions we make about what will work, the more we open ourselves up to failures.

At Netflix, infrastructure tests such as taking down an instance, simulating CPU load, or network latency all work for testing how their overall service performs. Netflix is a single-application company, and is designed on a lower-level platform (IaaS). If they take down an instance, they know exactly what microservice they are impacting, and if something breaks, they know where to look on their website to see if or how the customer is affected.

At T-Mobile, if we target the VMs, we could affect more than a dozen different microservices hosted in our cloud because we are built on Cloud Foundry (PaaS). While it remains important to be resilient to infrastructure issues, our testing needs to be more precise.

# Introducing CFBlocker for Chaos Toolkit

Our goal, was to be able to take an organization name, space name, and application name in our Cloud Foundry environment, and then block either access to that application, or that application's access to one or more of its bound services.

## Early Work With Turbulence

We started off experimenting with Turbulence as a way to perform experiments, however, it is infrastructure oriented. Working with Turbulence offered valuable experience regarding where we should focus our attacks, and how we should go about application targeted attacks.

```ascii
+----------------------------------------------------------------------------------------------------+
|Bosh-Lite VM                                                                                        |
|      +--------------------------------------------------------+                                    |       +--------------------------------------+
|     +-------------------------------------------------------+ |         +-----------------------+  |       |Web-Browser                           |
|     |Diego-Cell(s)                                          | |         |Router                 |  |       |                                      |
|     |                                                       | |         |        +----------+   |  |       |  http://spring-music.bosh-lite.com   |
|     |    +------------------------------+                   | |         |        |config.yml|   |  |       |                                      |
|     |   +-----------------------------+ |                   | |         |        +----------+   |  |       |                                      |
|     |   |Container(s)                 | |  App Container IP | |         | Config has app        |  |       +--------+-----------------------------+
|     |   |                   +-------+ | |  /var/vcap/data/\ | |         |           ip and port |  |                |
|     |   |      app listens +--------| | |  container-\      | |         |  +--------------+     |  |                |
|     |   |     +------------>App(s) ++ | |  metadata/\a/\    | |         +--+wfukcl2kg5q7-1+-----+  |                |
|     |   |     | to port    +-------+  | |  store.json       | |            +-^-+----------+        |                | DNS:
|     |   |     |                       | |                   | |              | |                   |                | bosh-lite.com+---+
|     |   |  +--+-+                     +-+                   | |              | |192.144.0.143:61000 |                |   192.144.0.34:80<+
|     |   +--+eth0+---------------------+                     | |              | +-----------------+ |                |
|     |      +--^-+                                           | |              |                   | |                | Host Routes to Bosh-Lite VM
|     |         |   192.150.15.11:8080   192.144.0.143:61000    | |              |                   | |                | 192.144.0.0/16 -> 192.168.50.4
|     |         +--------------------+  +------+              | |              |                   | |                |
|     |                              |  |      |              | |              |                   | |                |
|     |                         +----+--v-+  +-+------------+ +-+              |                   | |                | VM IP: 192.168.50.4:80
|     +-------------------------+s-0102...+--+wfukcl2kg5qa-1+-+                |          +--------v-+---+            |
|                               +---------+  +----------^---+                  |        +-+wfukcl2kg5qa-0|            |
|                                                       |                      |        | +----------+---+            |
|                                                       +-------------------------------+            |                |
|  App ID:        cf app $APP_NAME --guid                192.144.0.143:61000    |          +----------+---+            |
|  Diego-Cell IP: cf curl /v2/apps/$APP_ID/stats                               +----------+wfukcl2kg5q7-0|            |
|  Diego-Cell ID: bosh vms | grep $DC_IP                                    192.144.0.34:80+----^-----+---+            |
|                                                                                              |     |                |
|                                                                                              |    ++---+            |
|                                             192.144.0.34                                      +----+eth1<------------+
|                                             router-0.node.dc1.cf.internal           192.144.0.34:80++---+
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

The above diagram is the result of research into packet-flow when the sample application [spring-music](https://github.com/cloudfoundry-samples/spring-music) is configured in Cloud Foundry running on Bosh-Lite. Our realization was that we could target specific applications without needing to have developers include a library by simply blocking the communication from the container to its silk network interface. This means all we have to do is add iptables rules to the diego-cells which block traffic to the specific container IP the application is hosted in.

## How to Block a Cloud Foundry Application (The Hard Way)

Let's go ahead and walk through the steps used to find where the application is hosted, what services it is bound to, and then create rules to block its access to a bound service (in this case mysql).

1. Login to your BOSH director as an admin.  
    `bosh -e <envname> login`

2. Login to Cloud Foundry; you do not need to be an admin, but you do need access to the organization and space the app is located in.  
    `cf login`

3. Target the Cloud Foundry organization and space the application is hosted in.  
    `cf target -o <orgname> -s <spacename>`

4. Get the GUID for the application.  
    `cf app <appname> --guid`

5. Query a diego-cell for information about what containers host the application.  
    `bosh -d cf ssh diego-cell/0`  
    `cfdot actual-lrp-groups | grep <guid> | jq`  
    ```json
    {
      "instance": {
        "process_guid": "<REDACTED>",
          "index": 0,
          "domain": "cf-apps",
          "instance_guid": "<REDACTED>",
          "cell_id": "<REDACTED>",
          "address": "192.144.0.140",      // The diego-cell VM address
          "ports": [
            {
              "container_port": 8080,     // Application web interface port
              "host_port": 61002          // Node-port on the Diego-cell
            },
            {
              "container_port": 2222,     // Container SSH interface port
              "host_port": 61003          // Node-port on the Diego-cell for SSH
            }
          ],
          "instance_address": "192.255.240.4",     // The container ip
          "crash_count": 2,
          "crash_reason": "Instance never healthy after 1m0s: Failed to make TCP connection to port 8080: connection refused",
          "state": "RUNNING",
          "since": 1533667120903202800,
          "modification_tag": {
          "epoch": "f34cf292-4499-4623-6947-54cfc423e909",
          "index": 14
          }
      }
    }
    ```

6. Now we will want to find the diego-cell names, so for each diego-cell IP, run:  
    `diego_cell=$(bosh vms | grep <host> | grep -Po '^diego-cell/[a-z0-9-]*')`  

    > **Note:** If we just want to block traffic trying to reach this application, you need only add an iptables rule to each of the diego-cells.  
    > `sudo iptables -I FORWARD 1 -d <container-ip> -p tcp --dport <app-port> -j DROP`  
    > Which can be undone with:  
    > `sudo iptables -D FORWARD -d <container-ip> -p tcp --dport <app-port> -j DROP`

7. To find bound service information, we need call the CF-CLI for environment values. The actual information displayed will vary greatly depending on the service.  
    `cf env <appname>`  
    ```json
    {
      "VCAP_SERVICES": {
        "mysql": [
          {
            "credentials": {
              "hostname": "10.94.180.19",  // Service ip
              "jdbcUrl": "jdbc:mysql://192.94.80.119:3306/cf_9ea_2a1a_4dcd340649161?user=REDACTED\\u0026password=REDACTED",
              "name": "cf_9ea806ad_2a1a_4699_84b4_dcd340649161",
              "password": "REDACTED",
              "port": 3306,  // Service Port
              "uri": "mysql://REDACTED:REDACTED@192.94.80.119:3306/cf_9ea_2a1a_4dcd340649161?reconnect=true",
              "username": "REDACTED"
            },
            "label": "mysql",
            "name": "musicdb",
            "plan": "100mb",
            "provider": null,
            "syslog_drain_url": null,
            "tags": [
              "mysql",
              "relational"
            ],
            "volume_mounts": []
          }
        ]
      }
    }
    ```

8. Finally, we can add rules to each of the diego-cells to block traffic from our application to our bound service.  
    `bosh ssh <vmname>`  
    `sudo iptables -I FORWARD 1 -s <container-ip> -d <service-ip> -p tcp --dport <service-port> -j DROP`  

    And later remove it with:  
    `sudo iptables -D FORWARD -s <container-ip> -d <service-ip> -p tcp --dport <service-port> -j DROP`

## How to Block a Cloud Foundry Application (The Easy Way)
With CFBlocker, you can call it by either the CLI or from Chaos Toolkit. For this example, we will use the CLI; you can find out more by reading the [docs](https://github.com/tmobile/chaostoolkit-cf-blocker).

1. Login to your BOSH director as an admin.  
    `bosh -e <envname> login`

2. Login to Cloud Foundry; you do not need to be an admin, but you do need access to the organization and space the app is located in.  
    `cf login`

3. Update `config.yml` to match your environment.

4. Run the following to block the all instances of the application from reaching all the bound services.  
    `python -m cfblocker.cli --block-services <orgname> <spacename> <appname>`

    And when you have had your fun, unblock the services using:  
    `python -m cfblocker.cli --unblock <orgname> <spacename> <appname>`

# Looking forward

In the short term, we would like to add some convenience features to the app-blocking script which allow blocking a series of apps and or services, to allow blocking only a percentage of the instances rather than all of them, and to automate testing of blocking different permutations of services.

A larger project we would like to work on, is offering Chaos Engineering as a Service (CEaaS) through use of the Chaos Toolkit library wrapped with a REST API. This service could then be set up with a service broker to be offered in the Cloud Foundry marketplace. This would allow application developers to test their code without needing to be Admins of the system, and could make it as easy as binding a Cloud Foundry Service.

# License
Turbulence and its drivers, CF App Blocker Driver and Turbulence Driver, as open source projects, are continuously evolving.  Please refer to your IT group to determine suitability for any production or critical needs.  CFBlocker is open sourced under the Apache License 2.0.  Under the terms of section 7 of the Apache 2.0 license, CFBlocker is released AS-IS WITHOUT WARRANTEES OR CONDITIONS OF ANY KIND.  Please review the readme.txt file for additional license information.

# Third party Licensing
- Cloud Foundry - Apache 2.0
- Chaos Toolkit - Apache 2.0
- bosh-lite on windows - Apache 2.0
- Spring-music app is provided by Cloud foundry as sample app under Apache 2.0 License

# Trademark
- T-Mobile is a Trademark of T-Mobile US.


