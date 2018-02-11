+++

tags = ["OpenFaas", "ServerLess", "Java", "SpringBoot", "Vertx"]
categories = ["Resources", "OpenSource", "Community"]
author = "Ram Gopinathan"
draft = false
date = 2018-02-11T13:19:22-07:00
title = "Introducing Vertx and SpringBoot Java Templates for OpenFaas"

+++

# Introduction

This post is more of an introductory post announcing release of SpringBoot and Vertx Java templates for OpenFaas. These templates allow you to develop your serverless function for the OpenFaas platform using SpringBoot or Vertx. In the Java ecosystem both SpringBoot and Vertx are very popular frameworks for developing microservices. With the release of these templates we are bringing the power of these frameworks into OpenFaas. You can find the templates in our github repository [here](https://github.com/tmobile/faas-java-templates). Please provide us any feedback or issues you might run into. If you are new to OpenFaas, please check out this kubecon [talk](https://www.youtube.com/watch?v=XgsxqHQvMnM) by Alex Ellis creator of OpenFaas platform.

## Downloading the template

Before you can create serverless functions using the above the templates, you must first install them on your local machine. Run the command below to install these templates on your local machine.
Additional requirement is you need to have Faas cli installed and configured to either work with your local docker swarm or kubernetes cluster or remote clusters.

```sh

faas template pull git@github.com:tmobile/faas-java-templates.git

```

Verify templates are installed locally using command below

```sh

faas new --list

```

## Creating functions using these templates

As mentioned earlier repository currently provides both Vertx or SpringBoot templates. 

* To create a function using these templates, run the command below

```sh

faas new {name of function} --lang vertx|springboot

```

## Building the function

Once you've implemented the function logic, you would build the function using the faas cli build command as shown below

```sh

faas build {stack yml} --image {function docker image} --handler {path to your function handler} --lang vert|springboot --name {function name}

```

## Push the Image to a Registry

Once your function image is built you can push the image to a docker registry using the faas cli.

```sh

faas push -f {stack yml}

```

## Deploying the function

Once the function is built using the faas cli, you can simply deploy them as shown below

```sh

faas deploy --image {function docker image} --name {function name}

```

In the next post we will demonstrate how to build a real serverless function using the above templates and deploy to Openfaas running on a Kubernetes cluster.

Thanks,

Ram
