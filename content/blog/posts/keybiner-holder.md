+++
date = "2017-10-16T01:59:28-07:00"
draft = false
title = "KeyBiner — Holder for your entitlements"
categories = ["resources"]
tags = ["Microservices","Entitlement","Api Development","Jwt"]
author = "Komes Subramaniam"

+++

In Microservice architecture, using the Access Token Pattern solution, the [API
Gateway](http://microservices.io/patterns/apigateway.html) authenticates a
request and passes an access token (e.g. [JSON Web Token](https://jwt.io/)) to
downstream systems and services securely. This helps the service or system to
identify/authenticate/authorize each request.

JSON Web Token (JWT) is an open standard ([RFC
7519](https://tools.ietf.org/html/rfc7519)) that defines a compact and
self-contained way for securely transmitting information between parties as a
JSON object.

* **Compact**:

Because of their smaller size, JWTs can be sent through a URL, POST
parameter, or inside an HTTP header. Additionally, the smaller size means
transmission is fast.

* **Self-contained**:

The payload contains all the required information about the
user, avoiding the need to query the database more than once.

![jwt](https://cdn-images-1.medium.com/max/1600/1*2K2OEklVQEFaK_FysIuXmA.png)
picture courtesy: [Toptal](https://medium.com/@Toptal)

Common scenarios to use JWT are Authentication & Secure Information exchange. As
per our Authorization design and Internal API security guidance, we see a need
for a self-contained token, and a need to securely transfer data from one
service to other service. We want to include authorization information in a
self-verifiable ID Token. The ID Token follows JWT standard, signed by IdP and
includes authorization information which is provided by an
authorization/decision engine.

In the Telecom industry, the Customer has the ability to delegate or assign
roles and responsibilities to the subscribers/line users on their account. A
customer can be associated or assigned to more than one account. They may be
financially responsible for some accounts, and, in other accounts, act as just a
user. For instance, Sue is a T-Mobile customer and she pays for her husband and
2 daughters. Sue also pays for her Mom’s account. Each line’s user can be
registered in the system to access information about their line and the account
it is tied to. Consider Account & Lines are resources in telecom industry.
Permission/Access information on each resources are called entitlements
/authorization information.

# Problem Statement

As per design specification, we need to include authorization information as
part the ID Token. Authorization information includes resources and
entitlements, and we have a list of Authorized Business Functions (ABFs) from
the business process model. Now what is an ABF? In short, it is a Business
Function which requires authorizations. For instance, your company / enterprise
business could be retail, telecom, manufacturer, etc. A business team defines
their business functions/processes such as ‘Pay Bill’, ‘Cancel Subscription’,
‘Initiate Goods Return’ etc. This provides an abstraction on top of the
permissions/access rights / privileges which might have been defined at the
system /application / product level.

![arch](https://cdn-images-1.medium.com/max/1600/1*P7vm5jiMWqMLS06CDtMgRw.png)
Image from googled result

Adding ABFs with the resource’s id in an ID Token would make it large in data
size. Transferring a large content as a token from one service to another
service would cause performance implications. Alternatively, we could go for the
authorization gateway model and keep it in central place, but having a central
source of authorization creates a bottleneck. So, we need a solution to reduce /
compress the authorization information.

Sample ABF List

> *“WAIVE_PROCESSING_FEE”,*
> *“PUSH_FEES_TO_BILL”,*
> *“EXEMPT_PROCESSING_FEE”*

# Solution

As part of login, a user obtains an ID Token from IdP. IdP generates the ID
Token after user authentication, and it adds authorization information (ABFs)
based on a policy decision engine. Instead of adding ABFs in uncompressed
format, we can leverage the KeyBiner library. It masks ABF values to a bit
position with a binary model, and compresses and uses character encoding to
significantly reduce the payload size.

```json
    {
        “iss”:”account.domain.com”,
        “sub”:”U-96be1cf7–0f9f-450c-bdbe-11d6e12f9926",
        “AT”:”02.p4BkK0wCpBmCCW42l”,
        “iat”:”1481699266017",
        “exp”:”2824345",
        “repid”:”xxxxxx”,
        “repgrp”:”yyy,sss,ddd,ggg”,
        “entitlements”:{
        “accountNumber”:”987654320",
        “ABFs”:[
                “WAIVE_PROCESSING_FEE”,
                “PUSH_FEES_TO_BILL”
            ]
        }
    }
```

Here are the internal details: KeyBiner consumes ABF reference data which holds
numeric assignment to each ABF. Example

* *24 — “WAIVE_PROCESSING_FEE”,*

* *34 — “PUSH_FEES_TO_BILL”,*

* *56 — “EXEMPT_PROCESSING_FEE”*

Each ABF String/value is converted to a bit position based its numerical
reference. Bit value 1 or 0 at that position specifies whether the ABF is
allowed or not. The encoding process would result in one or more long numbers
(long size is 64 bit which holds 64 different ABFs). Then we compress the
characters and encode to base64 characters. At the end of this process it would
result significantly reduced size which can be transferred / used for
authorization request. The result of string would look like

Every service layer receives an ID Token as part of the request. The KeyBiner
library can convert back to uncompressed format, and it can verify ABF existence
from the token’s entitlement claim as well.

The KeyBiner library can be used/extended for any purpose not just for
authorization. You can find its source code and how-to in :
[https://github.com/tmobile/keybiner](https://github.com/tmobile/keybiner). 

Have a nice day!!
