+++
date = "2018-01-12T14:12:54-08:00"
draft = false
title = "Introducing T-Vault"
categories = ["resources"]
tags = ["vault", "Hashicorp", "secret management"]
author = "VK Varadharaj"

+++

2017: the year that nothing seemed safe. The scale of breaches reached new
heights. More often, attackers didn’t target security features like encryption,
authentication or authorization, instead went after the less interesting
parts of the application. A lack of regular patching and poor handling of
secrets tended to be the common cause for most attacks.

**Let’s focus on the secret management for a minute…**

Keeping your secrets safe should be a top priority. In the world of secret
management, any good solution should follow these basic security principles:

* *Encryption at Rest*
* *Encryption During Transit*
* *Leak Prevention*
* *Least Privilege*

**In addition, we should add one more: *it should be easy to use for app
developers* !**

Most enterprises have some sort of archaic secret management solution, but they
typically don’t integrate well with new development models and cloud
deployments. DevOps and Infrastructure As Code demand a more flexible, API-first
and developer-friendly solution. The pressure to deliver faster, combined with a
process-heavy environment (traditional intakes, long wait-times, approvals), has
generally lead to corner-cutting and workarounds.

At many organizations, the security function is still largely a ‘throw it over
the fence’ thing. But things are changing. There is a growing awareness that
security incidents cannot be prevented with a bolt-on approach to security.
Secure practices must be embedded within the development process. **We must make
the secure way to do things, as the easiest way to do things.** The secure way
should be the default behavior. We need to put the right tools and processes in
place to make this happen. Today, the two-week sprint has become the norm. Teams
working in sprints hate dependencies and love self-service. When teams sprint
towards the delivery, anything that is going to slow them down will sink to the
bottom of the priority list.

Last year, we spent a good amount of our time making sure we got the role-based
access control and self-service model correct for our cloud assets. We have come
a long way and want to build on that success to solve deeper problems. Moving
all secrets used by applications from configuration files to a secret management
solution is a top objective. But in addition to that, people share passwords,
SSL certificates, API keys and SSH keys via email and Slack *(fun tip: if your
organization is using Slack, just do a simple global search for the word
‘password’. You might find the results interesting).*

When we looked for a solution to make secret management easier, self-service
enabled and following best practices, Hashicorp Vault looked like a good fit.
Vault provides an encrypted key store with mechanisms to control access to the
stored values. Values can be everything from passwords, certificates, API keys
and SSH keys. It supports a variety of backends to authenticate users (AWS,
LDAP, Radius and more). Dynamic secret generation for AWS is neat. It is
open-sourced with an active development community. There are tons of other good
things about the Vault project and you can find them online.

Vault is very easy to try, but when we went to put it into production, we found
some gaps. The obvious one is that the open source version doesn’t have a web
GUI. Also, application developers can’t use vault without having to learn all
the complexities of managing paths, policies, tokens, leases and backends. We
wanted to abstract away all the complexities and provide a black box solution
that is easy to use.

### We ended-up building [T-Vault](https://github.com/tmobile/t-vault) 

T-Vault is built to simplify the process of secrets management. It is an
intuitive and easy-to-use tool that application developers can easily adopt
without sacrificing their agility while still following best practices for
secrets management. It uses a few open source products internally including, at
its heart, Hashicorp Vault. Hashicorp Vault provides the core functionality of
safely storing secrets at rest and access control to those secrets. T-Vault
builds on that base to provide a higher-level logical abstraction called
**Safe** (internally using the concept of paths, within Hashicorp Vault).
T-Vault simplifies the access management of secrets by hiding all nitty-gritty
details. All of the functionality available via the web UI is exposed via APIs
and documentation is available from within the UI (another attempt to make
developers’ lives easier).

T-Vault is open-sourced under the Apache License Version 2.0. Check out the
project in[ GitHub](https://github.com/tmobile/t-vault).
