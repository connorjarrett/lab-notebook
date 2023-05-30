// build.js converts all the article.md files into HTML files following a template
const path = require('path');
const jsBeautify = require("js-beautify");
const fs = require('fs');
const marked = require('marked');
const ADLER32 = require('adler-32'); 
const xmlFormatter = require('xml-formatter');

// Silence marked
marked.use({
    silent: true
});

const baseUrl = "https://labnotebook.connorjarrett.com"

const prefix = "../" // Relative path

const indexURL = `${prefix}/post/index.json`
const sitemapURL = `${prefix}/post/article-sitemap.xml`
const shareDir = `${prefix}/s`

var postsAdded = 0
var postsRemoved = 0

const logPrefix = " > "

// Get template
const articleTemplate = fs.readFileSync(`${prefix}/tools/article-template.html`).toString();
const shareTemplate = fs.readFileSync(`${prefix}/tools/share-template.html`).toString();

// Get previous index to check for new creations vs renames
const previousIndex = JSON.parse(fs.readFileSync(indexURL).toString());

// Get all the posts in markdown format
const posts = fs.readdirSync(`${prefix}/posts_md`)

// Get all share pages
const startSharePages = fs.readdirSync(shareDir)


function getAttribute(file, attribute) {
    const regex = new RegExp(`^# ${attribute}:.*$`,"mg")
    const possibleAttributes = file.match(regex)

    if (possibleAttributes == null) { return undefined }

    const match = possibleAttributes[0].replace(`# ${attribute}:`,"").trim()

    return match
}

// Get read time from text
function getReadTime(text) {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    return time
}

function getRelatedArticles(id, tags) {
    // Get all articles that aren't the current one
    const differentArticles = previousIndex.filter(element => element.title != id)

    // Sort by which has the most relevant tags
    differentArticles.sort(function(a,b) {
        let similarTagsA = []
        let similarTagsB = []

        for (let i=0; i<a.tags.length; i++) {
            if (tags.includes(a.tags[i])) {
                similarTagsA.push(a.tags[i])
            }
        }

        for (let i=0; i<b.tags.length; i++) {
            if (tags.includes(b.tags[i])) {
                similarTagsB.push(b.tags[i])
            }
        }

        return similarTagsB.length - similarTagsA.length
    })

    return differentArticles.map(element => element.id).slice(0,3)
}


var index = []
var renamed = []
var waitfor = 0

// Create promise
const e = new Promise((resolveOuter) => {

    resolveOuter(
        new Promise((resolveMiddle) => {
            // Loop through all the files to convert
            console.log("\n----------\n")

            for (let p=0; p<posts.length; p++) {

                // Open file
                fs.readFile(`${prefix}/posts_md/${posts[p]}`, 'utf8', (err, data) => {
                    if (err) {
                        console.error("E")
                        return false;
                    }

                    var articleTemplateEdit = articleTemplate

                    const relatedArticles = getRelatedArticles(
                        getAttribute(data, "title"),
                        getAttribute(data, "keywords").split(",").map(function(item) {
                            return item.trim();
                        })
                    )

                    this.attribute = function(attribute) {
                        if (!["content","url","share","shareid","iso","dateString","built","image","readtime", "relevant"].includes(attribute)) {
                            return getAttribute(data, attribute)
                        }

                        if (attribute == "content") {
                            // Filter out comments
                            data = data.replace(/^<!--.*$-->/gm,"").trim()

                            // Parse
                            var content = marked.parse(data.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,""))

                            // Remove H1s
                            content = content.replace(/^<h1.*$/gm,"").trim()

                            // Edit links to open in new tab
                            content = content.replaceAll("<a","<a target='_BLANK'")

                            if (content.includes("<p>[video]</p>")) {
                                if (this.attribute("video")) {
                                    content = content.replaceAll("<p>[video]</p>", `<iframe class="youtube" src="https://youtube-nocookie.com/embed/${this.attribute("video")}"></iframe>`)
                                }
                            }

                            return content
                        } else if (attribute == "relevant") {
                            let relevantHTML = ""
                            
                            for (let x=0; x<relatedArticles.length; x++) {
                                let article = previousIndex.find(element => element.id == relatedArticles[x])

                                relevantHTML += `
                                <a href="${article.share.url}related">
                                    <article class="article adjustable"><img src="${article.image}">
                                        <div id="info">
                                            <p id="article-title">${article.title}</p>
                                            <p id="article-description">${article.description}</p>
                                        </div>
                                    </article>
                                </a>
                                `
                                
                            }

                            return relevantHTML
                        } else if (attribute == "url") {
                            return `${baseUrl}/post/${filename.replace(".html","")}`
                        } else if (attribute == "share") {
                            return shareURL
                        } else if (attribute == "shareid") {
                            return share
                        } else if (attribute == "iso") {
                            return new Date(this.attribute("date")).toISOString()
                        } else if (attribute == "dateString") {
                            return `${["January","February","March","April","May","June","July","August","September","November","December"][new Date(this.attribute("date")).getMonth()]} ${new Date(this.attribute("date")).getDate()}, ${new Date(this.attribute("date")).getFullYear()}`
                        } else if (attribute == "built") {
                            return new Date(Date.now()).toUTCString()
                        } else if (attribute == "image") {
                            if (getAttribute(data, "image").startsWith("https://")) {
                                return getAttribute(data, attribute) 
                            } else {
                                return `${baseUrl}/assets/articles/${getAttribute(data, attribute) }`
                            }
                        } else if (attribute == "readtime") {
                            return getReadTime(data)
                        } 
                    }

                    const filename = this.attribute("title") // Get article title
                                    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") // Remove punctuation
                                    .replace(/\s{2,}/g," ") // Remove stray spaces
                                    .replaceAll(" ","-") // Replace spaces with dashes
                                    .toLowerCase() // Lowercase
                                    + ".html"

                    // Create share string
                    const share = ADLER32.str(filename.replace(".html","")).toString(35)
                    const shareURL = `${baseUrl}/s/${share}?s=`

                    // Create file path
                    const filepath = `${prefix}/post/${filename}`

                    // Get text between 2x braces {{ $ }}
                    const placeholders = articleTemplate.match(/\{\{([^}]+)\}\}/g)
                    
                    // Get and replace all the placeholders
                    for (let x=0; x<placeholders.length; x++) {
                        let placeholder = placeholders[x].replace("{{","").replace("}}","")
                        let attribute = placeholder.replace("article.","")

                        articleTemplateEdit = articleTemplateEdit.replaceAll(placeholders[x], this.attribute(attribute))
                    }

                    // Beautify HTML
                    articleTemplateEdit = jsBeautify.html_beautify(articleTemplateEdit, {
                        "indent_size": 4,
                        "indent_char": " ",
                        "indent_with_tabs": true,
                    })

                    let hasRenamed = false

                    // Rename markdown file to post title
                    if (posts[p] != filename.replace(".html",".md")) 
                        // The markdown file is not named as the post title, change this
                        
                        fs.rename(`${prefix}/posts_md/${posts[p]}`, `${prefix}/posts_md/${filename.replace(".html",".md")}`, function(err) {
                            if ( err ) console.log('ERROR: ' + err);
                            renamed.push(posts[p].replace(".md",".html"))
                            
                            // Only class as "renamed" if it existed before
                            if (previousIndex.find(element => element.id == posts[p].replace(".md",""))) {
                                hasRenamed = true
                            }
                            
                            console.log(`\x1b[33m${logPrefix}\u{1F58A}\uFE0F  Renamed ${posts[p]} to ${filename.replace(".html",".md")} to match article title\x1b[0m`)
                        });

                    // Check for article existance
                    if (!fs.existsSync(filepath)) {
                        // The article doesn't exist, create a new file
                        waitfor += 1
                        fs.writeFile(filepath, articleTemplateEdit, function (err) {
                            if (err) throw err;
                            
                            // Don't announce "creation" if renamed to avoid confusion
                            if (!hasRenamed) {
                                console.log(`\x1b[32m${logPrefix}\u2705 Created ${filename}\x1b[0m`)
                                postsAdded += 1
                            }
                            
                            waitfor = waitfor - 1
                        });
                    } else {
                        // The article does exist
                        // Check if it's up to date

                        waitfor += 1

                        if (fs.readFileSync(filepath).toString() == articleTemplateEdit) {
                            // The article exists and is up to date, do nothing
                            console.log(`\x1b[32m${logPrefix}\u{1F44D} ${filename} already exists, and is up to date\x1b[0m`)

                            waitfor = waitfor - 1
                        } else {
                            // The article exists and is outdated, rewrite it with the new templat
                            // Only update if more than comments were changed
                            
                            if (fs.readFileSync(filepath).toString().replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"") != articleTemplateEdit.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"")) {
                                console.log(`${logPrefix}\u231B ${filename} already exists, and is being updated\x1b[0m`)
                            
                                fs.writeFile(filepath, articleTemplateEdit, function (err) {
                                    if (err) throw err;
                    
                                    console.log(`\x1b[32m${logPrefix}\u{1F44D} ${filename} sucessfuly updated\x1b[0m`)
                                    waitfor = waitfor - 1
                                });
                            } else {
                                waitfor = waitfor - 1
                            }

 
                        }
                        
                    }

                    // Create share page
                    // Get text between 2x braces {{ $ }}
                    const sharePlaceholders = shareTemplate.match(/\{\{([^}]+)\}\}/g)
                    var shareTemplateEdit = shareTemplate
                    
                    // Get and replace all the placeholders
                    for (let x=0; x<sharePlaceholders.length; x++) {
                        let placeholder = sharePlaceholders[x].replace("{{","").replace("}}","")
                        let attribute = placeholder.replace("article.","")
                        
                        shareTemplateEdit = shareTemplateEdit.replaceAll(sharePlaceholders[x], this.attribute(attribute))
                    }

                    // Beautify HTML
                    shareTemplateEdit = jsBeautify.html_beautify(shareTemplateEdit, {
                        "indent_size": 4,
                        "indent_char": " ",
                        "indent_with_tabs": true,
                    })

                    // Check for existance
                    const sharePath = `${shareDir}/${share}.html`

                     // Check for sharepage existance
                     if (!fs.existsSync(sharePath)) {
                        // The sharepage doesn't exist, create a new file
                        waitfor += 1
                        fs.writeFile(sharePath, shareTemplateEdit, function (err) {
                            if (err) throw err;
                            
                            // Don't announce "creation" if parent article renamed to avoid confusion
                            if (!hasRenamed) {
                                console.log(`\x1b[32m${logPrefix}\u2705 Created sharing link for ${filename}\x1b[0m`)
                            } else {
                                console.log(`\x1b[32m${logPrefix}\u{1F44D} Sharing link for ${filename} sucessfuly updated\x1b[0m`)
                            }
                            
                            waitfor = waitfor - 1
                        });
                    } else if (fs.readFileSync(sharePath).toString() != shareTemplateEdit) {
                        waitfor += 1
                        // The sharepage exists and is outdated, rewrite it with the new template
                        // Only update if more than comments were changed
                        
                        if (fs.readFileSync(sharePath).toString().replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"") != shareTemplateEdit.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"")) {
                            console.log(`${logPrefix}\u231B Updating sharing link for ${filename}\x1b[0m`)

                            fs.writeFile(sharePath, shareTemplateEdit, function (err) {
                                if (err) throw err;
                
                                if (fs.readFileSync(sharePath).toString().replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"") != shareTemplateEdit.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"")) {
                                    console.log(`\x1b[32m${logPrefix}\u{1F44D} Sharing link for ${filename} sucessfuly updated\x1b[0m`)
                                }
    
                                waitfor = waitfor - 1
                            });
                        } else {
                            waitfor = waitfor - 1
                        }   
                    }

                    // Add to index
                    index.push({
                        url: `${baseUrl}/post/${filename.replace(".html","")}`,
                        id: filename.replace(".html",""),
                        title: this.attribute("title"),
                        description: this.attribute("description"),
                        SEOdescription: this.attribute("seo-description"),
                        readtime: getReadTime(data),
                        tags: this.attribute("keywords").split(",").map(function(item) {
                            return item.trim();
                        }),
                        relatedArticles: relatedArticles,
                        published: this.attribute("date"),
                        dateFormats: {
                            unix: new Date(this.attribute("date")).getTime(),
                            locale: new Date(this.attribute("date")).toLocaleDateString(),
                            string: `${["January","February","March","April","May","June","July","August","September","November","December"][new Date(this.attribute("date")).getMonth()]} ${new Date(this.attribute("date")).getDate()}, ${new Date(this.attribute("date")).getFullYear()}`,
                            iso: new Date(this.attribute("date")).toISOString()
                        },
                        share: {
                            string: share,
                            url: shareURL
                        },
                        image: this.attribute("image"),
                        video: this.attribute("video")
                    })

                    function end() {
                        if (p == posts.length-1) {
                            if (waitfor == 0) {
                                resolveMiddle()
                            } else {
                                setTimeout(function(){
                                    end()
                                },100)
                            }
                        }
                    }

                    end()
                
                });
            }
        }
    )
)});


// Wait for it to all be done
e.then(function(){
    index.sort(function(a,b){
        return new Date(b.published).getTime() - new Date(a.published).getTime()
    })

    // Create index
    fs.writeFile(indexURL, JSON.stringify(index, null, "\t"), function (err) {
        if (err) throw err;
        
        // Check for strays
        const htmls = fs.readdirSync(`${prefix}/post`).filter(element => !["index.json", "article-sitemap.xml"].includes(element))
        const allPosts = index.map(function(item) { return item.id; })

        if (htmls.length > allPosts.length) {
            waitfor += 1
            // All posts that don't have a markdown file with them
            const noMarkdown = (htmls.filter(element => !allPosts.find(e=> e == element.replace(".html",""))))

            for (let i=0; i<noMarkdown.length; i++) {
                if (renamed.includes(noMarkdown[i])) {
                    // If renamed, announce that it renamed instead of deleted
                    console.log(`\x1b[33m${logPrefix}\u{1F58A}\uFE0F  Renamed ${noMarkdown[i]} to match article title\x1b[0m`)
                } else {
                    // If not renamed, announce deletion
                    console.log(`\x1b[31m${logPrefix}\u{1F5D1}\uFE0F  Removed stray post ${noMarkdown[i]} as it had no markdown file\x1b[0m`)
                    postsRemoved =- 1
                }

                fs.unlinkSync(`${prefix}/post/${noMarkdown[i]}`)
            }
        }

        // Check for stray sharepages
        const endSharePages = fs.readdirSync(shareDir)

        const pagesWithSharepage = index.map(e => e.share.string)
        const noParentPage = endSharePages.filter(element => !pagesWithSharepage.includes(element.replace(".html","")))

        for (let i=0; i<noParentPage.length; i++) {
            fs.unlinkSync(`${shareDir}/${noParentPage[i]}`)
        } 

        console.log("\n----------\n")

        console.log(`${index.length} post${index.length>1 ? "s" : ""} total`)
        console.log(`\x1b[102m +${postsAdded} \x1b[0m \x1b[97m\x1b[101m -${Math.abs(postsRemoved)} \x1b[0m`)

        console.log(`\n\x1b[32m\u2705 index.json successfully written\x1b[0m`)

        // Create sitemap
        var sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
        for (let i=0; i<index.length; i++) {
            let article = index[i]
            sitemap += `
            <url>
                <loc>${article.url}</loc>
                <image:image>
                    <image:loc>${article.image}</image:loc>
                </image:image>
            </url>
            `
        }
        sitemap += "</urlset>"

        fs.writeFile(sitemapURL, xmlFormatter(sitemap), function (err) {
            if (err) throw err;
            
            console.log(`\x1b[32m\u2705 article-sitemap.xml successfully written\n\x1b[0m`)
        })
    })
})
