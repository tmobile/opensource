+++
tags = ["Harbor", "Azure", "AKS", "K8s", "T-Mobile", "Microsoft", "VMware"]
categories = ["Azure", "K8s", "AKS", "Harbor", "VMWare"]
author = "Prashant Gupta"
draft = false
date = 2018-05-30T13:19:22-07:00
title = "Deploying VMWare harbor on Azure Kubernetes Service aka AKS"

+++

VMware [harbor](https://github.com/vmware/harbor) is an open source all in one enterprise-class container registry that extends open source docker distribution and adds many functionalities that are typically required in the enterprise such as:

* container registry

* container image vulnerability scanning

* notary (Content trust and digital signing)

We recently went through an evaluation process of VMware harbor and had to deploy it on our Azure Kubernetes cluster. Harbor project currently includes a [helm chart](https://github.com/vmware/harbor/tree/master/contrib/helm/harbor) that can be used to deploy to a kubernetes cluster, unfortunately, with AKS we had to make some edits to the Helm chart as well as perform some additional steps.
This article is meant to provide a walkthrough/guide to deploy VMWare Harbor on Azure Kubernetes Service (AKS).

## Pre-Requisites

* AKS cluster provisioned in your Azure Account

    Creating a Kubernetes cluster on Azure is pretty simple and can be quickly done by utilizing either [Azure CLI](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) or from [Azure Portal](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal). There is a known issue with the Harbor helm chart, chart doesn't work with Kubernetes 1.8.9+ and 1.9.4+ versions. So if you are testing this out, be sure to use version 1.8.7. See more info on chart known issue [here](https://github.com/vmware/harbor/issues/4496)

* Helm installed and configured

    If this your first time using helm, you can learn more about Helm [here](https://docs.helm.sh/) and install and configure helm using instructions available [here](https://github.com/kubernetes/helm/blob/master/docs/install.md), additionally be sure to initialize helm with default service account as shown below.

    ```#!/bin/bash
    helm init --service-account default
    ```
 
## Installing VMWare Harbor on Azure Kubernetes Service

## 1.0. Create Ingress Controllers for harbor and notary
We need to create two ingress controllers to allow users to access both Harbor and Notary services. Follow the instructions available in this [tutorial](https://docs.microsoft.com/en-us/azure/aks/ingress) to create ingress controllers. We only need to follow steps highlighted in these sections.

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

## 2.0. Create an Azure Storage Account

Harbor registry requires persistent blob storage to store all the docker images. Since we are deploying this on Azure we will need to use Azure Blob storage. Follow instructions below to create an Azure Storage Account in your subscription. One thing to keep in mind here is we need to ensure Azure storage account is created in "EastUS" region as AKS in the preview is currently only available in that region. We don't want our AKS cluster in EastUS and Storage Account used by VMware harbor to store images be in a different region. 
 

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

## 3.0. Deploy harbor using helm chart

### 3.1. Download helm chart from Harbor GitHub repository

```bash
git clone https://github.com/vmware/harbor
cd harbor/contrib/helm/harbor
```

### 3.2. Download Chart dependencies

```bash
helm dependency update
```

### 3.3. Update helm chart for Harbor

We need to make some changes to values.yaml and secret.yaml files

#### 3.3.1 Updates to values.yaml 

* Turn off certificate auto generation by helm

    Since we are using kube-lego for automatically getting a TLS certificate from letsencrypt, we will need to turn off auto-generation of the certificate by helm when deploying the chart.

* Update external domain
    
    Ensure external domain option is updated to reflect the ingress URL for Harbor that we created in the previous step.

* Add annotations

    We need to add some k8s specific annotations to use TLS and NGINX as ingress controller.

* Add Azure storage account information

    Add Azure storage account information from the earlier step. 

Once the above changes are complete, your values.yaml should look like below. 

```yaml
 externalDomain: tmobile-harbor-demo.eastus.cloudapp.azure.com
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

#### 3.3.2 Updates to secret.yaml
By default common name for CA certificate is hardcoded to harbor-ca, we will need to change this to reflect the correct FQDN from ingress URL we created earlier. For this post we are setting it to "tmobile-harbor-demo.eastus.cloudapp.azure.com. You can find the secret.yaml under "/contrib/helm/harbor/templates/ingress" directory.

Your secret.yaml should look like below after the above mentioned updates are complete.

```yaml
{{ if not .Values.insecureRegistry }}
{{ if .Values.generateCertificates }}
{{ $ca := genCA “tmobile-harbor-demo.eastus.cloudapp.azure.com” 3650 }}
{{ $cert := genSignedCert (include “harbor.certCommonName” .) nil nil 3650 $ca }}
apiVersion: v1
kind: Secret
metadata:
 name: “{{ template “harbor.fullname” . }}-ingress”
 labels:
{{ include “harbor.labels” . | indent 4 }}
type: kubernetes.io/tls
data:
 tls.crt: {{ .Values.tlsCrt | default $cert.Cert | b64enc | quote }}
 tls.key: {{ .Values.tlsKey | default $cert.Key | b64enc | quote }}
 ca.crt: {{ .Values.caCrt | default $ca.Cert | b64enc | quote }}
{{ end }}
{{ end }}
```

### 3.4. Deploy to AKS
We can now deploy harbor to AKS using the helm install command as shown below.

```bash

helm install . --debug --name my-release --set externalDomain=tmobile-harbor-demo.eastus.cloudapp.azure.com

```

Since we will be using docker CLI to push images into registry, we will need to complete instructions shown in output after helm install command suceeds to integrate docker CLI with newly deployed container registry on AKS.

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

Verify we can access the Harbor web UI

* Launch browser and navigate to https://YOUR_HARBOR_DNS_NAME.eastus.cloudapp.azure.com 

* Login with admin credentials. Default credentials are
    * username=admin password="Harbor12345"

    Change the admin password immediately as it is available on public domain.

* Configure docker for enabling content trust and image signing
    
    Set environment variables to enable content trust and image signing as shown below

    ```bash
    export DOCKER_CONTENT_TRUST=1
    export DOCKER_CONTENT_TRUST_SERVER=https://<YOUR NOTARYDNS>.eastus.cloudapp.azure.com
    ```

Play around with harbor by creating new projects, registries. For more details and videos [visit](https://github.com/vmware/harbor)

## 5.0. Resources
The following list of resources was immensely helpful, a huge shout out to everyone who contributed content to these articles. 

- <https://github.com/vmware/harbor>

- <https://github.com/vmware/harbor/tree/master/contrib/helm/harbor>

- <https://docs.microsoft.com/en-us/azure/aks/ingress#install-an-ingress-controller>

## 6.0. Final thoughts

Huge thanks to [Ram Gopinathan](http://twitter.com/rprakashg) for pointing me to look at Harbor project and reviewing this article and providing many comments and updates. This was a truly fun effort, and Harbor project is something that everyone should seriously have a look at if you are leveraging docker and containers in your organization.