+++
date = "2017-06-18T21:26:26-07:00"
draft = true
title = "Content publishing tools and processes leveraged in this site"
categories = ["resources"]
tags = ["tools", "how-to", "publishing"]
+++

## Overview
In this post I wanted to walkthrough how the T-Mobile opensource site is setup and cover the tools and content publishing process we are leveraging. If you are looking to begin your journey towards opensource hopefully this information will be useful.

### Our Requirements
When we first started talking with [Steve](http://insert-link-to-steves-profile) and [Tim](http://insert-link-to-tims-profile) about launching our opensource site to show case lot of the great work our teams are doing, both Steve and Tim wanted to make sure we leveraged opensource tools and not rely on any internal tools or processes. Additionally we needed to make sure a light weight governance process exist before content becomes public. Any new content created get's reviewed by OSS working group for things like correctness, authenticity, follows guidelines on content classification etc.

### Tools
Here is the list of tools we ended up leveraging.

#### Hugo
Content for this site is statically generated using an opensource tool called [hugo](http://gohugo.io) created by [Steve Francia](http://spf13.com/) who works on the golang team at Google. If you are content author and will be creating content for this opensource site, first thing you will need to install on your laptop is hugo. 
If you are using HomeBrew installing Hugo is easy, simply run the command below
```
brew install hugo
```
If you are new to Hugo, please check out this [QuickStart Guide](http://gohugo.io/overview/quickstart/)

#### Github
All the content that you see in this site is stored in a Github [repository](http://github.com/tmobile/opensource). Repository has two branches, "master" branch reflects all content currently public and accessible through opensource.t-mobile.com site and "develop" branch reflects all content currently public and any new content that is under development or review and accessible via opensource.corporate.t-mobile.com. 
Since the site is generated using Hugo, Hugo creates a folder called "content" to organize all content used in the site. We are also using the same site to host technical articles under "blog" section. You simply use Hugo commands to create content for respective sections of this site. All content is stored as [markdown](https://en.wikipedia.org/wiki/Markdown) files. Again please be sure to check out the [QuickStart Guide](http://gohugo.io/overview/quickstart/) if you are new to Hugo. To contribute content you simply perform following steps.

* Fork this repository to create your own copy on to your account 

    Navigate to T-Mobile Opensource repository in github and login with your github account. After you have successfully logged in click on Fork option as shown in screenshot below
    ![](/blog/oss-fork.jpg)

* Clone to your local machine

    Clone forked copy of T-Mobile opensource repository on to your local machine. For this you will need to grab the repository HTTPS URL from github as shown in example below 
    ```
    git clone https://github.com/rprakashg/opensource.git
    ```
    After you have cloned the forked opensource repository to your local machine, simply switch the branch to "Develop" but running command below
    ```
    git checkout develop
    ```
* Create the content

    To create content you simply use hugo commands as covered in the [QuickStart Guide](http://gohugo.io/overview/quickstart/)
    Once the content changes are complete, before committing changes to your forked copy of the repository it can be tested locally using hugo to ensure everything looks good. Simply run command below to check how the site looks with your new content
    ```
    hugo server --buildDrafts
    ```

* Commit changes

    At this point you have created the content and tested locally using Hugo. You are now ready to commit your changes to the repository. Run below git commands to commit changes to github. 

    First stage your changes for commit

    ```
    git add .
    ```
    Commit your content changes
    
    ```
    git commit -m '{provide commit message}'
    ```
    Push changes to remote branch 'Develop'

    ```
    git push origin develop
    ```
    At this point your content changes made locally and tested in hugo are now committed to your forked copy of opensource repository. Next you will need to create a pull request (PR) to merge changes from your fork to tmobile opensource repository.

#### Travis-CI
For continuous integration; publishing in this usecase to be exact we are using a service called [Travis-CI](http://travis-ci.com)

#### AWS S3
Static HTML pages generated using Hugo are stored in an S3 bucket. Content for internal site (opensource.corporate.t-mobile.com) is organized in a folder called "Internal" and content for external site (opensource.t-mobile.com) is organized in a folder called "external"

#### AWS Cloudfront
For global content delivery we are leveraging cloudfront service. When new content is published we are using a custom script to invalidate the cloudfront distribution.

#### AWS Route 53 
DNS URLs for both internal and external opensource sites are managed using AWS Route 53 service, Hosted zone and record set maps the internal and external site URLs to cloud front endpoints

### Continuous Publishing
As mentioned above we are using Travis-CI service for continuous publishing. When changes are committed to "develop" branch, builds run in Travis-CI which will generate site content using Hugo CLI and pushes the generated content into a folder within an AWS S3 bucket using Travis-CI S3 deployment provider. After content is successfully pushed to S3 we run a custom script to invalidate the cloudfront distribution.
You can see this from the .travis.yml below for develop branch. 
![](/blog/devbuild.jpg)

Master branch in the repository is protected so that nobody is allowed to push changes directly to it without a pull request and review. Our OSS site maintainers will review each PRs, All PRs must have atleast one approved reviewer and no changes requested to be eligible for merge into master branch. 
Once the changes submitted via PR are merged to master branch, Travis-CI builds will build the content from master branch and publish to S3. Publishing steps in build script are pretty identical to what's described for develop branch, only difference is content is push to a seperate folder within the S3 bucket. Additionally when site content is generated using Hugo CLI, any content in draft state is skipped.


Hope you found this helpful.

Cheers,

Ram Gopinathan


