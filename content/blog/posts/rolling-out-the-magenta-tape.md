---
title: "Rolling Out the Magenta Tape: Policy-as-Code for Kubernetes"
date: 2020-05-01T01:00:00-04:00
draft: false
tags: ["oss", "t-mobile", "magtape", "kubernetes", "policy", "opa"]
categories: ["resources"]
author: "Joe Searcy & Torin Sandall"
---

Hi all, I'm Joe Searcy, Member of Technical Staff on the Platform Engineering team here at T-Mobile and I'm joined by Torin Sandall, Software Engineer at [Styra](https://www.styra.com) and Co-founder/Core Contributor for the [Open Policy Agent](https://www.openpolicyagent.org) (OPA) project, to help tell the story behind one of T-Mobile's latest open source projects, `MagTape`.

![magtape-logo](/blog/magtape/magtape-logo-2.png)

## History & Motivation

Here at T-Mobile we're ALL-IN on containers and container platforms like Kubernetes. We, like most companies building Kubernetes environments, came to a quick realization that empowering your developers with platforms like Kubernetes can exponentially increase the volume and velocity of applications and releases. That's usually the goal, but you rarely get to scale your operations teams to keep up with the exponential growth in platform consumers. We have dozens of Kubernetes clusters, thousands of developers, and hundreds of applications that run everything from coverage maps, to iPhone launches, to point of sale in our retail stores. When we first started onboarding developers to our Kubernetes platform almost 3 years ago we took a very hands-on approach to developer relations. We sat down with each team and talked through their current application architecture and how it could be adapted to run on Kubernetes. We even got our hands dirty and helped with code changes to ensure they would be successful on this new crazy container platform. We also wrote some YAML...lots and lots of YAML! While we built a great relationship with these teams it was obvious this wouldn't scale as we moved from dozens of teams to hundreds. It didn't take long for us to reach critical mass as Kubernetes has proven to be a huge success and our developers love it! We scaled up our consumer base, we shortened, and in some cases did away with those pesky meetings to talk about application onboarding, and we had multiple applications running in production successfully. It was great...until it wasn't.

>We had our first application outage on our Kubernetes platform

## The Problem

Luckily we have great engineers and developers who jumped in and we easily identified the problem. Our lifecycle management tooling we used to upgrade our clusters worked a little too efficiently! We did an upgrade on a Kubernetes cluster, in a rolling fashion, and it finished successfully. What we didn't plan for was our development teams not having [PodDisruptionBudgets](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) deployed for their applications. Our platform upgrade ran through all nodes, finished promptly, and at the same time took down every pod for a very high profile application before new pods had the ability to come up and take traffic. Totally the Developer's fault right?! Wrong! Some of the things we covered in those hands-on meetings we had in the beginning of our Kubernetes platform launch included links to our best practice guides and talking through what those best practices were. When we couldn't keep up with those meetings anymore, we just posted a link to the docs and called it a day. Our job as a platform team is to know the edges of the platform and evangelize the best practices, or "guard rails" as we like to call them, to the consumers of the platform. Lesson learned!

The problem here wasn't that we didn't identify the edges...those were documented.

>The problem was our validation of developer workloads could NOT scale beyond people.

Coming up with a solution for this became an obsession of mine. We needed some type of policy enforcement to validate best practices and secure configurations, but it had to be different than any traditional type of policy enforcement. No red tape! No ticket queues, no manual processes, no subjective reviews or policies being determined by teams that have zero knowledge of the platform. Luckily Kubernetes provides a great mechanism to help solve this problem. Enter Kubernetes [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/). Essentially, Dynamic Admission Control provides a standard interface to intercept requests to the Kubernetes API Server and apply custom logic to either validate (allow or deny) or mutate (insert, delete, or replace) request content before it hits the Kubernetes API Server and is persisted.

![kubernetes-admission-workflow](/blog/magtape/kubernetes-admission-workflow.png)

## The Solution

In typical Un-carrier fashion, we sprinkled some Magenta on the problem and came up with a plan to turn the negative ideas around traditional "Red Tape" into something better. "Magenta Tape" or...`MagTape`

Since the Validating Admission Control interface could cover all requests to the Kubernetes API regardless of origin (ie. kubectl, helm, client-go, etc.), it was the perfect mechanism to build a solution around. I knew there would need to be features beyond just `allow` or `deny` for the tool to be successful at a large Enterprise like T-Mobile.

- Variable Enforcement - We needed a way to ease users into the idea of policy enforcement. We had to make sure we didn't ruin developer UX and introduce a stigma that the platform was hard to use, but also increase enforcement over time as the platform and its users matured.
- Notifications - The tool had to produce clear and precise notifications, needed to be immediate, and needed to be interactive if possible.
- Self-Service - We needed a way to define what each policy was checking, what produced a failure, and how it could be resolved by end-users with no dependency on human-to-human interaction.
- Observability - We needed a way to track which policies were proving to be difficult across all teams, as well as which policies seemed to be giving specific teams problems. This would help us focus training and education materials for our consumer base.

At the time I didn't come across any other tools that solved for all of these problems, so I decided to roll up my sleeves and build one from scratch!

![magtape-workflow](/blog/magtape/magtape-workflow.png)

---

## MagTape 1.0

### The Good

I decided to sit down one night and see how far I could get to gauge complexity and get an idea of how long it might take to build something we felt confident deploying throughout our environments. It was fairly easy to cobble together something passable and I demoed it to my team the next day to great reception. I began to extend the tool to cover more scenarios and eventually made it modular with a formal policy format and a proper decision engine. I built in a feature called `DENY_LEVEL` that allows for both active (deny) and passive (alerts only) operation. You can assign a severity level to each policy and use the `DENY_LEVEL` to control which severities will produce a deny and which will only produce an alert. This solved the problem of variable enforcement scenarios. Next I built in integration for Slack alerts. Again using the `DENY_LEVEL` and policy severity to control the format of alerts. Initially alerts were sent to the Platform Administrators only, but I also introduced functionality to allow for developer teams to annotate their namespace in a specific way to also send alerts to their own Slack channel. In addition to Slack alerts, policy failures will generate Kubernetes event logs within the developer's namespace. These features solved the notification problem. Lastly I added a metrics interface that allowed us to collect data and store it in Prometheus. We built custom dashboards to allow us to harness the information from the policy failures and build targeted education materials for our platform users. With these features we were able to build a bundle of policies to enforce best practices for Kubernetes workloads and secure against specific risk vectors.

We now had a tool that allowed us to define policies that could validate developer's workloads and scale beyond what our operations staff could perform manually. Whoohoo!

### The Bad

I was proud right up until I realized how much effort was required to keep the decision engine up-to-date. Policies evolve and the maintenance effort was going to be a problem. For example:

- Each time there was a new Kubernetes resource or a change to a Kubernetes resource schema, we would have to dive into hundreds of lines of Python code that we had not looked at in ages.

- Designing and implementing a maintainable "break glass" or exception model is difficult. At the same time, managing exceptions is a fundamental problem in policy enforcement. We knew that implementing this functionality in an ad-hoc way would be difficult to understand and hard to maintain.

- The Kubernetes admission control webhook does not provide all of the information required for some of the policies we want to implement. Adding the ability to fetch and cache additional information in the decision engine was going to take a lot of work.

- Since we had rolled our own decision engine, it was going to be difficult to incorporate best practices and policies implemented and published by other companies.  

>Here's my advice if you find yourself thinking about building and maintaining your own decision engine...DON'T DO IT!!!  

---

### Example Policies

- **MT1001** - Policy to check for liveness probes
- **MT1002** - Policy to check for readiness probes
- **MT1003** - Policy to check for resource limits (CPU/MEM) within Workloads
- **MT1004** - Policy to check for resource requests (CPU/MEM) within Workloads
- **MT1005** - Policy to check for PodDisruptionBudget and verify sane configuration
- **MT2001** - Policy to check for privileged security context

NOTE: Each policy gets assigned an `MT` number to allow for concise feedback via alerting/events and enable an easy mechanism for self service lookup that can cover more detailed information on what causes a failure for a specific policy and how you can adjust your configurations to pass the policy evaluation.

---

### Example MagTape v1.0 Policy Definition

```python
# Function to check for the existence of a liveness probe within a container spec

policy_name = "liveness_probe"
obj_name = container_spec["name"]
mt_severity = "LOW"
mt_code = "MT1001"

# Set policy specific Prometheus metric for total count
prom_policy_requests.labels(scope = "policy", count_type = "total", policy = policy_name, mt_code = mt_code).inc()

if "livenessProbe" in container_spec:

    # Set policy specific Prometheus metric for pass count
    prom_policy_requests.labels(scope = "policy", count_type = "pass", policy = policy_name, mt_code = mt_code).inc()

    print(f"[PASS] {mt_severity} - Found liveness probe in container spec for \"{obj_name}\" ({mt_code})")

    msg = f"[PASS] {mt_severity} - Liveness Probe Check ({tke_code})" + set_line_end(lineend_type)

    return msg

else:

    # Set policy specific Prometheus metric for fail count
    prom_policy_requests.labels(scope = "policy", count_type = "fail", policy = policy_name, mt_code = mt_code).inc()

    print(f"[FAIL] {mt_severity} - No liveness probe was found in container spec: \"{obj_name}\" ({mt_code})")

    msg = f"[FAIL] {mt_severity} - Liveness Probe Check ({tke_code})" + set_line_end(lineend_type)

    return msg
```

---

### Example Alerts

![magtape-slack-alert-failure](/blog/magtape/magtape-alerts-3.png#center)

---

## MagTape 2.0

At some point along the way I came across the OPA project. After I took some time to get over the initial idea that I had wasted effort, I recognized it for what it was...a better path forward. While OPA didn't solve all of our original criteria, it did present a great amount of flexibility where we could take the existing code and wrap it around OPA to give us a better policy engine and maintain the existing feature set that was important to how we do business. OPA was interesting for a number of reasons:

* If you search for blog posts or talks about admission control in Kubernetes, you come across OPA. There are many other companies using OPA for admission control and it would be relatively straightforward to incorporate their policies into MagTape if it was based on OPA.

* OPA has strong support for loading and caching additional data along with rules. As long as the data fits in memory, you can easily load it into OPA. This meant that policies requiring information outside of the Kubernetes admission control webhook would be easier to write. This [tutorial](https://www.openpolicyagent.org/docs/latest/kubernetes-tutorial/) on the OPA website demonstrates this.

* OPA does not have any runtime dependencies which makes it very lightweight. It was easy to drop-in and replace the custom decision engine we had built.

* OPA's policy language is purpose-built for expressing rules over complex hierarchical data like JSON and YAML. Of course every language has a learning curve, but with OPA and Rego the policies in MagTape would become more concise and maintanable. In addition, Rego's general-purpose design allowed us to model our DENY_LEVEL concept in a straightforward way.

---

### Example MagTape 2.0 Policy Definition (Rego)

```rego
package kubernetes.admission.policy_liveness_probe

policy_metadata = {

    # Set MagTape Policy Info
    "name": "policy-liveness-probe",
    "severity": "LOW",
    "errcode": "MT1001",
    "targets": {"Deployment", "StatefulSet", "DaemonSet", "Pod"},

}

servicetype = input.request.kind.kind

matches {

    # Verify request object type matches targets
    policy_metadata.targets[servicetype]
    
}

deny[info] {

    # Find container spec
    containers := find_containers(servicetype, policy_metadata)

    # Check for livenessProbe in each container spec
    container := containers[_]
    name := container.name
    not container.livenessProbe

    # Build message to return
    msg = sprintf("[FAIL] %v - Liveness Probe missing for container \"%v\" (%v)", [policy_metadata.severity, name, policy_metadata.errcode])

    info := {
        
    	"name": policy_metadata.name,
		"severity": policy_metadata.severity,
        "errcode": policy_metadata.errcode,
		"msg": msg,
    }
}

# find_containers accepts a value (k8s object type) and returns the container spec
find_containers(type, metadata) = input.request.object.spec.containers {

    type == "Pod"

} else = input.request.object.spec.template.spec.containers {

	metadata.targets[type]
    
}
```

---

## Future Enhancements

We have a handful of future enhancements planned for `MagTape`:

- Add additional policies
- Add additional policy granularity to allow for namespace specific scoped policies (BYOP - Bring Your Own Policy)
- Enable User configurable `DENY_LEVEL` per namespace to be above the global setting

---

## Conclusion

It's been awesome to share our story with you as I feel like the path to how we got here is just as important as the tool itself. So after about a year of runtime behind the big magenta curtain, we're proud to open source `MagTape` under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

>So far `MagTape` has helped us validate close to one million application deployments and upgrades. If you assume the manual effort for an engineer to validate a set of YAML manifests is ~3 minutes, that's a savings of ~50,000 engineering hours over the past year.

Please check out the project on [GitHub](https://github.com/tmobile/magtape) and let us know what you think. We look forward to your feedback. Please open issues for any bugs you might encounter using `MagTape` or any enhancements you would like to see. Join us on [Gitter](https://gitter.im/TMO-OSS/magtape) to talk more.

Cheers!
