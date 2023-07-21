# The Stevens Students Webring

Learn what a webring is [here](https://en.m.wikipedia.org/wiki/Webring)!

API is hosted at https://sitring.eric.si

All majors, years, and alumnis welcome!

## Joining
Feel free to make a PR to add yourself to data.json if you are
* A current student
* An alumni
* Anyone that had a duckcard

By joining, you agree you will implement the webring in the footer of your website.

## API Endpoints

GET `/` will return the whole webring.

GET `/id` will return info about the node with the id `id`.

GET `/id/neighbors` will return info about the left and right node.

## Usage Static-Sites

You can easily show your webring through placing the following in your ```<head>``` tag
in your HTML file:
```
<script type="module" src="https://sitring.eric.si/ring.js?id=YOUR_ID_HERE" id="webring"><script>
```
It is important that you have the script ID as "webring" in order to query your ID succesfully. Additionally,
you **must** have an element with ID "ring" in order to sucessfully output your webring links. Here is an example:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="icon" type="image/x-icon" href="/assets/icons/favicon.ico">
    <script type="module" src="https://sitring.eric.si/ring.js?id=YOUR_ID_HERE" id="webring"><script>
    <title>Webring</title>
  </head>

  <div id="ring">
    <h1>Check out my friends!</h1>
  </div>
</html>
```
Your links will be within the div with ID "ring".

## Other stuff

MIT License

This is a webring run by the stevens students, this is in no way an endorsement
from the institution in any way shape or form to any people in this ring. We're
simply students.
