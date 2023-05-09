<!-- 
# title: Building a Blog with GitHub Pages and Node.js despite the challenges
# description: I share my experience of building a blog using GitHub Pages and Node.js, despite the challenges of limited dynamic content.
# seo-description: Connor Jarrett shares his experience of creating a blog using GitHub Pages and Node.js and explains how he overcame the technical challenges involved in hosting and creating a blog.
# keywords: blog, github pages, blog tutorial, node.js, markdown, markdown blog, javascript blog
# image: making-a-blog.png
# date: 2023-5-7
-->

Making a blog has been on my to-do list for years. However, the technical challenges involved became a roadblock that prevented me from ever committing to create one.

## Hosting
Hosting was the first challenge. I had two options, renting server space (Like I did for [Cade](https://cade.dev)), or using GitHub Pages, a free hosting service from GitHub. I ruled off renting server space mainly for the fact that I didn't want to have to deal with maintenance, and I wasn't ready to commit to spending more money each month on something not designed to generate profit. However, GitHub Pages had it's own set of problems. The major issue is that it does not support server-side code or dynamic content; This means that I can't use APIs securely, or create databases with secure read/write permissions.

## Using Node.js to overcome limitations
I decided to use GitHub Pages to host, and I would make up for the lack of dynamic content with a script that would generate an HTML page for each article (written in Markdown), and use one template which would be easy to update at any time. This approach allowed me to attach some information at the top of each Markdown file including the article title, description, image and publishing date. By parsing this using Marked, a JavaScript markdown parser, I could fill in placeholders in a template I made to create pages that can be updated later with minimal effort.

## Why not create an HTML page for each article?
Creating an HTML page for each article seems convenient, completely cutting out the need for any complicated scripts, but it would mean that if I were to want to update the look of the article page, I would have to tediously edit each page, which could take hours or even days depending on the number of articles.

## Importance of design
Starting out, design wasn't a major concern, but I soon realised that it was essential to make my blog visually appealing if I wanted people to read it. I invested lots of time in crafting the design until it was perfect and creating a good logo to make it stand out from the rest.

## Create your own
If you're interested in creating your blog, there are plenty of resources you can use to help you get started. You could try a free tool like [Blogger](https://www.blogger.com) from Google, or you could try using a tool like Jekyll to help. Read more in [this article](https://chadbaldwin.net/2021/03/14/how-to-build-a-sql-blog.html)

## Conclusion
With the creation of my blog finally complete, it begins a whole new set of things to do like creating regular and engaging posts. I hope that all the effort I put in to this pays off and you found something in this article engaging and informative.