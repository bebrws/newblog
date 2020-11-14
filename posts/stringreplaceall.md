---
title: 'Modify String prototype for replaceAll'
author: 'Brad Barrows'
date: '2020-11-14'
# hero_image: /static/niceday.png
---
##  String replace all

```
String.prototype.replaceAll = function (find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};
```