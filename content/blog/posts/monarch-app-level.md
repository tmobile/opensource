+++
date = "2019-03-25T10:00:00-07:00"
draft = false
title = "Monarch: App-level Chaos Engineering"
categories = ["resources"]
tags= ["oss", "t-mobile", "Chaos Engineering", "turbulence", "chaos monkey"]
author = "Matthew Conover"

+++

![monarch-banner](/blog/monarch-app-level.png#center)

# Motivation
As we have talked about in [an earlier post](https://opensource.t-mobile.com/blog/posts/chaos-engineering/), Chaos Engineering is a method by which the stability of complicated cloud infrastructures can be assessed and validated. The current Chaos Engineering tools do not support application-specific attacks, but rather vm-specific attacks. Now, this works if each application is on its own VM, but a lot of our applications are deployed in Cloud Foundry which moves apps without the developers even needing to know what VM their container is running on.

While we can attack the VMs the application containers are running on with solutions like [turbulence](https://github.com/cppforlife/turbulence-release) and [chaos monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey), it takes the noisy neighbor problem to a whole new level! **The potential fallout of randomly affecting apps that just happen to be hosted in the same places could be disastrous, especially because those other apps may not be ready for chaos experiments.**


# Our Past Work
To bring some order to this chaos, we first developed the cf-app-blocker plugin for Chaos Toolkit which you can read more about in our [first post](https://opensource.t-mobile.com/blog/posts/chaos-engineering/). This script was capable of two things:

1. Blocking all traffic to all application instances
2. Blocking all traffic from all application instances to all of their bound services

If we were to call vm-specific attacks as a jackhammer solution, then the app-blocker script was a sledge-hammer solution. **Our goal is to have a hammer—a tool with app-specificity and fine-grained failure injection tests—which can hit applications without smashing our fingers or other applications in the process.** Furthermore, we want all of this to work without our app developers needing to import any libraries or make any modifications of to their code for testing.


# Introducing Monarch
[Monarch](https://github.com/tmobile/monarch) is our solution to app-specific chaos experiments in Cloud Foundry. It has support for

- Blocking ingress and or egress traffic to/from the application. This can be used to simulate a broken firewall rule, certification error, or a physical connection failure to the application.

- Blocking ingress and or egress service traffic which simulates what happens when a service goes down or when it becomes unreachable.

    - Auto-detection of bound services. The configuration and hosted locations of any services offered through the Cloud Foundry marketplace can be easily detected and then targeted.

    - Support for manually-specified, non-bound services. Because not every service gets added to the Cloud Foundry marketplace...

- Manipulating all network traffic from an application (including to its services). This is a great way to test what happens in the event of global networking-issues and was one of [the most revealing monkeys](https://medium.com/netflix-techblog/fit-failure-injection-testing-35d8e2a9bb2) in the simian army.

    - Latency
    - Packet loss
    - Packet duplication
    - Packet corruption

- Imposing bandwidth restrictions. What happens when a noisy neighbor decides to use all the bandwidth? This could also offer a way to demonstrate how much bandwidth is required to operate.

    - Application download bandwidth shaping (using queuing).
    - Application upload bandwidth limiting (using policing; limited functionality currently).

- Crashing one or more random application instances. Sometimes things break, it's important that customers are not impacted. This helps confirm the app instances are not stateful and that *any* instance can pick up the slack. Pairs nicely with a full glass of simulated traffic load.

- Killing/starting monit processes on hosting diego-cells. This test is for system operators to experiment with the platform itself.

The best part: **All of these experiments are performed using only the bosh-cli and cf-cli!** That means you can test any application deployed in Cloud Foundry with just a global configuration and the `org`, `space`, and `appname`. (You also need administrative privileges). Monarch can either be imported as a python module and get called from your own code, be used super easily form the python shell, or be called from [Chaos Toolkit](https://chaostoolkit.org/).

In addition to our Cloud Foundry, we are looking at adding support for Pivotal Kubernetes and VMare in the future.
