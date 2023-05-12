<!-- 
# title: Adding a mailing list to a GitHub pages site through getform.io
# description: I dive in to the challenges of trying to create a mailing list whithout acccess to a backend
# seo-description: Connor Jarrett explores the solutions and processes for creating a mailing list for a blog, and why it isn't as easy as it might seem.
# keywords: mailing list, github pages, github, emails, email service, getform, mailchimp, email notifications, notifications
# image: mailing-list.png
# date: 2023-5-12
-->
For my blog, I knew that I would want a mailing list so that people can be informed when the next post is. But, because it's hosted on GitHub pages, that wasn't as easy as I might have thought and took some real thinking and helpful services to get it done.

## The problems with static pages
I fully explore the problems with static pages in [this article](https://labnotebook.connorjarrett.com/post/building-a-blog-with-github-pages-and-nodejs-despite-the-challenges), but I'm going to touch on them here to keep you updated. The main issue here is the lack of being able to securely implement a backend. Having a backend for my page would allow me to create a database where I can add emails, remove emails and handle the whole process with ease. It also doesn't allow me to securely use APIs, so linking to something like Firebase wouldn't be much help either.

## What about email services
I originally looked at the option of using an email service like [Mailchimp](https://mailchimp.com/) and some of its alternatives, but the most reputable of these services required for you to link your Address at the bottom, now while this helps in deterring and stopping scammers and phising emails, it makes my situation more difficult. For obvious reasons, I did not want to post my home address at the end of each email, and spending money on something like renting a PO box wasn't something I was interested in doing either.

## The solution
As it turns out, the solution was a service that I had used before on an older version of my [connorjarrett.com](https://connorjarrett.com) website. [getform.io](https://getform.io) is a service that allows for one free form endpoint, hosted by them. In simpler terms, this service allows for me to use them as a database, while not having read permissions open to the public. Even better, their services come with a free API that I can use to fetch, parse, and email everyone on my mailing list.

## The drawbacks
While I had found the solution that would work the best, I was not there yet. Seeing as I'm on the free plan, I can only have one endpoint, which means that I can only use this service for the one mailing list and nothing else in the future, unless I decide to delete my mailing list. Another drawback is because I am sending the emails myself, meaning that the emails may not even get through the spam filter, or if they do will have a low click rate. I also have to handle unsubscribes completely myself.

## Managing emails via SMTP
With signups out of the way, I now needed a way for people to actually receive email notifications, and because Getform was not necessarily designed to manage a mailing list I had to get creative. I settled on using a Node.js module called `nodemailer` to handle emailing. I had to plug in some basic SMTP information that I found on [Apple's website](https://support.apple.com/en-gb/HT202304) and then, quite simply, had to fetch all the subscribers via the Getform API and send each person a custom email where I'd modify a template to fill in some of their personal info.

## Unsubscribing
There really is no clean way I can think of handling unsubscriptions, even if the Getform API allowed for me to remove entries from an API request, it would be extremely insecure if I were to expose that URL to the frontend seeing as I have no server to go in the middle, people would be able to unsubscribe anyone, and perhaps everyone from the mailing list. Right now I've decided that my best solution is just to get people to email me to unsubscribe, seeing as, realistically, I'm not going to be getting an awful lot, if any of subscriptions.

## Conclusion
Making a mailing list on a static website may look easy at first, but lots of small annoyances push it further and further away from being a simple task. If I had a business address to put on the emails, I would have definitely opted for Mailchimp as it seemed to be the easiest solution, but, the workaround I have with Getform, while it may be lacking in some areas, works for a system where there will be a low number of subscribers.