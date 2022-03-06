# Fumology
A small blog site dedicated to capturing moments from fumo lore to preserve them in case anything happens.

## Contributing

### Initial Setup
- Clone the project, cd into newly cloned project and run `git submodule update --init`.
- Install Hugo

### Adding new post
`hugo new posts/<posttitle>/index.md` where you replace `<posttitle>` with the post title you want.
Include any images in an images folder. Videos should be linked outside sources. Any image should contain a link to the source that you pulled it from if sensible (twitter link for twitter image, discord chat link for discord chat logs, etc.). In the `index.md` file, you can tell the story. 

You're recommended and encouraged to see the source of other posts to see formatting directives.

Locally, make sure you have [Hugo](https://gohugo.io/) installed and then you can run `hugo server -D` to run the server in draft mode. Once you're ready to commit your changes and make a merge request, change the `draft` flag in your post to false and Netlify will auto-publish your branch in a preview URL.