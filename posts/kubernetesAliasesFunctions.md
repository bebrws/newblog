---
title: 'My Kubernetes aliases and functions using fzf'
author: 'Brad Barrows'
date: '2020-10-21'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---

## The actual code

```
    alias kgp='kubectl get pods --all-namespaces'
    alias kgs='kubectl get services --all-namespaces'

    function kLogsAllContainers() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo {} | xargs kubectl logs -n'  --preview-window=up:80% | xargs kubectl logs -n
    }
    alias klogs=kLogsAllContainers

    function kLogsContainer() {
        # The first argument to this function should be the container name
        kubectl get pods -o name | fzf --preview="kubectl logs {} --container $1 | tail -20" --preview-window=up:80%
    }

    function kexSh() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | read -r namespace pod
        export container=$(kubectl get pod -n $namespace $pod -o jsonpath='{.spec.containers[*].name}' | fzf)
        kubectl exec -n $namespace --stdin --tty $pod --container $container -- /bin/sh
    }


    function kexBash() {
        kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | read -r namespace pod
        export container=$(kubectl get pod -n $namespace $pod -o jsonpath='{.spec.containers[*].name}' | fzf)
        kubectl exec -n $namespace --stdin --tty $pod --container $container -- /bin/bash
    }

    function kd() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview="echo '{}' | xargs kubectl describe $1 -n" | xargs kubectl describe $1 -n
    }

    function kdelete() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf | xargs kubectl delete $1 -n
    }

    alias kdpod='kd pod'
    
    alias kdelpod='kdelete pod'

    alias kdservice='kd service'

    alias kdelservice='kdelete service'

    alias kg='kubectl get '
    
    function kgevents() {  kubectl get events --sort-by='.metadata.creationTimestamp'  }
    alias kgev=kgevents

```


## Helpful Kubernetes Aliases and Functions Explained

I use fzf pretty extensively. I really appreciate how much time it can save looking up something like an id or namespace which will just need to be copied into the next command.

To save time I created a number of alises and functions which work with Kubernetes' kubectl to help me get information about a cluster and also exec shells.

### It begins.. 
It starts off with some aliases to help with monotonous tasks like getting a specific column.

### Then there are some helpful command to describe and delete resources

![Describing pods](/static/kdpod.gif)

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

![Spawning a shell on a pod in a container](/static/kexsh.gif)

To run a shell on a pod in a container run:

```
    kexBash 
```

or 

```
    kexSH
```

These are pretty useful little functions.

You will be able to select the pod you want to a shell into, and then a secondary fzf selection will occur for the container.

### Kubernetes Events

The last and mose useful of all these is probably just getting events in a sorted order (by timestamp).

Kubernetes events has helped me debug by far the majority of the more challenging Kubernetes issues I hace run into.

```
    kgevents
```

#### Why are events useful?

When I run into frustrating issues with Kubernetes, things that I overlooked, I am usually able to pretty quickly figure out what I missed just by looking at the events being logged.

For example, if you are missing some secret or something needed for a volume to mount, that will show up in Kubernetes events if I remember correctly.

I would deffinately recommend checking it out if you ever are stuck.
