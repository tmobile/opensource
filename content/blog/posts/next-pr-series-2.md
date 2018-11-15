+++
date = "2018-11-14T01:59:28-07:00"
draft = false
title = "NEXT Directory - PR of the Week"
categories = ["resources"]
tags = ["blockchain", "t-mobile", "open-source", "innovation"]
author = "Nadia Bahrami"
 
+++

Following last week’s efforts highlighted in our previous ‘PR of the Week’ post, I decided to select NEXT PR [#347](https://github.com/hyperledger/sawtooth-next-directory/pull/347). Pull request 347, titled ‘Inbound filters operating for AAD’, is a direct downstream step in creating the Azure and Active Directory Integration Engine.


At the end of the hackathon hosted by Microsoft at the Microsoft Reactor in Seattle, we had two different providers capable of ingesting and loading data into the Rethink DB.   One of these providers being LDAP and the other being Azure Active Directory.  But while both providers were able to dump data into the database, none of the data was normalized or clean, which made it very difficult to explore and utilize.

Enter PR 347.

For data standardization we needed transformation filters to be able to insert data in a uniform pattern despite the variations in upstream provider sources.  The following is the common function that will be used for both of our current providers, despite the differences in the provider’s return payloads.  

![awesome-code-1](/blog/next-pr-series/pr-2-image1.png#left)

This pattern was also utilized in developing the ‘group’ ingestion process.  The code is purposely designed to be simplistic in how it handles transformation, for easy integration of future providers, but data agreements for inbound data still needed to be established.  A meeting involving several developers working on the project helped define the schema contracts we will be using moving forward, both for naming and what data should be kept. A partial can be seen below:

![awesome-code-2](/blog/next-pr-series/pr-2-image2.png#left)

The inbound fields from azure and ldap (values) transformed to the standardized format (keys), represents a collaborative effort to advance the project.  While there will be later changes to this section of the code, like adding in the ldap fields or converting this to a configuration file to make this even further provider agnostic,  it is a small contribution that impacts  and simplifies development across the project.

If you want to learn more about this reach out to the dev here [@nadiabahrami](https://github.com/nadiabahrami).

Thanks for reading!