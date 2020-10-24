---
title: 'Javascript FlatMap Usage'
author: 'Brad Barrows'
date: '2020-10-20'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## FlatMap is a great functional operation

FlatMap can be implemented as follows:

```
    Array.prototype.flatMaper = function(mapFunction) { return this.map(mapFunction).reduce((a, c) => { return [ ...a, ...(c.length ? c : [c]) ]; }, []) }
```

Which is a method on Arrays (when implemented) which will do something akin to mapping over each value in an array, doing some operation, followed by a reduce step which then takes each object returned from that inital map step and if that object is an array, then flattens or spreads the array into the final resulting array (the reduce step's accumulator) if the current object from the map step is not an array then the object itself is added into the resulting array (which is again, the reduce steps accumulator). The reduce steps accumulator in this flatMap implementation is an empty array.

This is an example of just flattening an array of arrays without mapping:

```
     [[1], [2,3]].reduce((a, c) => { return [ ...a, ...c ]; }, [])
```

Which will produce the same as the following. Here I have the map function returning the values from the array unchanged, removing the use of the map step, in an attempt to show how this is similar to the reduce example flattening arrays above:

```
    [[1], [2,3]].flatMap(x => x)
```

This results in output:

```
    [1, 2, 3]
```

## Map, flatMap and the 1 to 1 vs 1 to many outputs

FlatMap is great in my opinion because while with map you get to iterate over each value, doing some operation, with flatMap you can have your operation return any number of results. This removes to 1 to 1 constraint that you get between values and results when mapping over an array.
