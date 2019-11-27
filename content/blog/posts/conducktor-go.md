
+++
tags = ["oss", "t-mobile", "conducktor-go", "conducktor", "kubernetes", "automation"]
categories = ["resources"]
author = "Amreth Chandrasehar"
draft = false
title = "Conducktor-Go for Kubernetes"

+++

![conducktor-logo](/blog/conducktor-go/conducktor.png#center)


Kubernetes (R) has become the Container orchestration platform of choice--but launching and configuring a Production grade Kubernetes Cluster is a lot of work. Conducktor-Go simplifies launching native Kubernetes Clusters on AWS (R) using Terraform (TM), Ansible (R), and Python Scripts. It also provides a rich, turn-key telemetry solution with pre-configured Grafana(R) dashboards and Prometheus(R) as data source. 

Conducktor-GO also configures Nginx(R), Docker(R) CE, Weave Net (CNI), Kube2IAM, Kubernetes 2.0 Dashboard, Kube-State-Metrics, and Metrics Server to provide a Production ready Kubernetes Cluster to deploy your services. Conducktor-Go offers flexibility to launch K8s clusters in any AWS VPC, and use any AMIs with CentOS v7.6 or higher (not yet tested with Debian).


## Features 

The automation script will configure below components along with K8s API Server and ETCD.

* *Infrastructure provisioning*
    VMs and ELBs are launched using Terraform on AWS to deploy Kubernetes and other core components.

* *Ingress:* 
    Nginx is used as Ingress in Conducktor-GO. This can, however, be substituted with the ingress of your choice by deploying separately.

* *Admin Dashboard:*
    Latest Kubernetes Dashboard 2.0 is configured in the cluster.

* *Telemetry:*
    Grafana with pre-built dashboards, Prometheus, Kube-State-Metrics and Metric server are deployed in the newly launched cluster.
 
* *High Availability:*
    The K8s Cluster is deployed across 3 AZs to support High Availability (HA) mode in both Control Plane and Worker Nodes. Please provide VPC ID and subnets to launch the cluster.

* *IAM Access:*
    Kube2IAM is used for Pods to securely access AWS Managed services.

* *CNI:*
    Weave Net is used for CNI to connect the docker containers hosted on the worker nodes.

* *Container Runtime:*
    Docker CE for Container Runtime in Kubernetes Cluster will be configured on all the nodes. 


## Prerequisites and assumptions 

* A Linux/Unix host
* Git (2.x)
* Python (2.7.x)
* Terraform (0.12.x)
* Ansible (2.8.x)
* AWS IAM Roles (more details in GitHub)

* The script will not create VPC in AWS to launch the cluster. 
    We assume VPC and Subnets (accross 3 AZ), NATGateway are already available. Our current use case at T-Mobile is to launch with existing pre-configure VPC and to use very minimal IAM roles for security reasons.


## Known issues / limitations

* There is no way to specify the number of Control plane or worker nodes
* If for some reason the script fails, when you re-run the script, it will destroy terraform created resources and will recreate it. To avoid this, current work around is to comment out code.
* There is no idempotency while running the script.
* Current script only works with Python 2.7.x
* No way to add additional/custom tags without making code changes

## Future work

* Provide ability to dynamically choose the number of Masters and Worker Nodes
* Add idempotency to automation process
* Upgrade to Python 3.x
* Add ability to add custom tags
* AWS Auto Scaling Group support
* Provide options for external or internal LB pointing to Master Nodes
* If using an external LB, provide options for specifying LB subnets
* Prometheus and Grafana dashboards
* Access to Dashboard via external access
* Calico as CNI
* Ability to skip launching clusters and configure an existing K8s Cluster

More details on these will be shared soon. Contributions are welcome!


*****

*Conducktor-GO is open-sourced under the terms of the Apache 2.0 license and is released AS-IS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND pursuant to Section 7 of the Apache 2.0 license. Please check more on Conducktor-Go @ [GitHub](https://github.com/tmobile/conducktor-go)*
