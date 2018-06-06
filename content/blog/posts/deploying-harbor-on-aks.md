+++
tags = ["Harbor", "Azure", "AKS", "K8s", "T-Mobile", "Microsoft", "VMware"]
categories = ["Azure", "K8s", "AKS", "Harbor", "VMWare"]
author = "Prashant Gupta"
draft = false
date = 2018-05-30T13:19:22-07:00
title = "Deploying VMWare Harbor on Azure Kubernetes Service aka AKS"

+++

VMware [Harbor](https://github.com/vmware/harbor) is an open source all in one enterprise-class container registry that extends open source docker distribution and adds many functionalities that are typically required in the enterprise such as:

* container registry

* container image vulnerability scanning

* notary (Content trust and digital signing)

We recently went through an evaluation process of VMware Harbor and had to deploy it on our Azure Kubernetes cluster. Harbor project currently includes a [helm chart](https://github.com/vmware/harbor/tree/master/contrib/helm/harbor) that can be used to deploy to a kubernetes cluster, unfortunately, with AKS we had to make some edits to the Helm chart as well as perform some additional steps.
This article is meant to provide a walkthrough/guide to deploy VMWare Harbor on Azure Kubernetes Service (AKS).

## Pre-Requisites

* AKS cluster provisioned in your Azure Account

    Creating a Kubernetes cluster on Azure is pretty simple and can be quickly done by utilizing either [Azure CLI](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) or from [Azure Portal](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal). There is a known issue with the Harbor helm chart, chart doesn't work with Kubernetes 1.8.9+ and 1.9.4+ versions. So if you are testing this out, be sure to use version 1.8.7. See more info on the issue [here](https://github.com/vmware/harbor/issues/4496)

* Helm installed and configured

    If this your first time using helm, you can learn more about Helm [here](https://docs.helm.sh/) and install and configure helm using instructions available [here](https://github.com/kubernetes/helm/blob/master/docs/install.md), additionally be sure to initialize helm with default service account as shown below.

    ```#!/bin/bash
    helm init --service-account default
    ```
 
## Installing VMWare Harbor on Azure Kubernetes Service

## 1.0. Create ingress controllers for Harbor and notary
We need to create two ingress controllers to allow users to access both Harbor and Notary services. Follow the instructions available in this [tutorial](https://docs.microsoft.com/en-us/azure/aks/ingress) to create ingress controllers. We only need to follow steps listed below from that article.

- [install-an-ingress-controller](https://docs.microsoft.com/en-us/azure/aks/ingress#install-an-ingress-controller)
    
    Follow steps listed in this section to install an NGINX ingress controller. Please be sure to set the RBAC to false as shown below. Preview version of AKS doesn't support RBAC; this could potentially change in future. 
    
    ```
    helm install stable/nginx-ingress --namespace kube-system --set rbac.create=false --set rbac.createRole=false --set rbac.createClusterRole=false
    ```

- [Configure-dns-name](https://docs.microsoft.com/en-us/azure/aks/ingress#configure-dns-name)

    Helm chart sets up FQDN for notary based on the harbor DNS, for ex. for this post we used "tmobile-harbor-demo" as harbor DNS, so your notary DNS will be "notary-tmobile-harbor-demo". Keep this in mind when you configure the DNS for the nginx ingress for notary to also use the same format. 
    
    You could always change this using kubectl edit ing command and update ingress routes if you made any mistake or you are getting certificate errors.
     
- [Install-kube-lego](https://docs.microsoft.com/en-us/azure/aks/ingress#install-kube-leg)

At the end of this step, you would have created two ingress urls. In my case ingress hosts were:

- tmobile-harbor-demo.eastus.cloudapp.azure.com

- notary-tmobile-harbor-demo.eastus.cloudapp.azure.com

## 2.0. Create an Azure storage account

Harbor registry requires persistent blob storage to store all the docker images. Since we are deploying this on Azure we will need to use Azure Blob storage. Follow instructions below to create an Azure Storage Account in your subscription. One thing to keep in mind here is we need to ensure Azure storage account is created in "EastUS" region as AKS in the preview is currently only available in that region. We don't want our AKS cluster in EastUS and Storage Account used by VMware Harbor to store images be in a different region. 
 

```bash
AKS_STORAGE_ACCOUNT_NAME=<Provide storage account name>
AKS_RESOURCE_GROUP=<Provide the Kubenetes Resource group>
AKS_REGION=eastus 

#Create the storage account
az storage account create -n $AKS_STORAGE_ACCOUNT_NAME -g $AKS_RESOURCE_GROUP -l $AKS_REGION --sku Standard_LRS

#Export the connection string as an environment variable, this is used when creating 
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string -n $AKS_STORAGE_ACCOUNT_NAME -g $AKS_RESOURCE_GROUP -o tsv`

#Get storage account key
STORAGE_KEY=$(az storage account keys list --resource-group $AKS_RESOURCE_GROUP --account-name $AKS_STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)
#Echo storage account name and key
echo Storage account name: $AKS_STORAGE_ACCOUNT_NAME
echo Storage account key: $STORAGE_KEY
```

Note down the account name and key; you will need it in the steps below.

## 3.0. Deploying Harbor using Helm chart

### 3.1. Download Helm chart from Harbor GitHub repository

```bash
git clone https://github.com/vmware/harbor
cd harbor/contrib/helm/harbor
```

### 3.2. Download Chart dependencies

```bash
helm dependency update
```

### 3.3. Update Helm chart for Harbor

We need to make some changes to values.yaml.

#### 3.3.1 Updates to values.yaml 

* Turn off certificate auto generation by Helm

    Since we are using kube-lego for automatically getting a TLS certificate from letsencrypt, we will need to turn off auto-generation of the certificate by Helm when deploying the chart.

* Update external domain
    
    Ensure external domain option is updated to reflect the ingress URL for harbor that we created in the previous step.

* Add annotations

    We need to add some k8s specific annotations to use TLS and NGINX as ingress controller.

* Add Azure storage account information

    Add Azure storage account information from the earlier step. 

Once the above changes are complete, your values.yaml should look like below. 

```yaml
 externalDomain: tmobile-Harbor-demo.eastus.cloudapp.azure.com
 generateCertificates: false
 ingress:
 annotations:
    kubernetes.io/tls-acme: "true"
    kubernetes.io/ingress.class: nginx
    ingress.kubernetes.io/ssl-redirect: "true"
    ingress.kubernetes.io/proxy-body-size: "0"
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
  objectStorage:
    gcs:
      keyfile: ""
      bucket: ""
      chunksize: "5242880"
    s3:
      region: ""
      accesskey: ""
      secretkey: ""
      bucket: ""
      encrypt: "true"
    azure:
      accountname: "Storage account name (from above)"
      accountkey: "Storage account key (from above)"
      container: "images"
```

### 3.4. Deploy to AKS
We can now deploy harbor to AKS using the Helm install command as shown below.

```bash

helm install . --debug --name my-release --set externalDomain=tmobile-harbor-demo.eastus.cloudapp.azure.com

```
At this point you should go get that coffee as it will take a little bit for Harbor deployment to be completely ready.

## 4.0. Verify the deployment
Verify all pods are in running state as well as ingresses. You can perform this using azure CLI or kubectl. 

Using Azure CLI
```bash
az aks browse --resource-group <YOUR RESOURCE GROUP> --name <KUBERNETES SERVICE NAME>
```

Using kubectl

```bash
kubectl get pods
kubectl get ing
```

### 4.1. Verify we can access the Harbor web UI

#### 4.1.1 Getting Harbor admin password
To login to Harbor web UI requires a user name and password. Run the kubectl command below to retrieve Harbor admin user password.

```bash
kubectl get secret --namespace default harbor-on-aks-harbor-adminserver -o jsonpath="{.data.HARBOR_ADMIN_PASSWORD}" | base64 --decode; echo
```

* Launch browser and navigate to https://tmobile-harbor-demo.eastus.cloudapp.azure.com 

* Login with admin credentials.

    Change the default admin password immediately as it is available on public domain.

### 4.2. Configure docker 

#### 4.2.1. Add the Harbor CA certificate to Docker
Make directory under "/etc/docker/certs.d/" and name it same as the FQDN you used for Harbor. For this POC since we used tmobile-harbor-demo for DNS, full FQDN is going to be "tmobile-harbor-demo.eastus.cloudapp.azure.com". Execute kubectl command below to download the CA cert which is stored as secret.

```bash
kubectl get secret \
    --namespace default harbor-on-aks-harbor-ingress \
    -o jsonpath="{.data.ca\.crt}" | base64 --decode | \
    sudo tee /etc/docker/certs.d/tmobile-harbor-demo.eastus.cloudapp.azure.com/ca.crt
```
#### 4.2.2. Login to Harbor registry using Docker CLI
Before we can push/pull images from registry, we need to login to the Harbor registry. Run command below to login to Harbor registry from Docker CLI. When prompted enter Harbor admin user credentials.

```bash
docker login tmobile-harbor-demo.eastus.cloudapp.azure.com

```

#### 4.2.3. Pushing a Docker image to Harbor registry
Run commands below to quickly test pushing. For this post I created a sample project called "fromhub" using Harbor web UI.

```bash 

#pull default hello world image from docker hub
docker pull hello-world

#tag image
docker tag hello-world:latest tmobile-harbor-demo.eastus.cloudapp.azure.com/fromhub/hello-world:latest

#push image to Harbor registry
docker push tmobile-harbor-demo.eastus.cloudapp.azure.com/fromhub/hello-world:latest

``` 
If all is well, the image should be successfully pushed and you should be able to login back into Harbor web UI and see it there.

#### 4.2.3. Enabling content trust and image signing
    
    Set environment variables to enable content trust and image signing as shown below

    ```bash
    export DOCKER_CONTENT_TRUST=1
    export DOCKER_CONTENT_TRUST_SERVER=https://<YOUR NOTARYDNS>.eastus.cloudapp.azure.com
    ```

If you are new to Harbor please check out [Harbor project](https://github.com/vmware/harbor) on Github

## 5.0. Resources
The following list of resources was immensely helpful, a huge shout out to everyone who contributed content to these articles. 

- <https://github.com/vmware/harbor>

- <https://github.com/vmware/harbor/tree/master/contrib/helm/harbor>

- <https://docs.microsoft.com/en-us/azure/aks/ingress#install-an-ingress-controller>

## 6.0. Final thoughts

Huge thanks to [Ram Gopinathan](http://twitter.com/rprakashg) for pointing me to look at Harbor project and reviewing this article and providing many comments and updates. This was a truly fun effort, and Harbor project is something that everyone should seriously have a look at if you are leveraging docker and containers in your organization.
