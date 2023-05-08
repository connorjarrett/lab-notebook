// build.js converts all the article.md files into HTML files following a template
const path = require('path');
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

var postsAdded = 0
var postsRemoved = 0

const logPrefix = " > "

// Get template
const template = fs.readFileSync(`${prefix}/tools/template.html`).toString();

// Get previous index to check for new creations vs renames
const previousIndex = JSON.parse(fs.readFileSync(indexURL).toString());

// Get all the posts in markdown format
const posts = fs.readdirSync(`${prefix}/posts_md`)


function getAttribute(file, attribute) {
    const regex = new RegExp(`^# ${attribute}:.*$`,"mg")
    const possibleAttributes = file.match(regex)

    if (possibleAttributes == null) { return undefined }

    const match = possibleAttributes[0].replace(`# ${attribute}:`,"").trim()

    return match
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

                    var templateEdit = template

                    this.attribute = function(attribute) {
                        if (!["content","url","share","iso","dateString","built","image"].includes(attribute)) {
                            return getAttribute(data, attribute)
                        }

                        if (attribute == "content") {
                            // Filter out comments
                            data = data.replace(/^<!--.*$-->/gm,"").trim()

                            // Parse
                            var content = marked.parse(data)

                            // Remove H1s
                            content = content.replace(/^<h1.*$/gm,"").trim()

                            // Edit links to open in new tab
                            content = content.replaceAll("<a","<a target='_BLANK'")

                            if (content.includes("<p>[video]</p>")) {
                                if (this.attribute("video")) {
                                    content = content.replaceAll("<p>[video]</p>", `<iframe class="youtube" src="https://youtube.com/embed/${this.attribute("video")}"></iframe>`)
                                }
                            }

                            return content
                        } else if (attribute == "url") {
                            return `${baseUrl}/post/${filename.replace(".html","")}`
                        } else if (attribute == "share") {
                            return shareURL
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
                    const shareURL = `${baseUrl}/s?r=${share}&s=`

                    // Create file path
                    const filepath = `${prefix}/post/${filename}`

                    // Get text between 2x braces {{ $ }}
                    const placeholders = template.match(/\{\{([^}]+)\}\}/g)
                    
                    // Get and replace all the placeholders
                    for (let x=0; x<placeholders.length; x++) {
                        let placeholder = placeholders[x].replace("{{","").replace("}}","")
                        let attribute = placeholder.replace("article.","")

                        templateEdit = templateEdit.replaceAll(placeholders[x], this.attribute(attribute))
                    }

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
                        fs.writeFile(filepath, templateEdit, function (err) {
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

                        if (fs.readFileSync(filepath).toString() == templateEdit) {
                            // The article exists and is up to date, do nothing
                            console.log(`\x1b[32m${logPrefix}\u{1F44D} ${filename} already exists, and is up to date\x1b[0m`)

                            waitfor = waitfor - 1
                        } else 
                            // The article exists and is outdated, rewrite it with the new template

                            // Only announce if more than comments were changed
                            if (fs.readFileSync(filepath).toString().replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"") != templateEdit.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,"")) {
                                console.log(`${logPrefix}\u231B ${filename} already exists, and is being updated\x1b[0m`)
                            }

                            fs.writeFile(filepath, templateEdit, function (err) {
                                if (err) throw err;
                
                                console.log(`\x1b[32m${logPrefix}\u{1F44D} ${filename} sucessfuly updated\x1b[0m`)
                                waitfor = waitfor - 1
                            });
                        
                    }

                    // Add to index
                    index.push({
                        url: `${baseUrl}/post/${filename.replace(".html","")}`,
                        id: filename.replace(".html",""),
                        title: this.attribute("title"),
                        description: this.attribute("description"),
                        SEOdescription: this.attribute("seo-description"),
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
            // All posts that don't have a markdown file with them
            const noMarkdown = (htmls.filter(element => !allPosts.find(e=> e == element.replace(".html",""))))

            for (let i=0; i<noMarkdown.length; i++) {
                if (renamed.includes(noMarkdown[i])) {
                    // If renamed, announce that it renamed instead of deleted
                    console.log(`\x1b[33m${logPrefix}\u{1F58A}\uFE0F  Renamed ${noMarkdown[i]} to match article title\x1b[0m`)
                } else {
                    // If not renamed, announce deletion
                    console.log(`\x1b[31m${logPrefix}\u{1F5D1}\uFE0F  Removed stray post ${noMarkdown[i]} as it had no markdown file\x1b[0m`)
                }

                postsRemoved -= 1
                fs.rmSync(`${prefix}/post/${noMarkdown[i]}`);
            }
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
                <lastmod>${article.published}</lastmod>
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
