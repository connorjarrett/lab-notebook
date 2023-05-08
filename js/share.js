const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("r")
const source = urlParams.get("s")

if (!id) {
    window.location.replace("./")
}

$.getJSON("./post/index.json", function(postIndex){
    // Find post from ID
    const post = (postIndex.find(post => post.share.string == id))

    if (post) {
        console.log(post)
        $("#seo")[0].outerHTML = `
        <meta name="description" content="${post.SEOdescription}">
        <meta name="author" content="Connor Jarrett">
        <meta name="keywords" content="blog, Connor Jarrett, Lab Notebook">
        <meta property="og:title" content="${post.title}">
        <meta property="og:description" content="${post.SEOdescription}">
        <meta property="og:image" content="${post.image}">
        <meta property="og:url" content="${post.url}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${post.title}">
        <meta name="twitter:description" content="${post.SEOdescription}">
        <meta name="twitter:image" content="${post.image}>
        <meta name="twitter:creator" content="@connorjrt">
        `
        window.location.replace(post.url)
    } else {
        window.location.replace("./")
    }
})