---
title: 'Escaping Single Quotes Within Single Quotes in Bash and ZSH'
author: 'Brad Barrows'
date: '2020-10-20'
# hero_image: /static/chrome-bookmark-history-search-ex-usage.gif
---
## Escaping single quotes for Bash and ZSH

While writing a bash/zsh function which used fzf I needed to use the string "$1" and "$2" without them being evaluated.

I realize now that I could have probably just done: "\$2"

My command (before realizing I didn't even need the awk command!) was:

```
    function kd() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo '"'"'{}'"'"' | awk '"'"'{print $1, $2}'"'"' | xargs kubectl describe pod -n' | awk '{print $1, $2}' | xargs kubectl describe $1 -n
    }
```

As I said above I could just have used double quotes for the awk command and escaped the dollar sign:

```
    function kd() {
    kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo '"'"'{}'"'"' | awk "{print \$1, \$2}" | xargs kubectl describe pod -n' | awk '{print $1, $2}' | xargs kubectl describe $1 -n
    }
```

But before realizing that, and yes, that I don't even need the awk command in the first place, I went about escaping the single quote like you can see in the first code excerpt above.

I wanted to make a note that what is happening here is that I am ending the single quoted string, then starting a new string using double quotes which is tehn concatenated onto the first single quoted string.

For example:

```
    echo 'awk '"'"'{print $1, $2}'"'"''
```

is a valid statement which will echo out an awk command:

```
    awk '{print $1, $2}'
```

What I find interesting about this escaping is that I can actually concatenate strings of different type (single or double quote type) together just by placing them next to each other. 

And if it is not clear what is happening in that jumble of quotes:

```
    '"'"'
```

Is that it is ending the single quote string, then starting a double quote string which contains a single single quote. It then ends the new double quote string and started the single quote string back up again. Thereby insterting a single quote into a single quoted string.



### The final commmand

If you are interested the final command without all the extra unnecessary commands and string escaping is:

```
    function kd() {
        kubectl get $1 --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{"\t"}{.metadata.name}{"\n"}' | fzf --preview='echo '"'"'{}'"'"' | xargs kubectl describe pod -n' | xargs kubectl describe $1 -n
    }

```