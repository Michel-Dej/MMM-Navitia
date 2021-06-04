var NodeHelper = require("node_helper");

const Log = require("logger");
const got = require("got");
const { Console } = require("console");

module.exports = NodeHelper.create({

    stop: function() {
        console.log("Shutting down "+ this.name);
        this.connection.close();
    },

    socketNotificationReceived: function(notification, payload) {
        switch(notification)
        {
            case 'MMM-Navitia--INIT':
                this.getDepartures(payload);
                break;
        }
        Log.info(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    },

    //this.sendSocketNotification('SET_CONFIG', this.config);


    getDepartures: function(config) {

        // config.departures.forEach((departure) => {
        for (var indexConfig=0; indexConfig<config.departures.length; indexConfig++)
        {
            var departure = config.departures[indexConfig];
            var nextDepartures = [];

            // TODO Try Catch on config settings

            var url = config.navitiaURL 
                + "/stop_points/stop_point:"
                + departure.departureStopPoint
                + "/lines/line:"
                + departure.departureLine
                + "/departures?direction_type="
                + departure.direction
                + "&key="
                + config.navitiaApiKey;

            (async() => {
                try {
                    var navitiaResponse = await got(url);
                    var navitiaJson = JSON.parse(navitiaResponse.body);
                    var stopPoint = '';
                    var nextTrains = [];
                    
                    // Maximum results depending on the limit
                    for (let i = 0; i < navitiaJson.departures.length && nextTrains.length < config.limit; i++) {

                        // Trains only
                        if (navitiaJson.departures[i].display_informations.physical_mode == "Train")
                        {
                            var nextDeparture = 
                            {
                                "headSign":navitiaJson.departures[i].display_informations.headsign,
                                "lineCode":navitiaJson.departures[i].display_informations.code,
                                "lineColor":navitiaJson.departures[i].display_informations.color,
                                "departureTime":navitiaJson.departures[i].stop_date_time.base_departure_date_time,
                                "direction":navitiaJson.departures[i].route.direction.name
                            }
                            if (stopPoint == '')
                            {
                                stopPoint = navitiaJson.departures[i].stop_point.name;
                            }
            
                            nextTrains.push(nextDeparture);
                        }
                    }

                    nextDepartures.push({"departureStopPoint":stopPoint,"nextTrains":nextTrains})

                    console.log("success");

                    // config.nextDepartures[indexConfig].departureStopPoint = stopPoint;
                    // config.nextDepartures[indexConfig].nextTrains = nextTrains;

                    this.sendSocketNotification('MMM-Navitia-Departures', nextDepartures);

                }
                catch(error) {
                    console.log(error.message);
                }
            })();

        };
    },


});


