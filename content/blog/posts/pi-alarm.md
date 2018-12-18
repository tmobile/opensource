+++
date = "2018-11-15T10:00:00-07:00"
draft = false
title = "Pi Alarm"
categories = ["resources"]
tags= ["oss", "t-mobile", "Raspberry Pi", "Python"]
author = "Oliver Tseng"

+++

## Purpose: To control an alarm using a Raspberry Pi and Python

![pi-alarm](/blog/pi-alarm.jpeg#small)

At T-Mobile, our development teams run pipelines to build, test, and deploy our code. Any disruption in the pipeline means new code can't be delivered, so fixing pipeline issues when they arise becomes top priority. To emphasize the importance of having an "always on" pipeline, we wanted a way to alert the teams explicitly, rather than just notifications via email/chat, when there's a failure in the job pipeline.  So, we created the **Pi-Alarm** to turn on an alarm during a pipeline failure.

Our particular setup is controlled by a [Raspberry Pi 3 Model B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) which runs a simple Python-based HTTP server.  When a pipeline job fails, it makes a REST call to the server, the server controls a General Purpose Input/Output (GPIO) pin which is connected to a 5V relay switch.  The relay switch then turns on the alarm.  Other boards than the Raspberry Pi may be used.  Feel free to experiment with other boards.  However, please note that we will not be maintaining this project for other boards.

Since it is triggered through a REST call, anything can be setup to turn on the alarm - a telemetry trigger, a test failure, or when it's time for lunch.

The initial design controls a rotating light which is powered by a 120V power supply.  To reduce the risk of an electrical hazard, a low voltage alarm is currently in development.


We have released the code for the REST server and instructions to build the hardware on [GitHub](https://github.com/tmobile/pi-alarm). Feel free to fork this code and adapt for your use. If you make an alarm, we'd love to see your setup. Send a pull request with a picture of your setup and how you are using it. 

Please note that this code is available AS IS with NO WARRANTEES, and maintenance of any forks will be up to you.  Also note, that Pi-Alarm makes use of open source licenses, in particular Apache 2.0.  As per best practices, prior to any production use, have your IT department review this code or your fork for suitability. 

T-Mobile is a trademark of T-Mobile US.

Raspberry Pi is a trademark of the Raspberry Pi Foundation.