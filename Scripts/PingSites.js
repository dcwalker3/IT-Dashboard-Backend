// Import Site Model so we can use the Schema.
const Site = require('../APIModels/Sites.model.js');

// Assign a function to the variable ping.
let ping = function () {
    // Get all sites.
    Site.find({}, function (err, sites) {
        if (err) {
            console.log(err);
        } else {
            // For each site, ping it.
            sites.forEach(site => {

                // Get the site's IP address/url.
                let url = site.url;

                // Import the ping module.
                const ping = require('ping');

                // Ping the site.
                ping.promise.probe(url)
                    .then(function (res) {

                        // Create a new Date object with the current time.
                        const currentTime = new Date(Date.now());

                        // If the site is up, update the site's lastOnline field.
                        if (res.alive) {
                            site.currentStatus = "Online";
                            site.lastOnline = currentTime;
                        }
                        // If the site is down, update the site's lastOffline field.
                        else {
                            site.currentStatus = "Offline";
                            site.lastOffline = currentTime;
                        }

                        // Save the site.
                        site.save();

                    })
                    // Error handling.
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        }
    });
}

// Have the ping function run every 5 minute.
// This is so we don't have to ping the sites every time we want to check their status.
// as well as avoid overloading the server.
let pingSites =  function () {
    setInterval( ping, 300000);
}

// Exports
module.exports = {
    pingSites
}

