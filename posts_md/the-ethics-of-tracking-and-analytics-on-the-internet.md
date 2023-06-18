<!-- 
# title: The ethics of tracking and analytics on the internet 
# description: I look at how analytics and tracking work online, and dispel some common myths
# seo-description: Connor Jarrett explores the ethics of tracking and analytics online and how to make them more ethical and privacy-first
# category: Privacy
# keywords: ethics, tracking, privacy, analytics, online privacy, online ethics, privacy-fist, security, personal information
# image: tracking-ethics.png
# date: 2023-5-26
-->
In reality, analytics are an important factor to running anything online. The insight in to who and how people are consuming your content is now vital to understand how to tailor your content better and how to see your performance online. However, it is becoming all too common for online trackers, run by large data harvesters, to use our personal information to target ads and exploit privacy for clicks. Where is the line?

## What is online tracking
For those of you who don't know, online trackers are small pieces of code, often put in webpages, to allow for the site owner and sometimes other corporations and individuals to view your searches, clicks and interests as well as collect little bits of information such as your device type, general location and browser. This on its own isn't a bad thing, however, things get worse when this information becomes personally identifiable.

## Personally identifiable information
Personally identifiable information is where tracking and analytics go from being a useful tool for developers, to being an exploitative tool designed to sell you for clicks. When you're becoming individually identifiable, what was once lots of data scattered across different sites online has the potential to become one complete digital profile of you to be bought, sold or stolen in an instant [(Quote from Ubisoft's "WatchDogs 2")](https://www.youtube.com/watch?v=scyA9cnbja4&t=48s).

Recently, lots of laws have been put in place about personally identifiable information, such as the [GDPR](https://gdpr-info.eu)  (General Data Protection Regulation) which states that you must provide individuals with information including: your purposes for processing their personal data, your retention periods for that personal data, and who it will be shared with.

## Cookies
It's likely you've heard "Cookies" being thrown about for a long time. Cookies in of themselves aren't dangerous or malicious, and some are required for lots of websites to function, however, they provide the *capability* for a site owner to store a token on your device, to allow them to identify you later, even if you've restarted your device or signed out.

## Data harvesters
The problem of personally identifiable information is only enhanced by the use of tools made by giant corporations. Google Analytics is perhaps the most popular analytics tool for online use, it is easy to use and set up and can provide a site owner with an [almost scary](https://support.google.com/firebase/answer/9268042) amount of personal information data.

Tying all of this data to you is almost too easy, a basic application could use your IP Address to put a unique identifier on a set of data, however, this is [rarely accurate](https://whatismyipaddress.com/ip-basics#:~:text=As%20you%20move%20from%20the,your%20computer%20and%20flip%20switches.) as your IP changes constantly depending on the cell tower, current device or Wi-Fi network. The most accurate way of tying personal information to you is through one of those "Sign in with Google" buttons. Once you've signed in to a service with your Google, Facebook, Twitter, Etc account, the website is then able to attach every piece of data they collect in that session to a specific name, email address and potentially more.

## Are there trackers on Lab Notebook
Lab Notebook doesn't use Google Analytics or harvest any personally identifiable information, other than your Name and Email if you chose to sign up for my mailing list. For insights, I chose to develop my own analytics system for Lab Notebook, but, it does not affect the whole site. 

I chose to develop my own analytics tool for 2 reasons, A: So I could experiment with processing data, B: So I could see if people are actually reading what I write. Each time you click on one of [my tweets](https://twitter.com/ConnorJrt) promoting a post, it uses a special link that looks something like this `https://labnotebook.connorjarrett.com/s/2ng6ib?s=tw-p`. The same goes for emails shared through my newsletter, and links anyone shares through the icons at the top and bottom of the page. Let's break down what is contained in this URL

To start with, `https://labnotebook.connorjarrett.com/s/` is nothing special, and is just a common URL containing no further information. Next is `2ng6ib`, this is the identifier, this tells my script which article you want to go to, each article has its own, shortened, unique identifier. The real data comes from the last element of the URL `?s=tw-p`, this looks basic, but that particular string is short for `twitter-promoted` which basically means, it's from Twitter, and it's a promotion (from myself). This could also contain `-i` meaning independent, which means that the sender was not encouraged to share, or it could contain `-e` which means that the sender was encouraged to share.

If you want to learn more about the analytics on Lab Notebook and what information it collects, you can read all the code for yourself on my [GitHub](https://github.com/conjardev/lab-notebook/blob/master/js/share.js)

## The warning signs were there
People have been predicting this for years. George Orwell wrote of "Big Brother" and "Thoughtcrime" in his 1949 novel titled "Nineteen Eighty-Four" and in more recent years, Ubisoft hinted and warned of the danger with their WatchDogs franchise. My favourite reference to the reality we live in is the very first cutscene in WatchDogs 2 (2016) and I'd suggest you play the games, as they really are some of my favourite games out there.
<iframe class="youtube" src="https://www.youtube-nocookie.com/embed/scyA9cnbja4"></iframe>

## Conclusion
Data collection and analytics itself is not a bad thing. It is helpful information with little ability to be used maliciously, the line is drawn where all of this information is combined to create massive datasets about an individual, opening the door for super-effective targeted ads, or even the sale of your digital profile to someone you've never met.