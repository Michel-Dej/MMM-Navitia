var NodeHelper = require("node_helper");

const Log = require("logger");
const fetch = require("node-fetch");
const { Console } = require("console");

module.exports = NodeHelper.create({

    stop: function() {
        console.log("Shutting down "+ this.name);
        this.connection.close();
    },

    socketNotificationReceived: function(notification, payload) {
        switch(notification)
        {
            case 'MMM-Navitia--Departures':
                this.getDepartures(payload);
                break;
        }
        Log.info(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    },

    //this.sendSocketNotification('SET_CONFIG', this.config);


    getDepartures: async function(schedules) {

        for (var index = 0; index < schedules.length; index++)
        {
            var url = schedules[index].config.navitiaURL 
                + "/stop_points/stop_point:"
                + schedules[index].request.departureStopPoint
                + "/lines/line:"
                + schedules[index].request.departureLine
                + "/departures?direction_type="
                + schedules[index].request.direction
                + "&key="
                + schedules[index].config.navitiaApiKey;

            // API Call
            try {
                var navitiaResponse = await fetch(url);
            }
            catch(error) {
                console.log (url + "\r\n" + error.message);
            }
            
            // Loading JSON
            try {
                var data = await navitiaResponse.json();
            }
            catch(error) {
                console.log (navitiaResponse + "\r\n" + error.message);
            }

            // Parsing
            try {
                var nextDepartures = [];

                for (var i = 0; i < data.departures.length && nextDepartures.length < schedules[index].config.limit; i++) {

                    // Trains only
                    if (data.departures[i].display_informations.physical_mode == "Train")
                    {
                        var nextDeparture = 
                        {
                            headSign                : data.departures[i].display_informations.headsign,
                            lineCode                : data.departures[i].display_informations.code,
                            lineColor               : data.departures[i].display_informations.color,
                            departureTime           : data.departures[i].stop_date_time.base_departure_date_time,
                            direction               : data.departures[i].route.direction.name,
                            departureStopPointName  : data.departures[i].stop_point.name
                        }

                        nextDepartures.push(nextDeparture);
                    }
                }
                schedules[index].results = nextDepartures;
                console.log("MMM-Navitia: Api parsing Departures successful");
                this.sendSocketNotification('MMM-Navitia-Departures', schedules);
            }
            catch(error)
            {
                console.log(error.message);
            }

        }
    },



    // getDepartures: function(config) {

    //     // config.departures.forEach((departure) => {
    //     for (var index=0; index<config.departures.length; index++)
    //     {
    //         // var departure = config.departures[index];
    //         // var nextDepartures = [];

    //         // TODO Try Catch on config settings

    //         var url = config.navitiaURL 
    //             + "/stop_points/stop_point:"
    //             + config.departures[index].departureStopPoint
    //             + "/lines/line:"
    //             + config.departures[index].departureLine
    //             + "/departures?direction_type="
    //             + config.departures[index].direction
    //             + "&key="
    //             + config.navitiaApiKey;

    //         (async() => {
    //             try {
    //                 var navitiaResponse     = await got(url);
    //                 var navitiaJson         = JSON.parse(navitiaResponse.body);
    //                 var stopPoint           = '';
    //                 var nextTrains  = [];
                    
    //                 // Maximum results depending on the limit
    //                 for (var i = 0; i < navitiaJson.departures.length && nextTrains.length < config.limit; i++) {

    //                     // Trains only
    //                     if (navitiaJson.departures[i].display_informations.physical_mode == "Train")
    //                     {
    //                         var nextDeparture = 
    //                         {
    //                             "headSign"      :navitiaJson.departures[i].display_informations.headsign,
    //                             "lineCode"      :navitiaJson.departures[i].display_informations.code,
    //                             "lineColor"     :navitiaJson.departures[i].display_informations.color,
    //                             "departureTime" :navitiaJson.departures[i].stop_date_time.base_departure_date_time,
    //                             "direction"     :navitiaJson.departures[i].route.direction.name
    //                         }
    //                         if (stopPoint == '')    stopPoint = navitiaJson.departures[i].stop_point.name;
            
    //                         nextTrains.push(nextDeparture);
    //                     }
    //                 }

    //                 nextDepartures.push({"departureStopPoint":stopPoint,"nextTrains":nextTrains})

    //                 console.log("success");

    //                 // config.nextDepartures[indexConfig].departureStopPoint = stopPoint;
    //                 // config.nextDepartures[indexConfig].nextTrains = nextTrains;

    //                 // TODO
    //                 // comment spécifier le bon departure au client
    //                 this.sendSocketNotification('MMM-Navitia-Departures', nextDepartures);

    //             }
    //             catch(error) {
    //                 console.log(error.message);
    //             }
    //         })();

    //     };
    // },


});


