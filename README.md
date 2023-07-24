# The Stevens Students Webring

Learn what a webring is [here](https://en.m.wikipedia.org/wiki/Webring)!

API is hosted at https://sitring.eric.si

All majors, years, and alumnis welcome!

## Joining

Feel free to make a PR to add yourself to data.json if you are

- A current student
- An alumni
- A professor
- Anyone that had a duckcard

By joining, you agree you will implement the webring in the footer of your website.

## API Endpoints

GET `/` will return the whole webring.

GET `/id` will return info about the node with the id `id`.

GET `/id/neighbors` will return info about the left and right node.

GET `/id/random` will return a random node that isn't the id, or the id's neighbors.

## Usage Static-Sites

You can easily show your webring through placing javascript in your `<head>` tag
and then creating a div.
in your HTML file:

```
<script type="module" src="https://sitring.eric.si/webring.js?id=YOUR_ID_HERE" id="webringjs"><script>
```

It is important that you have the script ID as "webringjs" in order to query your ID succesfully. Additionally,
you **must** have an element with ID "webring" in order to sucessfully output your webring links. Here is an example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script
      type="module"
      src="https://sitring.eric.si/webring.js?id=YOUR_ID_HERE"
      id="webringjs"
    ></script>
  </head>

  <div id="webring">
    <!-- the webring will automatically appear here -->
  </div>
</html>
```

## Other stuff

MIT License

This is a webring run by the stevens students, this is in no way an endorsement
from the institution in any way shape or form to any people in this ring. We're
simply students.
