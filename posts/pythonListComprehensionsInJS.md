---
title: 'Python List Comprehension in Javascript'
author: 'Brad Barrows'
date: '2020-10-20'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## Getting something better than Python style list comprehension in Javascript

The javascript spread operator opened my eyes to an easy way to get Python style list comprehension in Javascript.

By creating an array and spreading another array into it while doing some operation on the inner array we effectively have Python style list comprehension.

For example:

```

    const anArray = [1,2,3];
    console.log([ ...anArray.map(x => x*2)]);

```

This will print out:

```
    [ 2, 4, 6 ]
```

The similar code in Python would be:

```
     [ n * 2 for n in [1, 2, 3] ]
```

I actually think that using spread is more readable in some ways. It all makes sense that you can peice together the spread operator with the functional style methods on Arrays to get the same functionality as a list comprehension in Python to me. I like that this "problem" is solved by a combination of basic Javascript functionality instead of creating a new syntax just to add functionality like a list comprehension as well.

This all makes so much sense and seems so obvious to me now that I am guessing this was probably part of the proposal for the spread operator itself.. or something like that.

### Even better than with Python list comprehensions IMO

What I like even more than Python list comprehension here is that you can mix and match the arrays you spread into the new array to combine multiple list comprehensions into one with an easy to read syntax

For example:

```

    const anArray = [1,2,3];
    const anotherArray = [2,4,6];
    console.log([ ...anArray.map(x => x*2), ...anotherArray.map(x => x/2)]);

```

This will print out:

```
    [ 2, 4, 6, 1, 2, 3 ]
```

The python code for this would be require concatenating 2 seperate list comprehensions I believe.

I know you can [iterate over multiple lists at the same time in Python](https://stackoverflow.com/questions/16568056/nested-list-comprehension-with-two-lists) but I don't believe you can perform operations on lists and then order the results in any specific manner like the example does above.

In Python you can do:

```
    [x + y for x in [1, 3] for y in [2, 4] ]
```

In Javascript you could:

```
    [1, 3].flatMap(d => [2, 4].map(v => d + v))
```

Although this is getting a little flame war like now...


A more useful example of list comprehensions in JS maybe?

```

    Array.prototype.flatMap = function(mapFunction) { return this.reduce((a, c) => { return [ ...a, ...c ]; }, []).map(mapFunction) }
    const containersInPod1 = ['nginx'];
    const containersInPod2 = ['node', 'mongo'];
    const continaersFromOtherNamespace = ['cert-manager', '']
    [containersInPod1, containersInPod2].flatMap(x => x)

```