// Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBHXt1-vLL4UIkKq7SNnzrdA0ITpbKQuuM",
    authDomain: "lab-notebook-analytics.firebaseapp.com",
    databaseURL: "https://lab-notebook-analytics-default-rtdb.firebaseio.com",
    projectId: "lab-notebook-analytics",
    storageBucket: "lab-notebook-analytics.appspot.com",
    messagingSenderId: "348846748903",
    appId: "1:348846748903:web:cf762aafa15cf605d9de42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Get URL params to fetch source from URL
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get("s")

// Clean sources to allow for shorter URLs and prevent bad inputs
var cleanedSource = "undefined"
if (source) {
    const sources = {
        "url-i": "url-shared-independant",
        "url-e": "url-shared-encouraged",
        "tw-i": "tweet-independant",
        "tw-e": "tweet-encouraged",
        "tw-p": "tweet-promotion",
        "tw": "tweet-legacy",
        "ms-i": "mailing-list-independant",
        "ms-i": "mailing-list-encouraged"
    }

    cleanedSource = sources[source.toLowerCase()] ? sources[source.toLowerCase()] : "unsupported"
}
// If no ID, go to the homepage
// ID is defined in the HTML
if (!id) {
    window.location.replace("./")
}

// Fetch all posts
$.getJSON("../post/index.json", function(postIndex){
    // Find post from ID
    const post = (postIndex.find(post => post.share.string == id))

    // If there is a post redirect and add to Firebase
    if (post) {
        // Get the time to reference in the analytics
        const time = Date.now()
        
        // Push a bunch of helpful information to Firebase for analytics
        async function push() {
            var location = {}
            $.ajax({
                url: "https://api.db-ip.com/v2/free/self",
                async: false,
                success: function(data) {
                    location = {
                        contient: data.continentName,
                        country: data.countryName,
                        stateProv: data.stateProv,
                        city: data.city
                    }
                }
            })

            await set(ref(database, `${time}`), {
                time: time,
                source: cleanedSource,
                client: {
                    product: {
                        vendor: platform.manufacturer,
                        product: platform.product
                    },
                    browser: {
                        name: platform.name,
                        version: platform.version
                    },
                    location: location,
                    os: platform.os.family,
                    userAgent: navigator.userAgent,
                    deviceType: window.mobileCheck() ? "mobile" : "desktop"
                },
                article: post
            })
            .then(function(){
                 // Redirect
                window.location.replace(post.url)
            })
            .catch(function(){
                // If failed still redirect
                window.location.replace(post.url)
            })
        }

        push()
    } else {
        // Redirect to homepage if nothing found
        window.location.replace("lanotebook.connorjarrett.com")
    }
})