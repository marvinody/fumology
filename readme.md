# [Fumology](https://fumo.systems/)
A small blog site dedicated to capturing moments from fumo lore to preserve them for future readers.

## Contributing
Add a new folder in `content/posts` and include any images in an images folder. Videos should be linked outside sources. Any iamge should contain a link to the source that you pulled it from if sensible (twitter link for twitter image, discord chat link for discord chat logs, etc.). Add an `index.md` file that tells the story. 

You're recommended and encouraged to see the source of other posts to see formatting directives.

Locally, make sure you have [Hugo](https://gohugo.io/) installed and then you can run `hugo server -D` to run the server in draft mode. Once you're ready to commit your changes and make a merge request, change the `draft` flag in your post to false and Netlify will auto-publish your branch in a preview URL.