+++

tags = ["oss", "t-mobile", "angularjs", "springboot", "typescript"]
categories = ["resources"]
author = "Parth Patel"
draft = false
date = 2018-12-06T10:00:00-07:00
title = "How I created my first open source node module?"

+++

# Why I wrote Orchestration Desk?
Hello everybody !! I will be writing my first tech blog today. The topic I will be covering is "why I wrote a open source module 'Orchestration-Desk'" (https://github.com/tmobile/orchestration-desk/wiki) along with one of my favorite topic "Feature Toggles". Feature toggles are very popular among software industry /teams that wants continuous development and release of software products. The teams want the ability to show/hide features on demand.  I believe any team can create their own little feature toggles system using some of the popular tools available to them. I had one such lucky opportunity in my team to create a feature toggle framework.

## Why Orchestration-Desk?
I like orchestration services like Kubernetes, Mesos Marathon etc. They make managing deployment very easy when combined with docker containers. My team was on path of transition from Marathon to Kubernetes in long run so I decided that my solution should work for both Marathon and Kubernetes. For now it only works on services deployed in Marathon but I planned to make it work with kubernetes as well. In future, Orchestration-Desk is expected to have interface to all orchestration frameworks beginning with marathon and kubernetes depending upon new contributors and my time.

I am thankful to open source products for making lives of many software engineers/teams easy and believe that I should also contribute.

__*Lets see how it is used ...*__

My team uses some popular tools very common among software teams in industry. I used these tools along with Orchestration-Desk to create feature toggle system. Before we move on to details, I want to begin with two major ways a feature toggle system works.

1. **Poll base toggle update notification**: Some feature toggles system implementation uses polling to check if toggles are updated. Basically, all services will poll from toggles db and keep themselves updated. This is inefficient since resources are used up all time for checking if toggles are updated.
2. **Push base toggle update notification**: Optimized method for updating the feature toggles uses push based notification. Basically, whenever toggles DB is updated, an event triggers which informs all services to update their toggles by fetching the toggles from toggles DB.

## Single Source of truth:
Single source of truth refers to our way of storing the toggles. Basically, when a toggle is updated, all services including frontend and backend etc. should be updated from one value from same storage and not from multiple value/storage e.g. separate DB for frontend and separate DB for backend is not a good idea since if not taken care then there can be long major interval where frontend and backend will have different toggle values which be disastrous.

I will be discussing one such push based notification implementation involving below components. The backend services are spring boot microservices. Front end web app is based on Angular 6.

1. Web Application on Angular 6
2. Spring Boot Services using Spring Config Client
3. Toggles Spring Boot Client Service
4. Spring Config Server
5. Marathon Orchestration Framework
6. Orchestration-desk node module.
7. Jenkins Service
8. Bitbucket Repository
9. Docker

![Architecture of Feature Toggles System](/blog/orchestration-desk/image1.png)

## Architecture of Feature Toggles System

1. **Web Application**:
Web application can be developed on angular, react, vanilla javascript etc. Basically it should have code or framework ability to load the toggles before it loads other resources that depends on the toggles. In my case, I am using the APP_INITIALIZER ability of Angular Framework to fetch toggles before web application is loaded. Since this is an SPA (Single Page Application), we will fetch the toggles only once. We can simply add a new module that handles fetching remote toggles and overriding default toggles. After that, use the factory in the app.module.ts as shown below.

    ```json
    providers: [
        {
            provide: APP_INITIALIZER, useFactory: TogglesModule.togglesProviderFactory,
            deps: [TogglesService], multi: true
        }
    ]
    ```

2. **Spring Boot Client Services**:
Spring boot client services are services implemented using spring boot framework using spring config client functionality that connects to spring boot config server to get configurations needed to run the service. Our toggles will be part of configurations available to all spring boot client services through spring config server. See https://spring.io/guides/gs/centralized-configuration/.

3. **Toggles Spring Boot Client Service**:
Toggle service is basically spring boot microservice that loads the configurations and exposes it as an rest api for toggles consumer to consume. We can apply authorization, filters etc. to fetch the toggles following necessary parameters.

4. **Spring Config Server**:
Spring boot config server is responsible for loading configurations from git repository, file system and provides a rest api that config client services can use to get the configurations. See https://spring.io/guides/gs/centralized-configuration/.

5. **Marathon Orchestration Framework**:
Marathon is an orchestration framework running on Mesos DCOS. Marathon orchestrates application deployment in form of docker containers. In the existing architecture diagram, all applications are deployed as containers in Marathon. Many team use kubernetes for the same reason.
See https://mesosphere.github.io/marathon/.

6. **Orchestration-Desk**:
This is the node module that I wrote basically to connect logic sending update notification to all containers to fetch updated toggles with marathon api so that we can get all ip address and ports of containers that needs to be updated. See https://github.com/tmobile/orchestration-desk/wiki.

7. **Jenkins Service**:
Jenkins is a CI/CD system. We can containers, shell script, python scripts etc. In our case, we will run node application that notifies all containers to refresh toggles. See https://jenkins.io/.

8. **Bitbucket Repository**:
Toggles DB can be a bitbucket git repository, some storage service etc that holds the configurations/toggles. In this case, we are using bitbucket repository to manage source control of configurations. See https://bitbucket.org/. Bitbucket has many plugins, one such plugin is post web hooks which triggers post request based on events like pull request created, merged, deleted, updated etc.

9. **Docker**:
Docker is a tool for running applications inside a container sandboxing the application from other processes running outside the container. See https://www.docker.com/. In our case, we will be running the toggles refresher node application inside a container on Jenkins slave.

__*Now that we know what tools and services are involved, lets connect the dots and see how the flow executes.*__

1) Team checks in all toggles as part of spring boot service configurations in bitbucket repository.
2) Spring config server will load these configurations.
3) Spring client services including the toggle microservice will load these configuration during boot up.
4) When a team member updates toggles in configuration and checks-in bitbucket repository, a bitbucket post hook event will trigger a toggle refresh Jenkins job. This Jenkins job has ability to run node application or if not then you can use containers to run your node application.
4) Team has created a Toggle refresh node application using Orchestration Desk to fetch IP:PORT of all containers and send then a post request to refresh toggles. Containerized it and configured Jenkins to be able to fetch the docker image and run it.
See https://github.com/tmobile/orchestration-desk/wiki.
5) Now all spring boot client services including the toggle service have updated toggles/configs.
6) When a user visit your web app or refreshes the application, new toggles are loaded.

**Creating a Toggle**:
Toggle can be as simple as name:value or as detailed as name:{value, flightId, canaryEnvironmentId, expiryTime} where flightId indicates name of flight the service is running on. Flighting can be whole another topic but think of it as some of your services behaving different for some user or requests. canaryEnvironmentId is Id of environment in case the team uses canary deployment to release new changes. expiryTime is when this toggle should expire and switch to default value.

**How to store the Toggles**:
This is not something new. Teams that are familiar with spring boot config server and client are aware of how to store the configurations for different profile, environments and labels.

Basically, if using git repository then common configurations across all spring boot client microservices are store in application.yml or application-<environment>.yml. Environment matches the profile of the application which can be production, preproduction, development environments. Configurations specific to service can be store in <servicename>-<environment>.yml. 

See https://spring.io/guides/gs/centralized-configuration/ for more details.

**Acknowledgement**:
Thanks to all teams that created tools I used to create this feature toggle system. Lot of thanks to my team for giving me the opportunity to design and develop this system and open source Orchestration Desk. Thanks to others,who I forgot to mention.
