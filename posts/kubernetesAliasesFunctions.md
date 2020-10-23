---
title: 'My Kubernetes aliases and functions using fzf'
author: 'Brad Barrows'
date: '2020-10-21'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## Helpful Kubernetes Aliases and Functions

I use fzf pretty extensively. I really appreciate how much time it can save looking up something like an id or namespace which will just need to be copied into the next command.

To save time I created a number of alises and functions which work with Kubernetes' kubectl to help me get information about a cluster and also exec shells.

### It begins.. 
It starts off with some aliases to help with monotonous tasks like getting a specific column.

### Then there are some helpful command to describe and delete resources

You could run:

```
    kd service
```
or
```
    kdservices
```            

For pods:

```
    kd pod
```
or
```
    kdpods
```            


### To describe certain resources

The kd function will work with any resource type.

So

```
    kd ingress
```

will even work to list all ingresses in all namespaces and then describe the one you select.


Command starting with kdel will delete resources.

### Spawning a shell on a pod in a container

To run a shell on a pod in a container run:

```
    kexBash 
```

or 

```
    kexSH
```

These are pretty powerful little functions.

You will be able to select the pod you want to a shell into, and then a secondary fzf selection will occur for the container.

### Kubernetes Events

The last and mose useful of all these is probably just getting events in a sorted order (by timestamp).

Kubernetes events has helped me debug by far the majority of the more challenging Kubernetes issues I hace run into.

```
    kgevents
```

## The actual code

```

    alias c1="awk '{print \$1}'"
    alias c2="awk '{print \$2}'"
    alias c3="awk '{print \$3}'"
    alias c4="awk '{print \$4}'"
    alias c5="awk '{print \$5}'"
    alias c6="awk '{print \$6}'"
    alias c7="awk '{print \$7}'"
    alias c8="awk '{print \$8}'"
    alias c9="awk '{print \$9}'"
    alias c10="awk '{print \$10}'"


    alias k='kubectl '

    function kebash() {
    kubectl exec --stdin --tty $@ -- /bin/bash
    }

    function kesh() {
    kubectl exec --stdin --tty $@ -- /bin/sh
    }

    alias kgp='kubectl get pods --all-namespaces'
    alias kgs='kubectl get services --all-namespaces'

    function kListContainersInPod() {
    for pod in $( kgp | ignoreFirstLine | c1 ); do 
        echo "\nPOD: $pod"
        kubectl get pod $pod -o=jsonpath='{.spec.containers[*].name}'; 
        echo "\n"
    done
    }


    function kLogAllContainersInPod() {
    for container in $(kubectl get pod $1 -o=jsonpath='{.spec.containers[*].name}'); do
        kubectl logs $1 --container $container | tail -20
    done
    }

    # function kLogAllContainersInPod() { for container in $(kubectl get pod $1 -o=jsonpath='{.spec.containers[*].name}'); do kubectl logs $1 --container $container | tail -20; done }

    function kLogsAllContainers() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo {} | xargs kubectl logs -n'  --preview-window=up:80% | xargs kubectl logs -n
    }
    alias klogs=kLogsAllContainers

    function kLogsContainer() {
        kubectl get pods -o name | fzf --preview="kubectl logs {} --container $1 | tail -20" --preview-window=up:80%
    }

    # function kShContainer() {
    #   export KPOD=$(kubectl get pods -o name | fzf)
    #   kubectl exec --stdin --tty $KPOD --container $1 -- /bin/sh
    # }

    function kexSh() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | read -r namespace pod
        echo "Looking up contianers now for:"
        echo "namespace $namespace"
        echo "pod $pod"
        export container=$(kubectl get pod -n $namespace $pod -o jsonpath='{.spec.containers[*].name}' | fzf)
        echo "Running shell:"
        kubectl exec -n $namespace --stdin --tty $pod --container $container -- /bin/sh
    }


    function kexBash() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | read -r namespace pod
        echo "Looking up contianers now for:"
        echo "namespace $namespace"
        echo "pod $pod"
        export container=$(kubectl get pod -n $namespace $pod -o jsonpath='{.spec.containers[*].name}' | fzf)
        echo "Running shell:"
        kubectl exec -n $namespace --stdin --tty $pod --container $container -- /bin/bash
    }




    function kBashContainer() {
        export KPOD=$(kubectl get pods -o name | fzf)
        kubectl exec --stdin --tty $KPOD --container $1 -- /bin/bash
    }


    function getAllPodsNamespaceAndName() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]} {.metadata.namespace}   {.metadata.name} {"\n"}' 
    }

    function kdpods() {
        getAllPodsNamespaceAndName | fzf --preview='echo {} | xargs kubectl describe pod -n' | xargs kubectl describe pod -n
    }
    function kdelpods() {
        getAllPodsNamespaceAndName | fzf --preview='echo {} | xargs kubectl describe pod -n' | xargs kubectl delete pod -n
    }

    function getAllServicesNamespaceAndName() {
        kubectl get services --all-namespaces -o jsonpath='{range .items[*]} {.metadata.namespace}   {.metadata.name} {"\n"}' 
    }

    function kdservices() {
        getAllServicesNamespaceAndName | fzf --preview='echo {} | xargs kubectl describe service -n' | xargs kubectl describe service -n
    }

    function kdelservice() {
        getAllServicesNamespaceAndName | fzf --preview='echo {} | xargs kubectl describe service -n' | xargs kubectl delete service -n
    }

    alias kg='kubectl get '
    # alias -g kd='kubectl describe '
    function kd() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo '"'"'{}'"'"' | xargs kubectl describe $1 -n' | xargs kubectl describe $1 -n
    }

    function kdelete() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | xargs kubectl delete $1 -n
    }

    function kgevents() {  kubectl get events --sort-by='.metadata.creationTimestamp'  }
    alias kgev=kgevents



```