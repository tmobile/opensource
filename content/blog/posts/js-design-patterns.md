+++

tags = ["JS", "Design patterns", "JavaScript", "Javascript Objects", "Factory"]
categories = ["Resources", "OpenSource", "Community"]
author = "Siddharth Vidhani"
draft = true
date = 2018-06-27T07:32:00-08:00
title = "Factory and Builder patterns in JavaScript using Object mapping"

+++

#  Overview
Every language has design patterns which help us to organize our code in a way where it’s easy to understand, maintain and test. JavaScript being one of most dynamic languages is also one of the most abused and misunderstood ;). In this post I want to share some examples of how code is written and how can it be improved to make it more flexible which is easy to maintain.

#  Bad coding patterns
In JavaScript lot of times we tend to write code using if/else or switch/case when we have to use branching in multiple places. We end up writing too much logic which ends up being repetitive. Let’s take a look at an example:

The code below checks for the service type and then performs the business logic for the appropriate service. There a few issues with this approach

    *   Every time you add a new service you need to update this if else to handle the logic for that. Imagine if this kind of logic is put in multiple files/module. This will become unmaintainable very soon. 
    *   The check has to be performed every time until the specific if/else block condition is satisfied. This is not efficient if you have a huge if/else block.
    *   The code can become unreadable for a developer looking at it when trying to debug any issue.
    *   The code for the specific service is executed the moment condition is satisfied. There is no way to do some kind of late execution.

```sh

function getService(pizzaType, options) {
    if(pizzaType === 'api') {
        console.log("Hello from api");
        //more logic to handle api specific scenario
    } else if(svcType === 'lambda') {
        console.log("Hello from lambda");
        //more logic to handle lambda specific scenario
    } else if(svcType === 'website') {
        console.log("Hello from website");
        //more logic to handle website specific scenario
    } else {
        console.log("Invalid service type provided");
        //more logic to handle default/error scenario
    }
}

const options = { 'arn' : 'arnString' };
const serviceData = getService('lambda', options);
```
Another way I have seen this being done is using switch statement. Let’s take a look at it below

This code is similar to the one above and has similar issues. If for any reason you forget to put a break statement then the code falls through to the next case statement which is a side effect of using switch.

```sh

function getService(svcType, options) {
    switch(svcType) {
        case 'api':
            console.log("Hello from api");
            //more logic to handle api specific scenario
            break;
        case 'lambda':
            console.log("Hello from lambda");
            //more logic to handle lambda specific scenario
            break;
        case 'website':
            console.log("Hello from website");
            //more logic to handle lambda specific scenario
            break;
        default:
            console.log("Call some default service");
            //more logic to handle default/error scenario
    }
}

const options = { 'arn' : 'arnString' };
const serviceData = getService('lambda', options);
```

#  Factory pattern (with classes)
Factory in real word manufactures products and in software it manufactures objects. Let’s see how we can improve this code by using a factory class that uses object mapping and modules. I am also using some convention to make it simpler which will be easier to maintain. The service type is also the name of the module, thus taking away the if/else logic and making the code more concise. This approach provides lot of benefits:

    *   Code is easy to maintain as you don’t have to change the factory if you add or delete a new service. It just works!
    *   Code is more concise as the logic is abstracted out. Also, this is more efficient as it’s a lookup(hash).
    *   Unit testing becomes easier as the code need not be tested again (serviceFactory or already implemented service types). Only specific module that are added will need their own unit tests.
    *   Late execution – what you get is a function (pointer) and you can execute it as per other logic you may have in the code 

```sh
//index.js
const ServiceFactory = require('./ServiceFactory');
const svcFactory = new ServiceFactory();
const options = { 'title' : 'Report title'};
const generateReport = svcFactory.getReport('word');

//more logic here and late execution
generateReport(options);

//ServiceFactory.js
/* get the report given the type and options using factory*/
module.exports = class ServiceFactory {
    constructor() {
        this.reportTypes = { 'defaultReportType': require('./defaultReportType') }
    }
    
    getReport(reportType) {
        try {
            if (typeof require(`./${reportType}`) === 'object') {
                return this.reportTypes['defaultReportType'];
            }
            this.reportTypes[reportType] = require(`./${reportType}`)
            
            return this.reportTypes[reportType];
        } catch(ex) {
            //log error and handle default scenario
            console.log(ex);
            return this.reportTypes['defaultReportType'];
        }
    }
}

//api.js
module.exports = function api(options) {
    console.log("Calling api service type");
    //code to handle api svc type stuff 
}

//lambda.js
module.exports = function lambda(options) {
    console.log("Calling lambda service type");
    //code to handle lambda svc type stuff 
}

//website.js
module.exports = function website(options) {
    console.log("Calling website service type");
    //code to handle website svc type stuff 
}

//defaultSvcType.js
module.exports = function defaultSvcType() {
    console.log("Calling default service type handler");
    //your logic to handle default/error case
}

```

#  Builder pattern (with classes)
Now that we have looked at one pattern lets take it to another level and see how we will use it in real world using the builder  pattern. Builder pattern is used to separate the complexities of the creation logic from the final representation.

In this section I will construct a template(bundle) (eg. a website with api or a api with another lambda) as in real world it is very often that we use templates to bundle our services. I have extended the previous example and below is how to use a builder pattern with classes in combination with object mapping similar to factory pattern we saw. Benefits of this approach:

    *   Similar benfits like previous example we saw.
    *   With this pattern we have delegated the construction(build) of template or implementation to it's own class/module/function and this provides a good separation of concerns.

```sh

//index.js
const ServerlessTemplateBuilder = require('./ServerlessTemplateBuilder');
const serverlessBuilder = new ServerlessTemplateBuilder('E2EWebsite');
const options = {
    'website': {
        'title': 'My website'
    }, 'api': {
        'resouce': 'MyResource'
    }
};
const builder = serverlessBuilder.getBuilder();
const res = serverlessBuilder.construct(builder, options);
console.log(res);

//ServerlessTemplateBuilder.js
module.exports = class ServerlessTemplateBuilder {
    constructor(type) {  
        this.type = type;
        this.serverlessTemplateType = {'default': require(`./DefaultTemplateBuilder`)};
    }

    /* return the right builder based on type */
    getBuilder() {
        try {
            this.serverlessTemplateType[this.type] = require(`./${this.type}TemplateBuilder`)
            return this.serverlessTemplateType[this.type];
        } catch(ex) {
            console.log(ex.message);
            return this.serverlessTemplateType['default'];
        }
    };

    /* constructs (builds) the content given the options for the right builder */
    construct(builder, options) {
        let serverlessContent = new builder().build(options);
        return serverlessContent;
    };
}

//E2EWebsiteTemplateBuilder.js
module.exports = class E2EWebsiteTemplateBuilder {
    constructor() {
        this.services = ['website', 'api'];
    }
    
    build(options) {
        //more logic specific to website and api
        return this.services.map(service => ({[service]: require(`./${service}`)(options[service])}));
    }
}

//ApiWithCronTemplateBuilder.js
module.exports = class ApiWithCronTemplateBuilder {
    constructor() {
        this.services = ['lambda', 'api'];
    }
    
    build(options) {
        //more logic specific to api and lambda with cron job
        return this.services.map(service => ({[service]: require(`./${service}`)(options[service])}));
    }
}

//DefaultTemplateBuilder.js
module.exports = class DefaultTemplateBuilder {
    constructor() {
        this.services = ['website'];
    }
    
    build(options) {
        return this.services.map(service => ({[service]: require(`./${service}`)(options)}));
    }
}

```

#  Summary
So to summarize it is always better to use some design patterns to improve the code and the above examples shows few ways of solving this problem. As we saw the benefits are:

    *   Easy to read and follow.
    *   Easy to maintain when it comes to troubleshooting and debugging as code is abstracted.
    *   Good seperation of concern
    *   Late execution of code based on other logic
    *   Easier to test.
