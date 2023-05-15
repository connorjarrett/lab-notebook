const nodemailer = require("nodemailer");
const fs = require("fs")
const axios = require('axios');

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
const articles = JSON.parse(fs.readFileSync("../../post/index.json").toString())
const latest = articles[0]

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
            subject: `New post from Connor Jarrett - "${latest.title}"`,
            body: `
            <style>
                main > .content {
                    color: black;
                    text-decoration: none;
                }
    
                main {
                    max-width: 99%;
                    width: 8in;
                    margin-left: auto;
                    margin-right: auto;
                }
    
                img, p {
                    width: 90%;
                }
    
                p {
                    font-size: 1.25em;
                }

                code {
                    margin-top: 2em;
                }

                code pre {
                    text-align: left;
                }
            </style>
            <main>
                <center class="content">
                    <h1>Hey ${person.firstname}, there's a new post from Connor Jarrett</h1>
                    <a href="${latest.share.url}m-sub">
                        <h2>"${latest.title}"</h2>
    
                        <img src="${latest.image}">
                        <p>${latest.SEOdescription}</p>
                    </a>
                </center>
                <hr>
                <center>
                    <sub>You recieved this email because you are on the <a href="https://labnotebook.connorjarrett.com">Lab Notebook</a> mailing list</sub><br>
                    <sub><a href="mailto:mail@connorjarrett.com?subject=Unsubscribe Me">Unsubscribe</a></sub>

                    <details>
                        <summary>Personal information we keep</summary>
                        <code><pre>
                            firstname: ${person.firstname}
                            surname: ${person.surname}
                            email: ${person.email}
                        </pre></code>
                    </details>
                </center>
            </main>
            `
        }
    }
}

// Can't use await in the global scope so it must be wrapped
// Pass in the email recipiants.
async function main(recipiants) {

    // Test function so I don't spam everyone.
    recipiants = Array(1).fill({
        firstname: "Jane",
        surname: "Doe",
        email: "notarealemail@cade.dev"
    })


    console.log(`\n--- Preparing to send ${recipiants.length} email${recipiants.length > 1 ? "s" : ""} ---\n`)

    // Start a timer to keep track
    const startTime = Date.now()

    // Make a place to keep track of successes and failures
    var emails = {
        sent: 0,
        failed: 0
    }
    
    // Loop through all email recipiants
    for (let i=0; i<recipiants.length; i++) {
        // Sleect person
        const person = recipiants[i];

        // Build a string to visualise completion percentage
        const percentLength = 10; // How long is the string (higher = higher fidelity)
        var percent = (i+1) / recipiants.length * percentLength; // Calculate percentage 
        var percentString = `\x1b[40m\x1b[97m ${"#".repeat(Math.ceil(percent))}${" ".repeat(percentLength-Math.ceil(percent))} \x1b[0m`; // Put in string form

        // Build the email using templated info
        const mailinfo = {
            from: `"${secrets.sender.name}" <${secrets.sender.address}>`,
            to: `"${person.firstname} ${person.surname}" <${person.email}>`,
            subject: template.latest(person).subject,
            html: template.latest(person).body
        };

        // Send email
        try {
            // Try and send the email once
            let info = await transporter.sendMail(mailinfo).then(function(){
                emails.sent += 1

                console.log(`${logPrefix} ${emojis.success} ${percentString} Email ${i+1}/${recipiants.length} sent to ${person.email} (${person.firstname} ${person.surname}) - ${(Date.now()-startTime)/1000}s`);
            });
        } catch {
            // Handle failures by retrying up to 10 times, then giving up.
            
            await new Promise((resolve) => {
                console.log(`\x1b[91m${logPrefix} ${emojis.fail} ${percentString}\x1b[91m Email ${i+1}/${recipiants.length} to ${recipiants[i].email} failed, retrying - ${(Date.now()-startTime)/1000}s\x1b[0m`)
            
                // Log retries
                const maxRetries = 10
                let retries = 0

                async function attempt() {
                    retries += 1
    
                    console.log(`\x1b[33m${logPrefix} ${emojis.working} ${percentString}\x1b[33m Retrying email ${i+1}/${recipiants.length} to ${recipiants[i].email} (${retries}/${maxRetries}) - ${(Date.now()-startTime)/1000}s\x1b[0m`)
    
                    try {
                        // Try and send again, if succeeded, break the loop.
                        await transporter.sendMail(mailinfo).then(function() {
                            emails.sent += 1
                            console.log(`${logPrefix} ${emojis.working} ${percentString} Email ${i+1}/${recipiants.length} sent to ${person.email} (${person.firstname} ${person.surname}) - ${(Date.now()-startTime)/1000}s`);
                            resolve()
                        })
                    } catch {
                        // If less than `maxRetries` (default 10) tries, try again
                        if (retries < maxRetries) {
                            await attempt();
                        } else {
                            // If more than 10 tries, accept fail and leave email.
                            emails.failed += 1
                            console.log(`\x1b[91m${logPrefix} ${emojis.fail} ${percentString}\x1b[91m Email ${i+1}/${recipiants.length} to ${recipiants[i].email} failed - ${(Date.now()-startTime)/1000}s\x1b[0m`)
                            resolve()
                        }
                    }
                }
            
                attempt()
            })
        }
        
    } 

    // Log send success
    const endTime = Date.now()
    const successMessage = `\n${logPrefix} ${emojis.success} Successfully sent ${emails.sent}/${recipiants.length} emails in ${(endTime-startTime)/1000} seconds${emails.failed ? `, failed to send ${emails.failed}` : ""}`
    console.log(successMessage)
  
    emails = {
        sent: 100,
        failed: 25
    }

    // Visualise sent vs unsent
    const compareLength = successMessage.length - (logPrefix.length + emojis.success.length + "   ".length)
    const total = emails.sent + emails.failed
    const succeededString = "#".repeat(Math.ceil(emails.sent / total * compareLength))
    const failedString = "#".repeat(compareLength - succeededString.length)
    const compareString = `\x1b[102m\x1b[30m${succeededString}\x1b[101m\x1b[97m${failedString}\x1b[0m`

    console.log(`${logPrefix} ${emojis.analytics} ${compareString}`)
    console.log(`${logPrefix} ${emojis.analytics} \x1b[32mSent${" ".repeat(succeededString.length - "sent".length)}${failedString.length > 0 ? `\x1b[91m| Failed${" ".repeat(failedString.length - "| failed".length)}` : ""}\x1b[0m`)

    // Add some line breaks at the bottom for neatness
    console.log("\n----------\n")

}

// Fetch recipiants list
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


