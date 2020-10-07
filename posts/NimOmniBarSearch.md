---
title: 'Nim Documentation Chrome Extension'
author: 'Brad Barrows'
date: '2020-7-01'
# hero_image: /static/niceday.png
---

I created a [Chrome Extension to search the Nim documenation from the Chrome Omnibar](https://chrome.google.com/webstore/detail/nim-language-omnibar-sear/melbldfjlacnhdbjbhbhlglaacgjnbgl?hl=en)

To get this to work I needed both a background script and a content script:

```
{
  "manifest_version": 2,
  "icons": { 
    "16": "nim16.png",
    "48": "nim48.png",
   "128": "nim128.png" 
  },
  "name": "Nim Language Omnibar Search",
  "description": "This extension will allow you to search the nim documentation by using the keyword 'nim' before a search in the omnibar.",
  "version": "0.0.4",
  "browser_action": {
    "default_icon": "./nim.png"
  },
   "content_scripts": [ {
      "all_frames": true,
      "js": [ "content.js" ],
      "matches": [ "http://nim-lang.org/*", "https://nim-lang.org/*" ],
      "run_at": "document_end"
   } ],
  "permissions": [     
    "tabs",
    "http://nim-lang.org/*", 
    "https://nim-lang.org/*"
  ],
  "omnibox": { "keyword" : "nim" },
  "background": {
    "scripts": [
      "background.js"
    ]
  }
}

```

The background script just listens for messages from the omnibar and sets the url to the Nim documentation page with a hash variable set to be the search value from the chrome omni bar:

```
chrome.omnibox.onInputEntered.addListener(function (text) {
    const url = `https://nim-lang.org/docs/lib.html#search=${text}`;
    console.log("nim extension background script just recieved text ${text} and is redirecting the current tab to: ${url}");
    chrome.tabs.update({ url: url });
});
```


The content script is where most of the work is done

```
function getObjectForURLHashValues()  {
  // This is from:
  // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
  var hash = window.location.hash.substr(1);

  var result = hash.split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
  }, {});

  return result;
}


console.log('nim extension content script loaded.');

function run() {
  console.log('nim extensino content script can see the DOM is loaded');


  // Don't actually start this whole process if the search  hash is not in the URL
  const hashKeyValueObject = getObjectForURLHashValues();
  if ("search" in hashKeyValueObject) {
    // var actualCode = `chrome.tabs.sendMessage(tabId, { source: window.search.toString() }, (resp) => { console.log('Recieved response', resp); });`  
    var actualCode = `window.postMessage({ type: "FROM_NIM_DOCS", source: window.search.toString() }, "*");`;
    
    // This code injection is from:
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
    document.documentElement.setAttribute('onreset', actualCode);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');

    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  }
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',run);
} else {
    run();
}

window.addEventListener("message", function(event) {
  if (event.source != window)
      return;

  if (event.data.type && (event.data.type == "FROM_NIM_DOCS")) {
      console.log('nim extension content script recieved a message from the page.');
      console.log(`nim documentation is using the following function to search: event.data.source`);

      const searchFunctionSource = event.data.source;
      const doSearchWithParens = searchFunctionSource.match(/dosearch_[a-zA-Z0-9_-]*\(+/g)[0];
      const doSearchunctionName = doSearchWithParens.substring(0, doSearchWithParens.length-1);

      const replaceFunctionWithParens = searchFunctionSource.match(/replace_by_id_[a-zA-Z0-9_-]*\(+/g)[0];
      const replaceFunctionName = replaceFunctionWithParens.substring(0, replaceFunctionWithParens.length-1);

      const hashKeyValueObject = getObjectForURLHashValues();
      console.log(hashKeyValueObject)

      const searchStringFromURL = hashKeyValueObject.search;

      // Now i just need to inject a call to:
      // replace_by_id_10926172("tocRoot", dosearch_11005547(searchStringFromURL));
      var actualCode = `${replaceFunctionName}("tocRoot", ${doSearchunctionName}("${searchStringFromURL}"))`;

      console.log(`nim extension content script is injecting JS to perform search operation for term ${searchStringFromURL}:`, actualCode);
    
      var script = document.createElement('script');
      script.textContent = actualCode;
      (document.head||document.documentElement).appendChild(script);
      script.remove();
  }
});
```



It starts off after document load by getting the javascript source for the search function. I didn't want to try and send events to the DOM to trigger a search (and since the search is all client side I cant make a GET or POST request to some API). 

The other issue is that the search javascript is generated by Nim from Nim code. This means that the generate javascript function names can change.

To make this future proof I just use a regex to search for parts of the function names that wont change.

Once I find the functions for replacing the DIV with the new search output (replaceFunctionName) and triggering a search itself (doSearchunctionName) I trigger an actual search:

```
      var actualCode = `${replaceFunctionName}("tocRoot", ${doSearchunctionName}("${searchStringFromURL}"))`;

      console.log(`nim extension content script is injecting JS to perform search operation for term ${searchStringFromURL}:`, actualCode);
    
      var script = document.createElement('script');
      script.textContent = actualCode;
      (document.head||document.documentElement).appendChild(script);
      script.remove();

```

One other tricky part is that Chrome Extension content scripts normally don't have access to the global context and therefore window.

To get access to this I injext javascript into the page which will post a message to a message handler I have setup in the content script.

The message post sends the javascript source for the search function:

```

    var actualCode = `window.postMessage({ type: "FROM_NIM_DOCS", source: window.search.toString() }, "*");`;
    
    // This code injection is from:
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
    document.documentElement.setAttribute('onreset', actualCode);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');

    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
```

The message handler does the function name searching and executing of the search.