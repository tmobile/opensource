+++
date = "2019-08-28T09:00:00-07:00"
draft = false
title = "loadtest - an R Package for Load Testing"
summary = "An R package that allows for simple load testing of websites and APIs."
categories = ["resources"]
tags= ["R", "testing", "data science", "AI", "T-Mobile"]
author = "Jacqueline Nolis and Heather Nolis"
thumbnail = "blog/loadtest/loadtest_hex.png"
+++

<link href="/blog/loadtest/style.css" type="text/css" rel="stylesheet"></link>

<div class="text-center" style="padding:20px">
 <img src="/blog/loadtest/intro.jpg" width="80%" alt="R logo lifting a weight"></img>
</div>
APIs are great! Engineers love 'em! They're everywhere! By using packages like plumber in R, data scientists create their own APIs, allowing their models and code to be run by other people ([see here for an intro in R](https://medium.com/tmobile-tech/r-can-api-c184951a24a3)). Lovely! But when you release an API, you're giving people access to your own computing resources. If the code for your API is on a server, too many requests can cause it to fail.

Failure is really bad. Yes, it hurts to have something you've made fall over spectacularly but in software the outcomes have long-term consequences. Releasing new software is--secretly, _under the hood_--an exercise in building trust with your end users. A single piece of wonky software can sour the relationship with your users forever. Most of us have felt the effects of this ourselves. Quitting a video game because of a bad expansion, switching cloud providers because of buggy implementations, tweeting threads and threads because a UI update ruffles your sensibilities.

If you develop stuff that doesn't work, people will remember.

Take this epic failure. If you were between 18-29 years old back on June 6, 2016, you probably personally remember this catastrophe--the launch of Pokémon GO.

<div class="text-center" style="padding:20px">
 <img src="/blog/loadtest/gcp_pokemon.png" width="80%" alt="GCP Pokémon Go Failure"></img>
</div>

Niantic, the company that created the game, had 50 times the traffic that they expected in development. For days after launch, the app was unusable. Sure Pokémon GO was a viral phenomenon, but lots of people stopped using the app immediately after downloading it because of these performance issues--including a coauthor of this very article!

One quick, easy, cheap way to do avoid these catastophes is to simply apply load yourself before launching your code. Sometimes the best you can do is get your dev buds in a room, hand them a postman collection, and drown in the sound of mouse clicks as everyone wails manually at top speed, desperately hoping they can generate a useful amount of test traffic.

<div class="text-center" style="padding:20px">

<img src="/blog/loadtest/plane.png" alt="a ton of people on the wings of an old-timey plane"></img>
<p><em>(the authors and their friends load testing before loadtest)</em></p>
</div>

Mature software development workflow includes _performance testing_ when a system's performance is tested before it's launched. One type of performance testing is _load testing_, simulating many users hitting your tool at once, which is done to see how the system behaves in real-world type conditions (or even worse ones). This can be multiple simultaneous users and lots of users in succession. By ensuring that the systems will work under extremely high loads, load testing gives stakeholders confidence in your software and helps identify bottlenecks in overall systems. Even in cases of total failure, if you've done good load testing in advance then you're sitting pretty. Unlike companies who didn't load test, you know what your system looks like when it is failing. You can detect failures more quickly and know what to do to fix them. By using computer programs to simulate the traffic rather than having developers repeatedly use the tool in unison, you lower the chance of hand injuries.

As APIs become more accessible to the data science community, so should engineering best practices around those APIs. However, most load testing tools are crafted for engineers or testing specialists--so we fixed that.

## Our package
<div class="text-center" style="padding:20px">

<img src="/blog/loadtest/loadtest_hex.png" alt="loadtest hex logo" width="200"/>
</div>
Our new R package, __loadtest__, is a tool for easily running load tests without ever having to leave R, all with a single line of code. With loadtest, load testing is so easy you can trivially do it before a service is deployed in production to test it will work, or it can be used as a method of better understanding API behavior. The package includes several plots to quickly understand the test results, and a standard report to package the output as an html document. And since loadtest is a set of R functions, you can even add it as a step in a build process. The loadtest package uses JMeter on the backend, which is a standard industry tool for load testing, so the results are high-fidelity.

> The loadtest package has already solved production issues with R APIs. On the *AI @ T-Mobile* team, one of our APIs would be occasionally unresponsive. Using the loadtest package, we were able to simulate the production environment that produced the problem. We learned that 1 in 10 requests would take over a minute. With this information, we discovered that the unresponsive API was not due to our R code but an external HTTP request that sometimes would time out.

### How to use loadtest

As a demonstration we've created a website, [teststuff.biz](http://teststuff.biz), which hosts an API version of the [MIT DeepMoji project](https://deepmoji.mit.edu/). DeepMoji is a neural network that takes text and returns emoji relevant to the test. We've hosted it on a tiny AWS EC2 instance, and we want to know how well it works under a load!

The way the API works is that we send a POST request with a JSON body containing text to turn into emoji, like:

```r
library(dplyr)
library(httr)

# make the request
response <- POST("http://deepmoji.teststuff.biz",
                 body = list(sentences = list("I love this band")),
                 encode="json")

# format the json into a table, then look at the 3 three emoji for that sentence
content(response)$emoji[[1]] %>%
  bind_rows() %>%
  arrange(desc(prob)) %>%
  top_n(5, prob)
```

|emoji |      prob|
|:-----|---------:|
|🎶     | 0.1589428|
|🎧     | 0.0829151|
|😍     | 0.0745626|
|❤     | 0.0681824|
|💚     | 0.0606171|

How fun! But how does this system do under load? Will it work when hundreds of people all want hundreds of sentences converted to emoji at once? That's when load test comes in! Let's run a test of having 10 concurrent users each make a request to convert sentences to emoji 25 times. That task can be done with a single function call, using almost the exact same parameters as the `httr::POST` request.

After [installing Java and JMeter](https://github.com/tmobile/loadtest#installation) we install and load the loadtest library:

```r
remotes::install_github("tmobile/loadtest")
library(loadtest)
```

Then we run a load test with one command:

```r
results <- loadtest(url = "http://deepmoji.teststuff.biz",
                              method = "POST",
                              body = list(sentences = list("I love this band")),
                              threads = 10,
                              loops = 25)
```

As output get a table with a row for each of the 250 requests made. The table has lots of attributes for each request, but importantly we get the time each request was made and the time it took before the full response was received.

```r
results %>%
  select(request_id, start_time, elapsed) %>%
  head()
```

| request_id| thread|start_time          | elapsed|
|----------:|------:|:-------------------|-------:|
|          1|      4|2019-07-25 11:20:49 |     __202__|
|          2|      5|2019-07-25 11:20:49 |     __235__|
|          3|      2|2019-07-25 11:20:49 |     __368__|
|          4|      8|2019-07-25 11:20:49 |     __399__|
|          5|      3|2019-07-25 11:20:49 |     __527__|
|          6|      5|2019-07-25 11:20:49 |     __327__|

The elapsed time column gives us the precious data we need on how how quickly our API will respond.

We can use the loadtest package to plot the results too. Here is a plot showing the results over the course of the test:

```r
plot_elapsed_times(results)
```

<div class="text-center" style="padding:20px">
<img src="/blog/loadtest/plot_elapsed_times.png" alt="Plot of elapsed times" width="80%">
</img>
</div>
This chart shows that for the 250 requests, the requests either took around 200-250ms, or 1000-1250ms which is an unusual bifurcation. Something in the API is causes the requests to either be super fast or super slow.

We can also look at the data as a measure of how quickly the API can handle responses. In this next plot from loadtest we can see a histogram of the number of requests per second the API handled:

```r
plot_requests_per_second(results)
```

<div class="text-center" style="padding:20px">
<img src="/blog/loadtest/plot_requests_per_second.png" alt="Plot of requests per second" width="80%">
</img>
</div>
The API was able to handle 12-18 requests per second during the course of the test. If we expect to only get a few requests per second, say 1-4, then this API should work fine. If we expect to get 30 requests per second then our API would be too slow. In that case we'd want to add more containers or virtual machines running the API or find a way to make the API run more quickly.

There are more graphs you can make and you can make them all at once as a nice html report with loadtest as well. Using the loadtest_report command you can easily create a report right that can be shared around the office.

```r
loadtest_report(results)
```

<div class="text-center" style="padding:20px">
<img src="/blog/loadtest/plot_report.png" alt="Report from loadtest" width="80%">
</img>
</div>
### What to do next

If you do any sort of API development, we encourage you to try this package out and see how your APIs fare! If you find features that are missing we'd love to hear from you in the [GitHub Issues](https://github.com/tmobile/loadtest/issues). Beyond running one-off load tests, you can also integrate it into your build pipeline so that after an API is deployed in testing an loadtest report is automatically generated. By making load tests as automatic as unit tests, your code is much more likely to handle the rigors of production. Happy testing!

_Boring legal note: this tool is released as open source for public use. It is released "as-is" and theoretically may have inconsistencies in reporting and stability. T-Mobile has no responsibility for the outcomes of the output of this tool--use at your own discretion._
