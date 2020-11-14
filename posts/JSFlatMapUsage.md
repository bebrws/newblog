---
title: 'Javascript FlatMap Usage'
author: 'Brad Barrows'
date: '2020-10-20'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## FlatMap is a great functional operation

FlatMap can be implemented as follows:

```
    Array.prototype.flatMaper = function(mapFunction) { return this.map(mapFunction).reduce((a, c) => { return [ ...a, ...(Array.isArray(c) ? c : [c]) ]; }, []) }
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

## Convincing? examples of why flatMap is so great

### You can now iterate over a list creating a new list with any number of values

Let's say you have some need to take a list and get all variations of that list. You might normally make some array and forEach iterate over each item.


```

    const items = ["book", "dog"];
    let variations = [];
    items.forEach(item => {
        variations.push(item);
        variations.push(item + "s");
    });
```

Or:

```

    const items = ["book", "dog"];
    let variations = [];
    items.forEach(i => variations = variations.concat([i, i + "s"]))
```

But now with flatMap:

```

    const items = ["book", "dog"];
    let variations = [];
    items.flatMap(i => [i, i + "s"])
```

### Creating a list of all combinations of items in two lists

```
    [1, 3].flatMap(d => [2, 4].map(v =>[d, v]))
```