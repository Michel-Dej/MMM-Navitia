Module.register('MMM-Navitia', {
    
    requiresVersion: '2.1.0',

	// Default module config.
	defaults: {
		navitiaURL          :"https://api.navitia.io/v1/coverage/fr-ne",
        limit               :4,
        departures          :[],
        schedules           :[],
        refreshPeriod       :3 * 1000 // every 120s (in ms)
	},

    
    start: function() {
        // for (var i=0; i<config.departures.length; i++)
        // {
        //     schedules.push
        //     (
        //         {
        //             departureStopPoint  :config.departures.departureStopPoint,
        //             departureLine       :config.departures.departureLine,
        //             direction           :config.departures.direction,
        //             nextDepartures      :[],
        //             mode                :"Train",
        //         }
        //     )
        // };

        // setInterval(() => {
            this.sendSocketNotification('MMM-Navitia--INIT', this.config);
        //   }, this.refreshPeriod);

        Log.log(this.name + ' is started!');
    },


	// Override dom generator
	getDom: function() {
		var wrapper = document.createElement("div");
        wrapper.classList.add("mmm-navitia");

        if (!this.departures)
            return wrapper;
        
        for (var i = 0; i < this.departures.length; i++)
        {
            var departureTitle = document.createElement("header");
            departureTitle.classList.add("module-header");
            departureTitle.innerHTML = 'Prochains départs - ' + this.departures[i].departureStopPoint;
            wrapper.appendChild(departureTitle);

            var table = document.createElement("table");
            table.className = this.config.tableClass;

            for (var j = 0; j < this.departures[i].nextTrains.length; j++)
            {
                var row = document.createElement("tr");
                table.appendChild(row);
            
                var lineCell = document.createElement("td");
                var lineSpan = document.createElement("span");
                lineSpan.className = "line";
                lineSpan.setAttribute('style',"border-color: #"+this.departures[i].nextTrains[j].lineColor+"; color: #"+this.departures[i].nextTrains[j].lineColor+";")
                lineSpan.setAttribute('data-line', this.departures[i].nextTrains[j].lineColor);
                lineSpan.innerHTML = this.departures[i].nextTrains[j].lineCode;
                lineCell.appendChild(lineSpan);
                row.appendChild(lineCell);
    
                var timeStampCell = document.createElement("td");
                var timeStamp = this.departures[i].nextTrains[j].departureTime;
                timeStampCell.className = "headSign";
                // TODO : regex on datetime 20210603T221600
                timeStampCell.innerHTML = timeStamp.substring(timeStamp.indexOf('T')+1, timeStamp.indexOf('T')+3)
                                        + ":"
                                        + timeStamp.substring(timeStamp.indexOf('T')+3, timeStamp.indexOf('T')+5)
                row.appendChild(timeStampCell);
    
                var headSignCell = document.createElement("td");
                headSignCell.className = "headSign";
                headSignCell.innerHTML = this.departures[i].nextTrains[j].headSign;
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
        this.departures = payload;
        this.updateDom();
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    }
});