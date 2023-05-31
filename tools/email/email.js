const nodemailer = require("nodemailer");
const fs = require("fs")
const axios = require('axios');
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');

// Safety Net
var safetyNet = false;

if (safetyNet) {
    safetyNet = [{
        firstname: "Jane",
        surname: "Doe",
        id: 0,
        email: "notarealemail@cade.dev"
    },
    {
        firstname: "John",
        surname: "Doe",
        id: 1,
        email: "alsoafakeemail@cade.dev"
    }]
}

const logPrefix = " > "

// Define emojis
const emojis = {
    none: " ",
    success: "\u{2705}",
    working: "\u{23F3}",
    fail: "\u{1F6AB}",
    analytics: "\u{1F4CA}"
}

// Fetch key info from files
const secrets = JSON.parse(fs.readFileSync("./secrets.json").toString())
const serviceAccount = require("./firebase.json"); // Private af - don't leak it by accident
const articles = JSON.parse(fs.readFileSync("../../post/index.json").toString())
const latest = articles[0]

// Connect to Firebase
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lab-notebook-analytics-default-rtdb.firebaseio.com"
});

// Get DB
const db = getDatabase();

// Create email transporter to use throughout
const transporter = nodemailer.createTransport({
    host: secrets.smtp.host,
    port: secrets.smtp.port,
    secure: secrets.smtp.secure,
    auth: {
        user: secrets.auth.user,
        pass: secrets.auth.pass,
    }
});

// Prepare email templates
const template = {
    // Latest: Alerts about the latest article
    latest: function(person) {
        return {
            subject: `📝 New post from Connor Jarrett - "${latest.title}"`,
            text: `Hey ${person.firstname}, this is hot off the press from Lab Notebook: `,
            body: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="color-scheme" content="light">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                                
                <style>
                    html {
                        background-color: #f5f5f5;
                        display: grid;
                        place-items: center;
                    }

                    body {
                        display: grid;
                        place-items: center;
                        margin: 0;
                        font-family: "Helvetica Neue", "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, Arial, "Lucida Grande", sans-serif;
                        color: #0b0b0b;
                    }
                    a {
                        cursor: pointer;
                    }
                    a:visited {
                        color: inherit; text-decoration: inherit;
                    }
                    footer a:hover {
                        text-decoration: underline !important;
                    }
                </style>
            </head>
            <body style='max-width: 700px; display: grid; place-items: center; font-family: "Helvetica Neue", "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, Arial, "Lucida Grande", sans-serif; color: #0b0b0b; margin: 0;' bgcolor="#f5f5f5">
                <main style="margin-top: 20px; margin-bottom: 20px; width: 90%; max-width: 8in; background-color: white; box-sizing: border-box; border-radius: 25px; padding: 30px;">
                    <header style="display: flex; gap: 35px;">
                        <a href="https://labnotebook.connorjarrett.com" target="_blank" style="text-decoration: inherit; color: inherit; font-size: inherit;">
                            <img src="https://labnotebook.connorjarrett.com/assets/brand/logo-email.png" alt="Lab Notebook" title="Lab Notebook">
                        </a> 
                        <h1 style="font-size: 2em; font-weight: bold;">Hey ${person.firstname}, this is hot off the press from Lab Notebook 📝</h1>
                    </header>
                    <hr style="border-bottom-width: 1px; border-bottom-color: #e2e2e2; width: 95%; margin: 20px auto; border-style: none none solid;">
                    <article style="width: 95%; margin-left: auto; margin-right: auto;">
                        <p class="blockquote" style="width: 100%; font-size: 1.5em; font-weight: bolder; text-decoration: underline; color: rgb(95, 95, 95); margin: 0;">This just in:</p>
                        <a href="${latest.share.url}ms-i" target="_blank" style="text-decoration: inherit; color: inherit; font-size: inherit;">
                            <h2 style="width: 100%; font-size: 2em; margin-top: 0; margin-bottom: 0.15em;">${latest.title}</h2>

                            <img class="image-main" src="${latest.image}" style="width: 100%; border-radius: 20px;" alt="${latest.SEOdescription}">
                        
                            <br><br>

                            <p class="blockquote" style="width: 100%; font-size: 1.5em; font-weight: bolder; text-decoration: underline; color: rgb(95, 95, 95); margin: 0;">Learn More</p>
                            <h3 style="width: 100%; font-size: 1.25em; color: #797979; font-weight: 400; margin: 0;">${latest.SEOdescription}</h3>
                        </a>

                        <br>

                        <a href="${latest.share.url}ms-e" target="_blank" style="text-decoration: inherit; color: inherit; font-size: inherit;">
                            <button style="cursor: pointer; background-color: #252525; color: white; border-radius: 5px; padding: 1em 2em; border-style: none;">Read Now</button>
                        </a>
                    </article>
                    <hr style="border-bottom-width: 1px; border-bottom-color: #e2e2e2; width: 95%; margin: 20px auto; border-style: none none solid;">
                    <footer style="width: 90%; margin-left: auto; margin-right: auto; box-sizing: border-box; font-size: 12px;">
                        <p style="color: #8b8b8b; margin: 0;">You've recieved this marketing email because you've signed up to recieve emails for <a href="https://labnotebook.connorjarrett.com" target="_blank" style="text-decoration: inherit; color: rgb(0, 94, 255) !important; font-size: inherit;">Lab Notebook</a></p>
                        <p style="color: #8b8b8b; margin: 0;">Please <a href="mailto:mail@connorjarrett.com?subject=Unsubscribe%20Me" style="text-decoration: inherit; color: rgb(0, 94, 255) !important; font-size: inherit;">contact us</a> to unsubscribe.</p>
                    
                        <details style="margin-top: 0.5em; color: #c5c5c5;">
                            <summary>See all the data we have on you</summary>
                            <code><pre style="text-align: left; white-space: pre-line; margin: 0;">
                                name: ${person.firstname} ${person.surname}
                                email: ${person.email}
                            </pre></code>
                        </details>
                    </footer>
                </main>
            </body>
            </html>
            `
        }
    }
}

// Can't use await in the global scope so it must be wrapped
// Pass in the email recipients.
async function main(recipients) {

    // Test function so I don't spam everyone.
    if (safetyNet) {
        recipients = safetyNet
    }


    console.log(`\n--- Preparing to send ${recipients.length} email${recipients.length > 1 ? "s" : ""} ---\n`)

    // Start a timer to keep track
    const startTime = Date.now()

    // Make a place to keep track of successes and failures
    var emails = {
        sent: 0,
        failed: 0
    }
    
    const sessionID = Date.now();

    // Loop through all email recipients
    for (let i=0; i<recipients.length; i++) {
        // Select person
        const person = recipients[i];

        // Build a string to visualise completion percentage
        const percentLength = 10; // How long is the string (higher = higher fidelity)
        var percent = (i+1) / recipients.length * percentLength; // Calculate percentage 
        var percentString = `\x1b[40m\x1b[97m ${"#".repeat(Math.ceil(percent))}${" ".repeat(percentLength-Math.ceil(percent))} \x1b[0m`; // Put in string form

        // Build the email using templated info
        const mailinfo = {
            from: `"${secrets.sender.name}" <${secrets.sender.address}>`,
            to: `"${person.firstname} ${person.surname}" <${person.email}>`,
            subject: template.latest(person).subject,
            html: template.latest(person).body
        };

        var success = true

        // Send email
        try {
            // Try and send the email once
            let info = await transporter.sendMail(mailinfo).then(function(){
                emails.sent += 1

                console.log(`${logPrefix} ${emojis.success} ${percentString} Email ${i+1}/${recipients.length} sent to ${person.email} (${person.firstname} ${person.surname}) - ${(Date.now()-startTime)/1000}s`);
            });
        } catch {
            // Handle failures by retrying up to 10 times, then giving up.
            
            await new Promise((resolve) => {
                console.log(`\x1b[91m${logPrefix} ${emojis.fail} ${percentString}\x1b[91m Email ${i+1}/${recipients.length} to ${recipients[i].email} failed, retrying - ${(Date.now()-startTime)/1000}s\x1b[0m`)
            
                // Log retries
                const maxRetries = 10
                let retries = 0

                async function attempt() {
                    retries += 1
    
                    console.log(`\x1b[33m${logPrefix} ${emojis.working} ${percentString}\x1b[33m Retrying email ${i+1}/${recipients.length} to ${recipients[i].email} (${retries}/${maxRetries}) - ${(Date.now()-startTime)/1000}s\x1b[0m`)
    
                    try {
                        // Try and send again, if succeeded, break the loop.
                        await transporter.sendMail(mailinfo).then(function() {
                            emails.sent += 1
                            console.log(`${logPrefix} ${emojis.working} ${percentString} Email ${i+1}/${recipients.length} sent to ${person.email} (${person.firstname} ${person.surname}) - ${(Date.now()-startTime)/1000}s`);
                            resolve()
                        })
                    } catch {
                        // If less than `maxRetries` (default 10) tries, try again
                        if (retries < maxRetries) {
                            await attempt();
                        } else {
                            // If more than 10 tries, accept fail and leave email.
                            emails.failed += 1
                            success = false
                            console.log(`\x1b[91m${logPrefix} ${emojis.fail} ${percentString}\x1b[91m Email ${i+1}/${recipients.length} to ${recipients[i].email} failed - ${(Date.now()-startTime)/1000}s\x1b[0m`)
                            resolve()
                        }
                    }
                }
            
                attempt()
            })
        }


        var receipt = {
            session: sessionID,
            email: mailinfo,
            success: success
        }

        const profileRef = db.ref(`email/${person.id}/profile`);
        profileRef.set(person)

        const sessionRef = db.ref(`email/${person.id}/sessions/${sessionID}`);
        sessionRef.set(receipt)
    } 

    // Log send success
    const endTime = Date.now()
    const successMessage = `\n${logPrefix} ${emojis.success} Successfully sent ${emails.sent}/${recipients.length} emails in ${(endTime-startTime)/1000} seconds${emails.failed ? `, failed to send ${emails.failed}` : ""}`
    console.log(successMessage)

    // Visualise sent vs unsent
    const compareLength = successMessage.length - (logPrefix.length + emojis.success.length + "   ".length)
    const total = emails.sent + emails.failed
    const succeededString = " ".repeat(Math.ceil(emails.sent / total * compareLength))
    const failedString = " ".repeat(compareLength - succeededString.length)
    const compareString = `\x1b[102m\x1b[30m${succeededString}\x1b[101m\x1b[97m${failedString}\x1b[0m`

    console.log(`${logPrefix} ${emojis.analytics} ${compareString}`)
    console.log(`${logPrefix} ${emojis.analytics} \x1b[32mSent${" ".repeat(succeededString.length - "sent".length)}${failedString.length > 0 ? `\x1b[91m| Failed${" ".repeat(failedString.length - "| failed".length)}` : ""}\x1b[0m`)

    // Add some line breaks at the bottom for neatness
    console.log("\n----------\n")

    // Disconnect from Firebase
    db.goOffline()
    app.delete()

}

// Fetch recipients list
axios.get(`https://api.getform.io/v1/forms/${secrets.getform.id}?token=${secrets.getform.token}`)
  .then(response => {
    // Send emails
    main(response.data.data.submissions).catch(
        console.error
    );
  })
  .catch(error => {
    console.log(error);
  });


