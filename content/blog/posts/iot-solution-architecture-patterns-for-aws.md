+++
date = 2017-12-15T13:19:22-07:00
draft = true
title = "Architecture patterns for Internet Of Things (IoT) solutions"
tags = ["IoT", "AWS", "Design", "Patterns"]
categories = ["IoT", "Design"]
author = "Ram Gopinathan"

+++

# Overview

The term Internet Of Things (IoT) solutions is so broad and covers many scenarios and use cases in the real world, but almost every one of them has certain charecteristics that are common. In this post I will drill down what they are and discuss some useful architecture patterns and cloud based services that can be leveraged in your architecture for your IoT solution.

# Ingestion and Storage of Device Telemetry

Almost 100% of IoT solutions you would need to ingest telemetry data from the devices, these devices are connected to a cloud based service via internet and are constantly sending telemetry data from the device to cloud for storage and analysis. This pattern is quite similar to what you see today with metrics in your cloud native applications. Without your application generating metrics from all layers it becomes very difficult to observe and monitor as they run in production.

## Design considerations


# Cloud to Device communications

ss

# Losely coupled

ss

# Device Gateway

ss

# Business Rules and Device Analytics

Analysis lets us predict when things might go bad way before they happen, this is also called predictive analytics or cold path analysis.

## Hot Path

ss

## Cold Path

ss

# Device Diagnostics 

ss

# Canary Firmware updates

ss

# Device Authentication and Authorization

ss

# Device Catalog and Registry

ss
