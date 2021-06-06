Module.register('MMM-Navitia', {
    
    requiresVersion: '2.1.0',

	// Default module config.
	defaults: {
		navitiaURL          :"https://api.navitia.io/v1/coverage/fr-ne",
        limit               :4,
        departures          :[],
        schedules           :[],
        refreshPeriod       :120 * 1000 // every 120s (in ms)
	},

    
    start: function() {
        for (var i = 0; i < this.config.departures.length; i++)
        {
            this.defaults.schedules.push
            (
                {
                    config:
                    {
		                navitiaURL              :"https://api.navitia.io/v1/coverage/fr-ne",
                        navitiaApiKey           : this.config.navitiaApiKey,
                        limit                   : this.config.departures[i].limit
                    },
                    request:
                    {
                        departureStopPoint      : this.config.departures[i].departureStopPoint,
                        departureStopPointName  : '',
                        departureLine           : this.config.departures[i].departureLine,
                        direction               : this.config.departures[i].direction,
                        mode                    : "Train",
                    },
                    results                     : [ // Array of :
                    // {
                    //     headSign,
                    //     lineCode,
                    //     lineColor,
                    //     departureTime,
                    //     direction,
                    //     departureStopPointName
                    // }
                    ],
                }
            )
        };

        this.sendSocketNotification('MMM-Navitia--Departures', this.defaults.schedules);
        setInterval(() => {
            this.sendSocketNotification('MMM-Navitia--Departures', this.defaults.schedules);
          }, this.defaults.refreshPeriod);

        Log.log(this.name + ' is started!');
    },


	// Override dom generator
	getDom: function() {
		var wrapper = document.createElement("div");
        wrapper.classList.add("mmm-navitia");

        // if (!this.defaults.schedules)
        // {
        //     var departureTitle = document.createElement("header");
        //     departureTitle.classList.add("module-header");
        //     departureTitle.innerHTML = 'Prochains départs - Loading...';
        //     return wrapper;
        // }

        for (var i = 0; i < this.defaults.schedules.length; i++)
        {
            var table = document.createElement("table");
            table.classList.add("schedules");

            for (var j = 0; j < this.defaults.schedules[i].results.length; j++)
            {
                if (j==0)
                {
                    var departureTitle = document.createElement("header");
                    departureTitle.classList.add("module-header");
                    departureTitle.innerHTML = 'Prochains départs - ' + this.defaults.schedules[i].results[j].departureStopPointName;
                    wrapper.appendChild(departureTitle);
                }

                var row = document.createElement("tr");
                table.appendChild(row);
            
                var lineCell = document.createElement("td");
                var lineSpan = document.createElement("span");
                lineSpan.className = "line";
                lineSpan.setAttribute('style',"border-color: #"+this.defaults.schedules[i].results[j].lineColor+"; color: #"+this.defaults.schedules[i].results[j].lineColor+";")
                lineSpan.setAttribute('data-line', this.defaults.schedules[i].results[j].lineColor);
                lineSpan.innerHTML = this.defaults.schedules[i].results[j].lineCode;
                lineCell.appendChild(lineSpan);
                row.appendChild(lineCell);
    
                var timeStampCell = document.createElement("td");
                var timeStamp = this.defaults.schedules[i].results[j].departureTime;
                timeStampCell.className = "headSign";
                // TODO : regex on datetime 20210603T221600
                timeStampCell.innerHTML = timeStamp.substring(timeStamp.indexOf('T')+1, timeStamp.indexOf('T')+3)
                                        + ":"
                                        + timeStamp.substring(timeStamp.indexOf('T')+3, timeStamp.indexOf('T')+5)
                row.appendChild(timeStampCell);
    
                var headSignCell = document.createElement("td");
                headSignCell.className = "headSign";
                headSignCell.innerHTML = this.defaults.schedules[i].results[j].headSign;
                row.appendChild(headSignCell);
            }

            wrapper.appendChild(table);
        }

        return wrapper;
	},


    loaded: function(callback) {
        Log.log(this.name + ' is loaded!');
        callback();
    },


    getStyles: function () {
		return ["MMM-Navitia.css"];
	},


    socketNotificationReceived: function(notification, payload) {
        this.defaults.schedules = payload;
        this.updateDom();
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    }
});