
+++
date = "2017-11-27T14:00:00-07:00"
draft = false
title = "Hyper Directory and the Road to Blockchain Innovation"
categories = ["resources"]
tags= ["blockchain", "t-mobile", "open-source", "innovation"]
author = "Chris Spanton"

+++

With the hype surrounding blockchain rapidly approaching fever-pitch, both
businesses and consumers around the world are on high alert. We don’t need to
point to the next big Initial Coin Offering (ICO) to prove that point - with
Bitcoin trading at over $8,000 and players like IBM, Microsoft, Amazon, and
Intel investing significant resources into their blockchain positions, we can be
confident that innovation is on the horizon.

As a Senior Architect in T-Mobile’s Cloud Center of Excellence (CCOE), I have
the unique opportunity to represent our efforts working with this exciting
technology. Over the last few years, in addition to adding over a million
subscribers for [18 straight
quarters](https://bestmvno.com/t-mobile/18th-straight-quarter-t-mobile-added-1-million-subscribers/)
and spending [$8
billion](https://arstechnica.com/information-technology/2017/04/t-mobile-dominates-spectrum-auction-will-boost-lte-network-across-us/)
on new wireless spectrum, T-Mobile has quietly positioned itself as a leader in
the development of enterprise cloud technologies. We’ve been making moves into
contributing to the [open source](http://opensource.t-mobile.com/) community,
and recently released our [Jazz Serverless
Platform](https://github.com/tmobile/jazz) under the Apache 2.0 License. As we
work towards building out scalable cloud-based solutions to solve the unique
challenges found in a large enterprise, we’ve taken a strong API-first stance
and made a commitment to layering on truly usable User Interface (UI).

What does all that have to do with blockchain? As I’ve evaluated the emergence
of blockchain technologies, a few questions I’ve continued to ask surround how
we can escape the hype, and explore real possibilities for enterprise-scale
innovation. What is the path towards finding solutions that reduce costs, and
increase efficiency? What are the use cases that can truly benefit from this
technology? I promise you, I’ve heard about every iteration of digital currency
and supply chain management. I definitely believe in those, and think that over
the next few years we’ll continue to see significant development of platforms in
both spaces. That said, they hardly stretch the imagination to help us see how
this tech may be implemented 10 or 20 years down the road. It’s frankly starting
to feel a lot like Abraham Maslow’s Law of the Instrument, which roughly states
“When all you have is a hammer, everything looks like a nail.”

It’s difficult for the world of startups, hackers, and independent consultants,
who are committed to driving this inherently open tech, to see the pain that is
being experienced in the enterprise world. They are holding that hammer, and
seeing a field of nails. It’s with my unique perspective then, of having nails
pressing into pain points as we dramatically scale into the cloud, that I’ve
been able to see some interesting and novel places where blockchain can be
applied.

Which brings us to [Hyper Directory.](https://github.com/tmobile/hyperdirectory)
Hyper Directory is a Proof-of-Concept (POC) built with Intel, that looks to
solve several unique pain points which I’ve felt in T-Mobile’s enterprise cloud.

* What is the source of truth for identity and permissions?
* How do we tell not just the what, but the when of permission management?
* How do we solve the “Who’s watching the watchers” problem of auditing change
management?
* How do we do all this in a way that reduces complexity and increases efficiency?

Hyper Directory directly addresses each of these, and more. It’s first a RESTful
API layer over a Hyperledger Sawtooth blockchain. A truly usable UI sits on top
of that, and provides an easy to use interface for self-service web based access
to the blockchain. Smart contracts handle the approval and provisioning of
permissions, all within a single highly auditable solution. Integration with
RESTful applications allows consumption from a wide range of modern applications
(including the aforementioned [Jazz Serverless
Platform](https://github.com/tmobile/jazz)) and a future integration to
traditional LDAP based directory services will add a new dimension to the
usability and security of Role-Based Access Control (RBAC) permission
management.

[Hyper Directory ](https://github.com/tmobile/hyperdirectory)will be
open-sourced under the Hyperledger Project, and you can check it out now on
GitHub.

* [Blockchain](https://medium.com/tag/blockchain?source=post)
* [Blockchain
Technology](https://medium.com/tag/blockchain-technology?source=post)
* [Innovation](https://medium.com/tag/innovation?source=post)
* [T Mobile](https://medium.com/tag/t-mobile?source=post)
* [Cloud](https://medium.com/tag/cloud?source=post)

By clapping more or less, you can signal to us which stories really stand out.

