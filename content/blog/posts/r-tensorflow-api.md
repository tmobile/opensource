+++
date = "2018-11-02T09:00:00-07:00"
draft = false
title = "Enterprise Web Services with Neural Networks Using R and TensorFlow"
categories = ["resources"]
tags= ["R", "machine learning", "data science", "AI", "T-Mobile"]
author = "Jonathan Nolis and Heather Nolis"
+++

<img src="docker-and-r.png"  height="480px" />

Despite being an incredibly popular language for exploratory analysis, data scientists are repeatedly told that R is not sufficient for machine learning – especially if those ML models are destined for production.  Though much exploratory analysis and modeling is done in R, these models must be rebuilt in Python to meet DevOps and enterprise requirements. Our team doesn’t see the value in this double work. We explore in R and immediately deploy in R. Our APIs are neural network models using R and TensorFlow in docker containers that are small and maintainable enough to make our DevOps team happy!

We want to empower R users to do proper engineering on their own terms by sharing our production-appropriate deep learning containers.

## Who we are

<img src="logo.png"  height="60px" />

When executives at T-Mobile decided to see if artificial intelligence and machine learning could truly improve the customer experience at T-Mobile, our team was created. We were given four months and a small budget to prove the worth of AI and ML to the business by creating a valuable machine learning model and deploying it into live systems. We had the freedom to use whatever tools we wanted, as long as they could be maintained continuously.

Our team is half data scientists (who prefer R) and half machine learning and software engineers (who prefer Java). We exist within Social & Messaging Product Development (SMPD): an agile software development shop which creates the software that lets you text, tweet, or Facebook message T-Mobile care agents. Because SMPD is immersed in the world of text, we came across some really nice natural language processing opportunities which could be easily deployed.
As a software development team with the goal of continuously running deep learning APIs, our approach to data science is unique within T-Mobile. The company is packed with teams of data scientists who build models to make decisions and keep the business in tip-top shape. Our team is different because our models are not run on demand to generate analyses. They continuously run as a service. As such, many well-honed data science practices had to be replaced with software development ones.

## How we did it

[For an introduction to R as a microservice check out our blog posts on [using R and plumber for web services](https://medium.com/@heathernolis/r-can-api-c184951a24a3), and [using docker to deploy them](https://medium.com/@skyetetra/using-docker-to-deploy-an-r-plumber-api-863ccf91516d)]

Once we found our first use case, the data scientists on our team trained a neural network to solve it. When faced with the decision on how to deploy the neural network, we felt that sticking with R was the best choice. The machine learning engineers snapped to R support and started figuring out how to make R work in the existing deployment pipeline. The SMPD group operates on a containerized microservices architecture, so we created a docker container that runs an R web service powered by the neural network.

We've open sourced a version of our implementation to gauge public interest. While our implementations are in production, prior to any production use, your IT department (if it exists) should review the source code for cybersecurity and suitability for your environment. Also, as this is a proof of concept release, feel free to modify as you need for your particular environment. Of course, T-Mobile cannot be responsible for maintaining the proof of concept so please Code Responsibly.

To work in our existing pipeline and with our team’s requirements, our web services needed to be:

* __Entirely written in R.__ - The data scientists had to create their models without learning new programming languages. To power the web service, we used the plumber R package. We structured the docker container so that an R user who is unfamiliar with docker shouldn’t need to modify anything except the R code itself.
* __TensorFlow compatible.__ - The web service had to run neural network models created by keras and tensorflow libraries. These R libraries run Python on the backend, so the container had to include Python linked to R.
* __Production ready.__ - The container had to be acceptable by our DevOps team, which in our case meant the image needed to be less than 2gb in size.
* __HTTPS enabled.__ - Our internal security requirements forced us to encrypt all traffic to our web service. The plumber R library does not support HTTPS by default, so we had to add an Apache 2 server within our container.

Many docker containers fulfill parts of these requirements, such as [rocker/ml](https://hub.docker.com/r/rocker/ml/~/dockerfile/) for R and TensorFlow or [trestletech/plumber](https://hub.docker.com/r/trestletech/plumber/) for R and plumber, the problem was that we could not find a single docker image that did it all - much less within the 2gb size requirement. We set out to create our own container, which ended up taking months of work. Our first pass at putting all these things in a working container was roughly 7 gigs! Now, we’ve gotten the container to a place we really like and decided to make it open source. You can try the container yourself at [tmobile/r-tensorflow-api](https://github.com/tmobile/r-tensorflow-api). This container is based on using R version 3.5.0, and using R libraries from MRAN's July 2nd, 2018 snapshot, as well as Miniconda 3 version 4.4.10 for python.

Our repository example shows a simple neural network that generates new adorable pet names based on Seattle pet license data. It contains both HTTP and HTTPS versions to use depending on the use case. It clocks in at 1.86gb, which is _incredible_.

## Why This Matters

Since starting down this machine-learning-in-production journey, we’ve found many valuable use cases. These include:

* Determining if a person is a customer by the first question they message T-Mobile.
* Predicting the intent of the conversation so the necessary data is ready for the T-Mobile care agent.
* Looking for and presenting to the agent internal knowledge-base articles as the conversation progresses.

Through all of this we’ve really enjoyed using R! We use it for all of our machine learning projects because it’s extremely easy to read, has powerful modeling capabilities, and can surface business-ready demos in just a few lines of code. We believe the future of machine learning is rooted in making these technologies more accessible for everyone. We also believe R is a viable language for development and  analysis, and we hope this inspires others to recognize the same value.

By deploying R models to do this work, we quickly proved the value of machine learning at T-Mobile (and got our own name: AI @ T-Mobile). We are now growing our scope and team to cover new topics. We look forward to seeing what else we can do as we continue to explore the power of R in production.

> T-Mobile is Customer obsessed! We are constantly looking for ways to make our Customer interactions the best experience possible. We believe AI/ML can enhance those interactions by providing the intent and context to aid in resolving a Customer contact.  We sponsored this project to validate our beliefs and to discover how to integrate AI/ML into our ecosystem. The project team has done an incredible job in a six-month time frame. They have validated that AI/ML can enhance Customer Interactions at T-Mobile, created an API to make their model accessible by our ecosystem, and created some pretty neat tech that can be shared with the community. With this new capability we not only have an additional tool to enhance our Customer interactions but also a blueprint on how to apply AI/ML to other products and services.
>  
>_Chuck Knostman, Vice President of IT at T-Mobile_