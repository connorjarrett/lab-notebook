<!-- 
# title: How I made a smart assistant by harnessing the power of Google Search
# description: I look at the fundamental concept of search engines and explore opportunities to improve them.
# seo-description: Connor Jarrett looks at the fundamental concept of search and explores possibilities of what it would be like if they changed.
# category: My projects
# keywords: chatbot, ai, chatgpt, artificial inteligence, ai search, ai chatbot, google search
# image: chatbot.png
# date: 2023-5-8
-->

A few weeks ago, I launched my latest project [Chatbot](https://conjardev.github.io/chatbot). It started out as something that could just be an alternate user interface to Google, but later became so much more.

## What if search was more useful
When you step back and really think about search online, the relevancy of results has definitely got better, but we're still presented with the same long list of results to click with limited information about most sites. What if that were to change? Imagine if the fundamental concept of a smart assistant like Siri or Google Assistant where you get one, optimised and informative result came to desktop search, that is the vision I was trying to create with my project.

## How does it work
Search engines are massive, so I knew I wouldn't be able to do all of the work myself, Google has spent years indexing and perfecting the way they search and store useful information, so it only made sense that the Google Search API would be the start of my project. However, as I soon learnt, the Google Search API does not return nearly as much information as regular Google Search, completely ignoring featured snippets and other useful information like calculators and time converters. My program runs the returned list of 10 results through a filter, which removes unimportant sites and prioritises better known ones to produce one top result that it will use.

Next, using a list of known sites, such as Wikipedia, YouTube, Spotify, IMDb and more, it will produce a meaningful answer (most of the time). There are 3 tiers to the "usefulness" of a result which I will list here:
- **Tier 1:**<br>
  Tier 1 results are the worst type, they are similar to what you'd find on Google Search. You get an image if Google can find one attached to the site and a small snippet which is often cut short. I try to minimise the number of these that get through but naturally with the web being so huge, that's not really possible.
- **Tier 2:**<br>
  These results are considerably more useful, these are provided if the website comes with good structured data that Google can interpret, allowing me to extract key information like article titles, article descriptions, and sometimes video or relevant links to other sites.
- **Tier 3:**<br>
  These are the specialised results, and often the rarest. Tier 3 results often use APIs to connect with other services, and this allows for them to extract far more data than would be returned in a Google search. Some examples of Tier 3 results are Wikipedia results, which returns the first few lines of the article, along with the sections, or Movies, which are found via either Wikipedia or IMDb, and use an IMDb API to get info like the cast, plot, ratings. As well as this, I've been experimenting with bringing 2 results together, such as using the Spotify API to find the soundtrack for films.

I'm always looking for new things to turn into Tier 2-3 results, and recently, I've been thinking about holiday bookings, where it could use multiple APIs to determine flight prices, nearby hotels, car rentals and things to do while away.

## Where can I see this in action?
Right now, for security reasons, you have to run the program on your home machine, rather than it being available through a web app, this is due to the lack of server side code on GitHub pages which I explore more in [this article](https://labnotebook.connorjarrett.com/post/building-a-blog-with-github-pages-and-nodejs-despite-the-challenges).

For now, you can see the live demo and the code on the project website, [conjardev.github.io/chatbot](https://conjardev.github.io/chatbot)

## Conclusion
I really think that this approach to search is better than what we have today, and while we can see elements of this concept through Siri Suggested Website on Safari, and featured snippets on Google becoming more frequent, none of them provide, in my eyes, enough detail and relevance, and I hope we see more of this in years to come.