+++
date = "2019-01-22T10:00:00-07:00"
draft = false
title = "5 Key FaaS Announcements at Re:Invent 2018"
categories = ["resources"]
tags= ["AWS Lambda", "Awsreinvent", "Application Load Balancer", "Serverless", "Aws Api Gateway"]
author = "Surya Jakhotia"
relcanonical = "https://medium.com/@suryaj/analysis-of-5-key-faas-announcements-at-re-invent-2018-f73b417b83f0"
+++


![banner](/blog/faas-reinvent-2018/banner.png#center)

55000+ attendees with 100+ products and services announcements make AWS
re:Invent 2018 one of the largest tech events. It was a big event for
*serverless* in general where AWS Lambda continued to be the top trending
service from the event.

*****

Here are 5 key releases/upgrades in the FaaS world along with my notes of when
to use it and when not to:

**1. Invoke Lambda from Application Load Balancer (ALB)**: You can now expose
your Lambda Functions as an endpoint through ALB. This is an alternative to AWS
API Gateway where your Lambda can be triggered when a request matches a given
host header/path.

**When to use it**?

· Organizations that are migrating their workloads or have a mix of
(micro)services that operate in serverless and non-serverless services will
greatly benefit from a simple ALB setup.

· If you were considering an alternative to AWS API Gateway be it for cost
and/or setup and execution overhead, and/or their [30 second
limit](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html),
you now have options.

**When not to use it**?

· If you were looking to migrate from API Gateway to ALB only for cost, consider
that you might need to setup a ALB health check, which in this case will
constantly ping your Lambda. Depending on your use case, you might be able to
get away without setting up a health check though.

· If your endpoint requires authentication/authorization/caching/throttling then
go with API Gateway.

**2. IDE Integration**: AWS toolkit now enables deeper integration in your
favorite IDE. The toolkit has not been released to the VS Code marketplace, so
in order to try it you must build and run from
[source](https://github.com/aws/aws-toolkit-vscode).

**When to use it**?

· Invoke your Lambda’s w/o leaving your IDE.

![vscode](/blog/faas-reinvent-2018/lambda1.png#large)  
<span class="figcaption_hack">AWS Toolkit Integration in VS Code</span>

![lambda](/blog/faas-reinvent-2018/lambda2.png#large)    
<span class="figcaption_hack">Execute Lambda in VS Code</span>

**When not to use it**?

· “Deploy Lambda Function” isn’t functional yet. Also what you get is a list of
Lambda’s and if your account has 100’s of them, it is painful to scroll down to
“your Lambda”. To be fair though, this is an OSS project so expect things to
change fast.

**3. Lambda Layers**: *Layers* is a packaging solution for your Lambda
dependencies including common libraries and/or custom runtime. Your Lambda can
reference *Layers* created by you or use public* Layers* published by AWS and
other AWS customers.

**When to use it**?

· If you want to save on your deployment packages size and/or bandwidth.

· Package your runtime as *Layers*.

**When not to use it**?

· If your runtime has a package manager, having your dependencies deployed
independently causes more harm than good. Your CI/CD pipeline, unit tests, local
debugging will now require pulling these packages (*Layers) *that are outside
your package manager. If you already have a CI/CD pipeline for deploying
Lambda’s you might as well as skip this announcement.

**4. Bring Your Own Runtime (BYOR)**: You now have the ability to[ bring your
own runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)
to execute your Lambda function.

**When to use it**?

· Author your Lambda functionality in
[C++](https://github.com/awslabs/aws-lambda-cpp),
[Rust](https://github.com/awslabs/aws-lambda-rust-runtime) or *bash*.

**When not to use it**?

· BYOR means someone from your organization is taking the responsibility of
managing the runtime and that includes
updates/patching/versioning/testing/deploying your runtime on Amazon Linux
image, which in some ways is antithesis to the whole serverless paradigm.

. Ruby 2.5 is now available as a [runtime for your
Lambda](https://aws.amazon.com/blogs/compute/announcing-ruby-support-for-aws-lambda/),
so you can use it without packaging your own *layer*.

**5. Firecracker**: Firecracker is a virtualization technology that is
purpose-built for creating and managing AWS Lambda’s and this is now [open
source](https://github.com/firecracker-microvm/firecracker). Firecracker allows
you to create minimalist-designed micro VMs with boot time of 125ms, which blurs
the lines between VMs and containers. You can spin up [4000 of them one
machine](https://github.com/firecracker-microvm/firecracker-demo), which
showcases how AWS scales your Lambda’s.

**When to use it**?

· It is too early to say — If this becomes more of an industry standard to run
*FaaS* workloads, more scenarios become possible (vendor lock-in becomes less of
a concern, run mixed workloads helping with transitions between on-prem to
cloud), so stay tuned.

*Note*: The current OSS version runs on bare metal on AWS (nested virtualization
is disabled) and on Intel architecture only.

**When not to use it**?

· Not ready to run your production workloads, yet! Check out this talk: [AWS
Lambda under the hood](https://www.youtube.com/watch?v=QdzV04T_kec) to learn
about the complexity of operating your AWS Lambda’s at scale.

· It is built on top of
[KVM](https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine), so you cannot
develop or run it on macOS natively
([VirtualBox](https://www.virtualbox.org/)/[VMware Fusion
](https://www.vmware.com/in/products/fusion.html)is your option).

*****

At Re:Invent 2018 we saw customers [sharing their use
cases](http://aws-reinvent-audio.s3-website.us-east-2.amazonaws.com/2018/2018.html)
of how they are successfully running production workloads using a healthy mix of
serverless services. There were also a [breadth of
announcements](https://aws.amazon.com/new/reinvent/) making serverless services
more deeply integrated with the rest of the AWS ecosystem. ALB Integration,
BYOR, Lambda Layers and IDE support makes FaaS and in general serverless go more
mainstream than ever.

Originally published on [medium](https://medium.com/@suryaj/analysis-of-5-key-faas-announcements-at-re-invent-2018-f73b417b83f0) on Dec 19th 2018.
