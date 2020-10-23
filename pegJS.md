---
title: 'Playing around with parsing expression grammar and PEG.js'
author: 'Brad Barrows'
date: '2020-9-07'
# hero_image: /static/niceday.png
---
## Parsing expression grammar

Parsing expression grammar is a newer type of parser than the others I have read about and barely used.

I actually briefly used it once for a job years ago and really enjoyed working with it. It is one of the only grammar syntaxes that I felt like I could just pick up. 

[PEG.js](https://pegjs.org/) is a great way to get started and work with parsing expression grammar.

Not only is it incredibly easy to use, with a syntax that is readable without hours spent over documentation, but it is also powerful. Able to parse complicated languages with relativley simple and concise grammars.

## Parsing mathematical operations using parsing expression grammar and PEG.js

If you checkout the [documentation](https://pegjs.org/documentation) you will see an example:

```
start
  = additive

additive
  = left:multiplicative "+" right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
```

To keep things simple I am using this example to start working with. It doesn't suppport any spaces so don't let that trip you up.

Try copying it into the [online PEG.js parser](https://pegjs.org/online) and using the input: 
```
5+2*10+5
```

This will parse and output the correct value, 30.


Reading this I didn't like how if I wanted to add operations I would have to string them together in the order of the operations that should be done from last to first, moving from the file from top to bottom. (For example, when parsing mathematical operations we would want to parse and compute the multiplication operations before addition. Notice multiplication is mentioned "inside" the additive definition.)

When I first looked at parsing expression grammar I was kind of hoping I could write something like:


```
{ console.log("\n\n"); }

start
  = Node*
  
Node = additive
  / multiplicative
  / primary

additive
  = left:Node "+" right:Node { console.log("add"); return left + right; }

multiplicative
  = left:Node "*" right:Node { console.log("mult"); return left * right; }

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
```

And then also have some way to order the priority of the operations. This is not something you can do with parsing expression grammar though and probably would be more complicated than how this actually works anyway.

In my attempt to get something like this to work though I was able to remind myself of how parsing expression grammar works with some simple examples.

I started with the input:
```
5*2+2
```
for these tests.

So taking what I had above I just tried to get a result and ended up with:

```
{ console.log("\n\n"); }

start
  = Node*
  
Node = additive
  / multiplicative
  / primary

additive
  = left:multiplicative "+" right:primary { console.log("add"); return left + right; }

multiplicative
  = left:primary "*" right:primary { console.log("mult"); return left * right; }

primary
  = integer

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
```

This will work because if the parser starts at start it looks for one or more Nodes. A Node can be either
```x+y ```
```x*y```
```x```
if x and y are integers.

So it looks for a Node and then checks the first option, additive. Well additive is multiplicative + primary (primary is integer in this example) so it will have to check if there is a multiplicative first.

When we get to multiplicative it will check for a primary * primary. Since primary is really just an integer which has an actual regex expression to match it can now quick looking through the tree and check for a match. So now it is looking for characters that match the regular expression
```
[0-9]+\*[0-9]+
```

And so the first thing it does is match multiplicative!

Working back up the tree now back to additive it would need to match a + character followed by an integer which it can. So we now have parsed the entire string into a tree that should look like
```
                                                
                   ┌─────────────┐              
                   │  additive   │              
                  ┌┴─────────────┴┐             
                  │               │             
                  │               │             
                  │               │             
     ┌────────────┴───┐          ┌┴────────────┐
     │ multiplicative │          │   primary   │
     ├──────────────┬─┘          └─────────────┘
     │              │                           
     │              │                           
┌────┴────────┐   ┌─┴───────────┐               
│   primary   │   │   primary   │               
└─────────────┘   └─────────────┘               
```

And if we check the console logs you should see:

```
mul
add
```

Showing you that multiplicative was in fact matched before additive.

Now if we wanted for some reason to switch the order of operations here so that addition had a higher priority, happening before multiplication, then we could use a grammar like:

```
{ console.log("\n\n"); }

start
  = Node*
  
Node = additive
  / multiplicative
  / primary

additive
  = left:primary "+" right:primary { console.log("add"); return left + right; }

multiplicative
  = left:primary "*" right:additive { console.log("mult"); return left * right; }

primary
  = integer

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
```

If you check the logs you will see
```
add
mul
```

And the AST (Abstract Syntax Tree) would look like:

```
                                                
                   ┌───────────────────┐              
                   │  multiplicative   │              
                  ┌┴───────────────────┴             
                  │               │             
                  │               │             
                  │               │             
     ┌────────────┴───┐          ┌┴────────────┐
     │ additive       │          │   primary   │
     ├──────────────┬─┘          └─────────────┘
     │              │                           
     │              │                           
┌────┴────────┐   ┌─┴───────────┐               
│   primary   │   │   primary   │               
└─────────────┘   └─────────────┘               
```

Now might be a good time to point out that multiplicative is higher up in the tree that additive. So why is add being logged out before mul and why am I saying it is "before" multiplicative?

Well in this case additive is fully matched before multiplicative and able to be "evaluated" first leading to that first console.log printing out "add". That also reminds me that this is a depth first search of the grammar which is why I believe they call the family of parsers that parsing expression grammar parsers are in ["top down parsers"](https://en.wikipedia.org/wiki/Top-down_parsing).


After being satisfied with how the example from the documentation was ordering the different expression in order to provide an order of operations I moved on to trying to fix the mess I had made.

I first went with:

```
{ console.log("\n\n"); }

start
  = Node*
  
Node = additive
  / multiplicative
  / primary

multPrim = multiplicative / primary

additive
  = left:multPrim "+" right:multPrim { console.log("add"); return left + right; }

multiplicative
  = left:primary "*" right:primary { console.log("mult"); return left * right; }

primary
  = integer

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
```

This will work with input like:
```
5+2*10
```
But fail with:
```
5+2*10+5
```

In the first input it is matching multiplicative first from the right side of the additive expression (meaning the multPrim expression right after the "+" match). It then is going to look for and match additive "+" multPrim.

This is going to break with the second input it would need to create an AST that looks like:
```

                                            ┌─────────────┐                
                                            │  additive   │                
                                          ┌─┴─────────────┴──┐             
                                          │                  │             
                                          │                  │             
                                          │                  │             
                                          │                  │             
                                          │                  │             
                                          │                  │             
                                          │                  │             
                         ┌─────────────┬──┘                 ┌┴──────▶─────┐
                         │  additive   │                    │   primary   │
                        ┌┴─────────────┴┐                   └─────────────┘
                        │               │                                  
                        │               │                                  
                        │               │                                  
           ┌────────────┴───┐          ┌┴────────────┐                     
           │ multiplicative │          │   primary   │                     
           ├──────────────┬─┘          └─────────────┘                     
           │              │                                                
           │              │                                                
      ┌────┴────────┐   ┌─┴───────────┐                                    
      │   primary   │   │   primary   │                                    
      └─────────────┘   └─────────────┘                                    

```

but it cannot do this because currently an additive cannot add an additive and primary. Just a multiplicative and a primary(multiplicative or primary really).

So to fix this:

```
{ console.log("\n\n"); }

start
  = Node*
  
Node = additive
  / multiplicative
  / primary

multiplicativeorprimary = multiplicative / primary

additivemultiplicativeorpromary = additive / multiplicative / primary

additive
  = left:multiplicativeorprimary "+" right:additivemultiplicativeorpromary { console.log("add"); return left + right; }

multiplicative
  = left:primary "*" right:primary { console.log("mult"); return left * right; }

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }


```


And now we get the logs we expect:

```
  mult
  add
  add
```

Note how I needed to create a new type multiplicativeorprimary which doesn't include the additive type. This is because in parsing expression grammars you cannot have an expression show up in the left side of its definition. It will create a loop that it cannot solve and will crash the parser.

This last grammar should now handle any combination of addition and multiplication. It was also easier for me to read at this point than the original in some ways but that is probably just because I had been playing around with it.

