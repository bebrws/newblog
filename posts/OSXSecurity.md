---
title: 'OSX - Manually configuring System Preferences Security And Privacy settings'
author: 'Brad Barrows'
date: '2019-07-01'
# hero_image: /static/niceday.png
---

I have a laptop which I wanted to be able to check the status of remotely.

For remote access on OSX I was using Jump Desktop.I had this same issue with RealVNC and other remote desktop services though.

Specifically, on Catalina I ran into an issue where after installing Jump Desktop Connect. I was not able to add Jump Desktop Connect to my Security And Privacy settings to enable the Screen Recording permission.

After some grepping.I figured out that a sqlite DB exists that contains all the OSX Catalina Security and Privacy settings.

This DB can be opened with:
```
  sudo sqlite3 /Library/Application\ Support/com.apple.TCC/TCC.db
```
The table of interest is called acccess.

To get some information on this table run:
```
  PRAGMA table_info(access);
  .schema access
```

And then checking out the already existing Privacy System Preferences is really helpful to figure out what is going on as well;

```
select * from access;
```


From the first command ().schema access), you will see it has the followign columns:
```
  0|service|TEXT|1||1
  1|client|TEXT|1||2
  2|client_type|INTEGER|1||3
  3|allowed|INTEGER|1||0
  4|prompt_count|INTEGER|1||0
  5|csreq|BLOB|0||0
  6|policy_id|INTEGER|0||0
  7|indirect_object_identifier_type|INTEGER|0||0
  8|indirect_object_identifier|TEXT|0||4
  9|indirect_object_code_identity|BLOB|0||0
  10|flags|INTEGER|0||0
  11|last_modified|INTEGER|1|CAST(strftime('%s','now') AS INTEGER)|0
```


So after figuring out the coumns in this table and with examples from pre existing rows I went about creating my own SQL queries to insert new Privacy options into System Preferences.


I then found a row for a service that had the permissions I wanted for Jump Desktop Connect
```
  kTCCServiceScreenCapture|com.apple.screensharing.agent|0|0|1||||UNUSED||0|1573525900
```
And then a row for Jump Desktop Connect itself:
```
  kTCCServiceAccessibility|com.p5sys.jump.connect|0|1|1|??|||UNUSED||0|1572360434
```
Now I have the client string I need and an example row. I duplicated the screensharing service row but switched out the Jump Desktop Connect client string and ran the following in the sqlite3 client:
```
  INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceScreenCapture','com.p5sys.jump.connect',0,0,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);
```
Then I was able to open System Preferences Security and Privacy settins and enable the Screen Recording permission on the application. It finally was showing the list. I probably could also just run

```
  INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceScreenCapture','com.p5sys.jump.connect',0,1,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);
```
To automatically enable this setting but I did not test this.




The other day I actually had some trouble screen sharing with Google Chrome as well. To fix this I just needed to figure out the applications "client" string:

```
com.google.Chrome
```
and
```
com.google.Chrome.canary
```
for Chrome Canary.

This I could create Screen Sharing options in the Privay preferences with:

```
INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceScreenCapture','com.google.Chrome',0,0,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);


INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceScreenCapture','com.google.Chrome.canary',0,0,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);
```


And I also created Accessibility options with:

```
INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceAccessibility','com.google.Chrome',0,0,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);


INSERT INTO access (service,client,client_type,allowed,prompt_count,csreq,policy_id,indirect_object_identifier_type,indirect_object_identifier,indirect_object_code_identity,flags,last_modified) VALUES (
  'kTCCServiceAccessibility','com.google.Chrome.canary',0,0,1,NULL,NULL,NULL,'UNUSED',NULL,0,1573525900);
```

just in case..