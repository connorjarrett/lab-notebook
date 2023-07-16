const articles = {
    load: function(id) {
        var article = undefined

        $.ajax({
            async: false,
            url: "post/index.json",
            success: function(articles) {

                if (id == "latest") {
                    article = articles[0]
                } else {
                    article = articles.find(element => element.id == id)
                }
                
            }
        })

        return article
    },

    getAttribute(article, attribute, attribute2) {
        if (attribute2) {
            return article[attribute][attribute2]
        }
        return article[attribute]
    },

    videos: {
        populate: function() {
            $(".videos-grid").each(function(){
                const cap = this.dataset.cap
                const container = this

                $.ajax({
                    async: false,
                    url: "post/index.json",
                    success: function(articles) {
                        if (articles.filter(element => element.video).length < cap) {
                            container.parentNode.remove()
                            // $("#highlights").remove()
                        }

                        for (let i=0; i<(articles.length>cap ? cap : articles.length); i++) {
                            let article = articles[i]
    
                            if (!article.video) {
                                break
                            }

                            let item = document.createElement("article")

                            let link = document.createElement("a")
                            link.target = "_BLANK"
                            link.classList = "video-item"

                            let thumbnail = document.createElement("img")

                            let title = document.createElement("p")
                            
                            let button = document.createElement("button")
                            button.innerHTML = "Full Article"

                            let buttonLink = document.createElement("a")
                            buttonLink.dataset.postId = article.id
                            buttonLink.appendChild(button)

                            $.ajax({
                                url: "https://noembed.com/embed",
                                async: false,
                                data: {
                                    url: `https://www.youtube.com/watch?v=${article.video}`
                                },
                                dataType: "json",
                                success: function(video) {
                                    console.log(video)
                                    thumbnail.src = video.thumbnail_url
                                    title.innerHTML = video.title
                                    link.href = video.url
                                }
                            })

                            link.appendChild(thumbnail)
                            link.appendChild(title)
                            item.appendChild(link)
                            item.appendChild(buttonLink)
                            container.appendChild(item)

                        }
                    }
                })
            })
        }
    },

    fillArticle: async function(element) {
        const article = articles.load(element.dataset.postId)

        if (article) {
            element.dataset.filled = ""

            const info = $(element).find("#info")
            const image = $(element).find('img[data-prop=image]')
        
            if (info.length > 0) {
                const items = info[0].children

                for (let i=0; i<items.length; i++) {
                    let value = articles.getAttribute(article, items[i].dataset.prop, items[i].dataset.prop2)
                    items[i].innerHTML = value
                    items[i].id = `article-${items[i].dataset.prop}`
                }
            }

            if (image.length > 0 && articles.getAttribute(article, "image")) {
                image[0].loading = "lazy"
                image[0].alt = articles.getAttribute(article, "SEOdescription")

                setTimeout(function(){
                    if (document.location.hostname != "localhost") {
                        image[0].src = articles.getAttribute(article, "image")
                    } else {
                        image[0].src = articles.getAttribute(article, "image").replace("https://labnotebook.connorjarrett.com","./")
                    }
                }, 10)
            }
        }
    },

    populate: function() {
        $(window).on("load", async function(){
            $(".posts-grid").each(function(){
                const cap = this.dataset.cap
                const filter = this.dataset.filter
                const container = this

                $.ajax({
                    async: false,
                    url: "post/index.json",
                    success: function(allArticles) {
                        if (container.dataset.removeFirst != null) {
                            // Remove the first element as that is the feature article
                            allArticles.shift()
                        }
                        for (let i=0; i<(allArticles.length>cap ? cap : allArticles.length); i++) {
                            async function createDOMarticle(allArticles) {
                                let article = allArticles[i]

                                let link = document.createElement("a")
                                link.dataset.postId = article.id
                                link.classList = "articleLinkElement"

                                let domArticle = document.createElement("article")
                                domArticle.classList = "article adjustable"
                                domArticle.dataset.postId = article.id

                                let infobox = document.createElement("div")
                                infobox.id = "info"

                                let heading = document.createElement("p")
                                heading.dataset.prop = "title"

                                let description = document.createElement("p")
                                description.dataset.prop = "description"

                                let date = document.createElement("span")
                                date.dataset.prop = "dateFormats"
                                date.dataset.prop2 = "string"

                                infobox.appendChild(heading)
                                infobox.appendChild(description)
                                infobox.appendChild(date)

                                let image = document.createElement("img")

                                image.dataset.prop = "image"

                                domArticle.appendChild(image)
                                domArticle.appendChild(infobox)

                                link.appendChild(domArticle)
                                container.appendChild(link)
                                
                                articles.fillArticle(domArticle)
                            }

                            createDOMarticle(allArticles)
                        }
                        
                    }
                })
                
            
            })

            // Add content to articles
            $('article.article[data-filled!=""]').each(function(){
                articles.fillArticle(this)
            })

            $("a").each(function(){
                if (this.dataset.postId) {
                    const article = articles.load(this.dataset.postId)
                    const hostname = window.location.hostname

                    if (article) {
                        this.href = hostname != "localhost" ? article.url : article.url.replace("https://labnotebook.connorjarrett.com", window.location.href)
                    }
                }
            })
        })
    }
}