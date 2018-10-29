+++
date = "2018-10-29T01:59:28-07:00"
draft = false
title = "NEXT Directory - PR of the Week"
categories = ["resources"]
tags = ["blockchain", "t-mobile", "open-source", "innovation"]
author = "Chris Spanton"
 
+++

Recently, I had a chance to review NEXT PR [#305](https://github.com/hyperledger/sawtooth-next-directory/pull/305). This was a fun one, as it came while the NEXT team was on the Microsoft Reactor campus in Seattle’s South Lake Union neighborhood, collaborating in a code-with style hackathon, to develop some of the Azure and Active Directory Integration Engine components.

![ms-reactor](/blog/next-pr-series/ms_reactor.png#center)

The Microsoft Reactors (there's also one in San Francisco) definitely fit the mold of TV-style hip innovative office space. Think foosball, arcade games, and inflatable unicorns juxtaposed against  movable sit/stand desks, armies of huge rolling whiteboards, and enough mobile jumbo-monitors (ostensibly for collaboration) to make a sports bar blush. This was where the NEXT team spent most of the last week, in an intense design and build session which will make up the foundation of our Sprint 4.

PR [#305](https://github.com/hyperledger/sawtooth-next-directory/pull/305), titled "Setting up non-interactive client id with AAD" is the first of our AD integration code commits. While not closing a specific task, this item contributes to the S4 task [#276](https://github.com/hyperledger/sawtooth-next-directory/issues/276). This PR, in short, provides the first set of working code for building a session to Azure Active Directory, where we'll leverage the Graph API to receive changes from the Azure audit log via Event Hub, and push changes from NEXT.

I picked this PR both because of what it represents as we progress through building our integration components, and also because this is a pattern we'll likely repeat as we build future Graph API integrations.

![next-pr-code](/blog/next-pr-series/next_code_section.png#left)

This particular snippet, from [aad_auth.py](https://github.com/hyperledger/sawtooth-next-directory/blob/master/rbac/providers/azure/aad_auth.py), shows collecting a token given a Client ID and Client Secret. We've also build a certificate-based authentication, allowing for greater flexibility for a range of implementations.

The other snippet I'll show, comes from [requirements.dev.txt](https://github.com/hyperledger/sawtooth-next-directory/blob/master/requirements.dev.txt). This is relevant because it's an instance where a single line of code represents a significant level of effort.

![next-pr-code-requirements](/blog/next-pr-series/next_requirements_section.png#left)

If you want to learn more about this, and what it took for us to translate the Python Flask samples provided by Microsoft to Sanic, reach out to the dev here [@nadiabahrami](https://github.com/nadiabahrami).

That's my PR of the week! Hope you enjoyed.