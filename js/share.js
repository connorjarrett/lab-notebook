const urlParams = new URLSearchParams(window.location.search);

const source = urlParams.get("s")

if (!id) {
    window.location.replace("./")
}

$.getJSON("../post/index.json", function(postIndex){
    // Find post from ID
    const post = (postIndex.find(post => post.share.string == id))

    if (post) {
        console.log(post)
        window.location.replace(post.url)
    } else {
        window.location.replace("lanotebook.connorjarrett.com")
    }
})