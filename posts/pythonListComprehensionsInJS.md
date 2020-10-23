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

What I like even more than Python list comprehension here is that you can mix and match the arrays you spread into the new array to combine multiple list comprehensions into one.

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

Instead of having to do something like 2 different list comprehensions in Python and combine the 2 lists.

