---
title: 'Javascript FlatMap Usage'
author: 'Brad Barrows'
date: '2020-10-20'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## FlatMap is a great functional operation

FlatMap can be implemented as follows:

```
    Array.prototype.flatMap = function(mapFunction) { return this.map(mapFunction).reduce((a, c) => { return [ ...a, ...c ]; }, []) }
```

This is an example of just flattening an array of arrays without mapping:

```
     [[1], [2,3]].reduce((a, c) => { return [ ...a, ...c ]; }, [])
```

Which will produce the same as: 

```
    [[1], [2,3]].flatMap(x => x)
```

Results in output:

```
    [1, 2, 3]
```

## Map, flatMap and the 1 to 1 vs 1 to many outputs

Flat mapping is great in my opinion because while with map you get to iterate over each value, doing some operation, with flat map you can have your operation return any number of results. This removes to 1 to 1 constraint that you get between values and results when mapping over an array.

Here is an example use case.

Say I had a function to get all the container names in a kubernetes pod and a function to get all the pod names in a cluster. I will mock these out:

```

    function getContainerNames(podName) {
        if (podName === 'blog') {
            return ['node', 'grunt'];
        } else {
            return ['nginx'];
        }
    }

    function getPodNamesInCluster() {
        return ['blog', 'webserver'];
    }

```

Then say I had a function to get some information via the container name. I can flatMap an array of arrays into one list and then iterate over all containers in a nice functional style:

```
    function getInfoForContainer() {
        const allContainerNamesByPod = getPodNamesInCluster().map(pod => getContainerNames(pod));
        const allContainerNames = allContainerNamesByPod.flatMap(container => { return `Doing something for container ${container}`; });
        console.log(allContainerNames);
    }
```

This is alternative to something like:

```
    function getInfoForContainer() {
        const allContainerNamesByPod = getPodNamesInCluster().map(pod => getContainerNames(pod));
        let allContainerNames = [];
        for (containersInPod of allContainerNamesByPod) {
            for (container of containersInPod) {
                allContainerNames.push(`Doing something for container ${container}`);
            }
        }
        console.log(allContainerNames);
    }
```

Instead of flatMap you could aways flatForEach:

```
    Array.prototype.flatForEach = function(forEachFunction) { this.reduce((a, c) => { return [ ...a, ...c ]; }, []).map(mapFunction) }

    [[1], [2, 3]].flatForEach(x => console.log(`x is ${x}`))

```

The flattening possibilities are endless!

Again I believe the most interesting aspect of the flat* operations would be that you no longer have the 1 to 1 ratio between inputs and outputs that you have with a regular map function. By flat mapping you can create a result that contains any number of outputs for each single input.