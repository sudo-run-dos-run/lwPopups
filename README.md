# lwPopups
lwPopups is a lightweight JavaScript window manager for any website

# Features
* Injects its entire contents inside one child node of the html-body ("popUpContainer")
  * Doesn't bloat the run time DOM
  * Nicely self-contained
  * Does not influence the underlying website
* Manages all the important popup look & feel stuff
  * Popups can overlap
  * Manages layer behavior
  * Brings active windows to the foreground
  * Ensures correct visibility
  * Popups have some transparency, and even more transparency when without focus
  * Robust design & graceful degradation when parameters are not given
    * Always tries to open a popup and guess missing parameters
    * Tries to provide meaningful values when parameters are undefined
* Supports self-closing timeout popups
* Dependencies only on jQuery & jQuery UI

# How to use it (namespace)
The API is located at: "lwPopups"
* Example: Create and display a simple text window
  * lwPopups.showText("Le Title", "Oh hai!");

# How it looks
Supports a huge variety of popups for standard purposes or from remote API calls for popular social media websites
* Text
* Images
* Youtoube videos
* Twitter tweets
* Rumble videos
* Twitch streams
* Bandcamp playlists

![Screenshot UTF8 mode](/github-resources/screenshot-lwPopups.jpg)
