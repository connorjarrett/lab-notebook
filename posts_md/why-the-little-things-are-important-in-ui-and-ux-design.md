<!-- 
# title: Why the little things are important in UI and UX design
# description: I look into the history of User Interface and User Experience design and provide some top tips for beginners
# seo-description: Connor Jarrett explores the history of User Interface and User Experience and uncovers the key ingredient to a successful design.
# category: UI UX
# keywords: UI, UX, User Interface, User Experience, UIUX, Design, Designers, Web Design, Websites, Website Flow, Micro-interactions, UI Design
# image: uiux-little-things.png
# date: 2023-5-31
-->

UI & UX make up the foundation of the web these days, design is so important in launching a product where your site now no longer needs to just be functional, it has to be pleasing to use and look at. Today I'm going to look into why the little things really matter with UI and UX and how you could implement some basic changes to your own website or app.

## Introduction to UIUX
### What is UI
UI (meaning User Interface) is the ["way in which the information on a computer, phone, etc. and instructions on how to use it are arranged on the screen and shown to the user"](https://dictionary.cambridge.org/dictionary/english/user-interface) or in layman's terms, the way in which the elements of a website or app are laid out. What we're really referring to here is a **Graphical** User Interface (GUI), but nowadays, the G is often dropped.

### What is UX
Different to User Interface, UX (User Experience) is ["the experience of someone using a product, system, or service, for example whether they find it enjoyable and easy to use"](https://dictionary.cambridge.org/dictionary/english/user-experience), basically, the ease of use factor in a design.

### How they work together
UI and UX go hand in hand (often referred to as UIUX), a good-looking design is pointless if it's difficult or annoying to use, same goes for a simple-to-use design is pointless if it looks terrible. 

## The foundation of the modern web
While it used to be commonplace for simple User Interfaces with little detail or nice features [(Just look at what Google looked like when it was in beta)](https://web.archive.org/web/19990117032727/http://www.google.com/), this is not the case anymore. A good User Interface and Experience is vital to launching a product, most tech startups now invest so much time in to marketing and branding that sometimes the product itself can get lost. UI and UX can make or break the perception of a product, as mentioned earlier, no one will want to use your service if it is displeasing to look at or complicated to use.

## The key ingredient to good User Experience
Micro-interactions serve as one of my personal favourite ways to turn something from being boring and having bad UX in to a more engaging product. A micro-interaction is a small, functional animation that supports the user by giving visual feedback and displaying changes, or the ability to make changes more clearly.[<sup>1</sup>](https://uxplanet.org/how-micro-interactions-have-become-an-essential-part-of-great-products-2ac8e02b5f2) A good way to imagine the purpose of micro-interactions is, if your cursor were to be invisible, how would you know where your mouse was on the page?

### Integrating micro-interactions
Integrating a powerful micro-interaction on your website could be as simple as a basic hover effect, below is some basic CSS that will vary the width and colour of a list element depending on whether it's being hovered on, or has the `active` class. Don't forget your `transition` attribute, so your animations are smooth!
```css
aside li {
    width: 90%;
    transition: all 250ms
}

aside li:not(.active):hover {
    width: 95%;
}

aside li.active {
    width: 100%;
    background-color: black;
    color: white;
}
```

## The little things in User Interface matter
In a recent project of mine, I wanted to find a way to make the User Interface seem more alive and less dull. I thought of using emojis to add a splash of colour to the design, but it didn't do enough.

I ended up coming up with a bit of JavaScript that could generate a random emoji depending on a certain category, it worked a charm for some basic features, adding a subtle change to liven up the interface. When it came to using it for user avatars is when I realised it needed more. Next to each user it would generate a random emoji, this works fine on paper, but in practise, [having a female emoji next to a masculine name didn't usually fit](https://labnotebook.connorjarrett.com/assets/articles/extra/emoji-mismatch.jpg). To rectify this, I used an [API that allows 1,000 free daily requests](https://genderize.io) to guess the gender from their first name. This small detail provides a consistency to the user interface that it otherwise wouldn't have.

## Why mobile-first design is taking over
According to [analysis](https://research.com/software/mobile-vs-desktop-usage#:~:text=When%20it%20comes%20to%20mobile,of%20the%20total%20web%20traffic.), many separate researchers have concluded that now more people browse the web on a smartphone rather than a desktop, making responsive design more important than ever. Responsive design is a design that varies depending on the screen size or device type. Not having a responsive website or good mobile support can [negatively affect SEO](https://developers.google.com/search/blog/2015/02/finding-more-mobile-friendly-search), which is something no one wants.

## My top tips
Here are some of my most valuable top tips for your User Interfaces and User Experience flow:
- **Consistent Visual Styles**: Make sure your website or app looks similar throughout
- **Whitespace and Layout**: Give your elements room to breathe, don't cram them too close together.
- **Hierarchy**: Make your less important elements smaller than your more important ones
- **Error Handling**: No one wants your page to hang or break, provide real-time error handling with fix suggestions
- **Intuitive Navigation**: Make sure your app or website is easy to navigate, have a clear navigation system