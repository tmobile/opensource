+++

date = "2019-09-20T10:00:00-07:00" 
draft = false 
title = "A Lean Mean Pipeline Machine" 
categories = ["resources"] 
tags = ["oss", "t-mobile", "poet", "java"] 
author = "Ravi Shanker Sharma"

+++

![poet-logo](themes/tmo-oss-theme/static/img/poet.png#center)


Keeping in mind the dynamic DevOps culture in our company and others, we set out to streamline our development pipelines using a modern container-based approach.  Our goal was to empower developers to have the flexibility and ease of adapting the pipeline to their development methodologies while providing more time for development and testing rather than spending time on creating and maintaining CI/CD pipelines. 
Developers can easily on-board their solutions without spending too much time learning about the underlying technology that drives the pipeline. 
Why did we create the POET Pipeline?

The POET pipeline is designed around leveraging a dynamic DevOps culture. Developers should spend their time on development, not creating and maintaining their CI/CD pipeline, be able to on-board their solutions to the pipeline without having to be Jenkins “(R).” experts. POET pipeline provides recognized value to Devops teams without compromising the quality. 
Values such as:
•	Make it easier to implement new pipeline capabilities, without having to impact pipeline users.
•	Make pipeline usage and onboarding faster and easier.
•	Designing a service for scalability, reusability and flexibility across Dev teams. 
•	Help teams avoid having their own CI/CD pipeline specialists to maintain their own custom pipeline. 
•	Continue to abstract the underlying technologies that drive the pipeline (no need to know about Jenkins and associated tool chain).

# What is the POET pipeline framework?

The POET pipeline framework is built with a containers-first architecture. Pipelines are configured using a YAML files that you check-in to your git repository. The syntax is designed to be easy to read and expressive so that anyone using the repository can understand the continuous delivery process.
POET Pipeline executes build, test and deployment commands against your code inside isolated containers. 

## Example representation of a pipeline workflow

 
Jenkins  Groovy code is limited, error-prone, and difficult to incorporate with 3rd party libraries. For these reasons, our approach has been to keep the core pipeline code small, and push functionality out into containers.
One of the key design features is that we define a pipeline as a list of steps that include building, testing, and deploying code, along with sending notifications, or any other type. Each step is self-contained and implemented as a container. The pipeline workflow is responsible for executing each step but does not need to understand the step container internals. Step containers are a key strategy to empowering teams to develop their own containers to solve unique problems within their CI/CD, but they can also use existing containers developed by our team for immediate use.


Managing and Running a CI/CD pipeline is complex

Below is a diagram that looks to depict the different aspects of managing a CI/CD pipeline. Often a team building their own pipeline doesn’t have time to do all these items and they tend to do “just enough” to run but the solution doesn’t provide the robustness one is typically looking for in a pipeline critical to a highly available CI/CD flow. Doing it as a one off also consumes a greater percentage of a development team’s time.
This often moves organizations or teams to a more centralized approach, but this can create too “prescriptive” of a solution that doesn’t leave engineering teams the flexibility they need. To that end the POET pipeline looks to bridge that gap where we could have a reusability of capabilities, eliminate the need for “deep” knowledge of Jenkins for development teams.

 


POET works to address simplifying the running and maintaining a CICD pipeline.

# Design and implementation

Traditional Pipeline	POET Pipeline
In a traditional pipeline development lifecycle, for using Jenkins, you need to have people in your team who can write pipeline as code using Groovy, shell script and automate the processes. 

Furthermore, they must typically have a deeper understanding of their pipeline platform, such as, Jenkins internal concepts, Groovy and other related tools and technologies like JMeter, SonarQube, Selenium, Slack/E-mail, multiple Deployment platforms, Security etc.	In POET pipeline, we tried to use minimal number of Jenkins plugins so that we don’t have too much dependence on Jenkins. You do not write any “Jenkins code”. Everything is done through pipeline definition file(s) located with the pipeline source code.

There is no need for people with specific skills needed for Jenkins.


# Operation and Maintenance

Traditional Pipeline	POET Pipeline
With a Groovy pipeline library, there are operational challenges that need to be addressed.
o	Getting pipeline metrics.
o	Pipeline availability and monitoring.
o	Pipeline performance.
o	Pipeline logging.	To run the POET pipeline, you just need 3-4 minimum plugins to maintain in Jenkins. The pipeline framework works seamlessly, the maintenance overhead of the traditional pipeline goes away. 
Secondly, there is no groovy need to be written for any new features/functionality. The “step containers” are created to do the different functions such as builds, slack notifications, deployments, etc.




# Customer support or need of a CI/CD Specialist (harder to find)

Traditional Pipeline	POET Pipeline
In any organization the most important thing is how you support your customers whether they are internal or external. There are also challenges in how you get your product adopted, provide training to users and encourage the developers to use the product and contribute back as well. To make sure all this works well, you need a highly skilled, motivated and enthusiastic support team which is hard to find with all the knowledge and skill set.	We solved this problem in POET pipeline by keeping the product simple to use and providing enough resources like documentation, tutorial and videos for the dev team to understand the pipeline in a simple way. This helped in expending resources on other capabilities and innovations.



## Cost Matters

Traditional Pipeline	POET Pipeline
Managing and running pipeline involves huge cost. You need at least 1 full time team member per team for CI/CD pipeline. A lot of teams cannot afford even that 1 full time team member to work only on pipeline. 	Due to its simple architecture and design, POET pipeline reduces the support overhead as well as the addition of new feature and capability which is done using containers. You do not require a full-time person/specialist in your team to maintain/support the pipeline.


## Centralized management of Pipeline library

Traditional Pipeline	POET Pipeline
Traditionally, a Jenkins pipeline library is written in groovy and it involves a lot of plugins pipeline syntax to enhance the pipeline feature. Any new capability or process updates are done in the centrally managed library code. It is difficult for a core developer to understand the Jenkins internals concepts and design and maintain the CI/CD pipeline code. Instead of working on development efforts, teams must spend time maintaining their pipeline. 
	POET pipeline is designed as a framework which does not require any code changes to add capability or features into the pipeline. The capabilities and feature enhancements are done through step containers which are isolated containers to execute each step in the pipeline.


## Dependency on skilled resources

Traditional Pipeline	POET Pipeline
The development teams need to depend on highly skilled resources to create and maintain the pipeline. First it is hard to get the resources and secondly it adds extra cost to the project.	In POET pipeline, all the enhancements and capabilities are added into the YML file using step containers and there is no learning required about Jenkins or Groovy. There is no dependency on an individual or a specialized team.


## Learning Curve

Traditional Pipeline	POET Pipeline
Many companies are trying to be agile, using scrum framework and adopting a DevOps culture. Instead of having a centralized team to design and maintain the CI/CD pipeline, development teams should have ownership. This makes it critical to provide a simpler system than traditional groovy type pipeline as code.	In POET pipeline, the technology underneath is abstracted from the development teams. Any changes in the workflow or new feature or capability additions are done using step containers, which reduces the learning curve quite a bit.


## Duplicity of configuration and pipeline definition across microservices

Traditional Pipeline	POET Pipeline
The definition file contains the steps which define the pipeline workflow and execution. But if you have hundreds of microservices which are built in a similar fashion, needing to duplicate the pipeline/Jenkins file to keep in each repository, it can become problematic. 	In POET we introduced a concept of templates and templates-within-templates. Templates allow you to define your logic once and reuse it several times. Using templates, you can combine the contents of multiple YAML files into a single pipeline. Templates can be defined locally or included from remote git repositories. More details about templates can be found on the GitHub wiki  .


 # Summary

Overall, POET pipeline is a big win-win situation for both the stakeholders, the developers as well the Enterprise delivery pipeline team. POET Pipeline is all about customer satisfaction and providing quality results along with recognized value to the devops teams.
	Make it easier to implement new pipeline capabilities, without having to impact pipeline users.
	Make pipeline usage and onboarding faster and easier.
	Designing a service for scalability, reusability and flexibility across Dev teams.
	Help teams avoid having their own CI/CD pipeline specialists to maintain their own custom pipeline. 
	Continue to abstract the underlying technologies that drive the pipeline (no need to know about Jenkins and associated tool chain).

Please follow the below links to know more about POET pipeline and contributions.
POET Pipeline source code (https://github.com/tmobile/POET-pipeline-library)                                                                                
POET Pipeline Wiki (https://github.com/tmobile/POET-pipeline-library/wiki)

# License 

POET PIPELINE is open-sourced under the terms of the Apache 2.0 license and is released AS-IS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND pursuant to Section 7 of the Apache 2.0 license.