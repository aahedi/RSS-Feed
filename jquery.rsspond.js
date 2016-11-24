/**
 * Rsspond RSS Feed Plugin
 * Version 1.0
 * Author: Brian Kelley
**/

(function ($) {

    var Rsspond, defaultOptions, __bind;

    __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    defaultOptions = {
        url: '',
        newWindow: true,        
        maxCount: 5,
        dateFormat: '',
        periodDay: 'am',
        periodNight: 'pm',
        itemTemplate: '<li><h3>{{title}}</h3><h4>{{creator}}</h4><h6>{{date}}</h6><p>{{description}}</p><a href="{{link}}">Read More</a></li>'
    };

    Rsspond = (function (options) {

        function Rsspond(handler, options) {
            // Trigger Element
            this.handler = handler;

            // Extend default options.
            $.extend(true, this, defaultOptions, options);

            // Plugin Variables
            this.months = [];
            this.itemTemplate = this.newWindow ? this.itemTemplate.replace("<a", "<a target='_blank'") : this.itemTemplate;

            // Extended Variables
            this.query = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + this.url + '" LIMIT ' + this.maxCount;
            this.feedUrl = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(this.query) + "&format=json&diagnostics=false&callback=?";

            // Bind methods.
            this.update = __bind(this.update, this);

            // Init.
            this.callFeed();
        };

        Rsspond.prototype.callFeed = function ( ) {
            var self = this;

            $.ajax({
                url: self.feedUrl,
                dataType: "json",
                success: function (data) {
                    self.loopEntries( data.query.results.rss );
                }
            });
        };

        Rsspond.prototype.loopEntries = function ( list ) {
            var self = this,
                outputString;

            $.each( list, function (i, entry) {
                var d = entry.channel.item;
                    itemOutput = self.itemTemplate;

                console.log(d);

                outputString = self.makeTemplate( itemOutput, d);   
                
                // Output to DOM
                $(self.handler).prepend(outputString);
            });

        };

        Rsspond.prototype.getOrdinal = function ( number ) {
            var suffix = ["th","st","nd","rd"],
            
            v = number % 100;

            return number + ( suffix[ (v-20) % 10 ] || suffix[v] || suffix[0] );
        };

        // Rsspond.prototype.replaceParam = function ( template, partial, callback ) {
        //     if ( template.includes( partial ) ) {
        //         callback();
        //     }
        // };

        Rsspond.prototype.formatDate = function ( date ) {
            var postDate = new Date( date ),
                dateTemplate = this.dateFormat,
                year = postDate.getFullYear().toString(),
                month = postDate.getMonth(),
                day = postDate.getDate(),
                hours = postDate.getHours().toString(),
                minutes = postDate.getMinutes().toString(),
                period = (hours >= 12) ? this.periodNight : this.periodDay,
                pattern = new RegExp('[^-\s]'),
                revDay, revMonth;

            console.log(postDate);

            this.months.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
            

            // if ( dateTemplate.includes("yy") ) {
            //     console.log("includes yy");
            //     dateTemplate = dateTemplate.replace("yy", year.substring(2));

            //     console.log(dateTemplate);
                
            // }

            switch (true) {
                case /yy/.test(dateTemplate):
                    dateTemplate = dateTemplate.replace(/yy/, year.substring(2));
                    
                case /YY/.test(dateTemplate):
                    dateTemplate = dateTemplate.replace(/YY/, year);

                case /m/.test(dateTemplate):
                    revMonth = this.months[month];
                    dateTemplate = dateTemplate.replace(/m/, revMonth );

                case /dd/.test(dateTemplate):
                    revDay = this.getOrdinal(day);
                    dateTemplate = dateTemplate.replace(/dd/, revDay );

                case /DD/.test(dateTemplate):

                    if (day.length <= 1 ) {
                        revDay = '0' + (revDay + 1).toString();
                    }

                    dateTemplate = dateTemplate.replace(/DD/, revDay );

                case /tt/.test(dateTemplate):
                    if (hours > 12) {
                        hours = hours - 12;
                    }

                    dateTemplate = dateTemplate.replace(/tt/, hours + ":" + minutes + period);

                
            }

            return dateTemplate;


            
            
            // console.log(time);


            // if (pattern.test(output)) {

                // Year
                // if ( output.includes("yy") ) {
                //     console.log("includes yy");
                //     value = year.substring(2);
                // }

                // Month
                // if ( output.includes("MM") ) {                
                //     if (month.length <= 1 ) {
                //         month = '0' + (month + 1).toString();
                //     }
                // } else if ( output.includes("mm") ) { 
                //     month = '0' + (month + 1).toString();                
                // } else if ( output.includes("m") && !output.includes("mm")) {
                //     month = this.months[month];
                // } else if ( output.includes("M") && !output.includes("MM")) {
                //     month = this.months[month].slice(0,3);
                // }

                // // Day
                // if ( output.includes("DD") ) {  
                //     if (day.length <= 1 ) {
                //         day = '0' + (day + 1).toString();
                //     }
                // } else if ( output.includes("dd") ) {  
                //     day = this.getOrdinal(day);
                // }

                // // Time
                // if ( output.includes("tt") ) {

                //     if (hours > 12) {
                //         hours = hours - 12;
                //     }
                // }

            //     output = output.replace(pattern, function() {
            //         return "" + value;
            //     });

            // }

            // return output;
            

            // replace the format template

            // console.log(d + "." + m + "." + y);
        };

        Rsspond.prototype.makeTemplate = function(template, data) {
            var self = this,
                output, pattern, ref, key, value;
            
            pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
            output = template;

            while (pattern.test(output)) {
                key = output.match(pattern)[1];
                value = (ref = this.getObjectProperty(data, key)) != null ? ref : '';

                if (key == 'date' && self.dateFormat !== '') {
                    self.formatDate( value );
                }

                if (key == 'description' && value.length > 1) {
                    var newValue = value[1];

                    value = newValue;
                }

                if (key == 'link' && value.length > 1) {
                    var newValue = value[0];

                    value = newValue;
                }

                output = output.replace(pattern, function() {
                    return "" + value;
                });
            }

            return output;
        };

        Rsspond.prototype.getObjectProperty = function( object, property ) {
            var piece, pieces;
            property = property.replace(/\[(\w+)\]/g, '.$1');
            pieces = property.split('.');

            while (pieces.length) {
                piece = pieces.shift();

                if ((object != null) && piece in object) {
                  object = object[piece];
                } else {
                return null;
            }
          }
          return object;
        };

        // Update options
        Rsspond.prototype.update = function ( options ) {
            $.extend(true, this, options);
        };
        

        return Rsspond;
    })();

    $.fn.rsspond = function (options) {
        if (!this.RsspondInstance) {
            this.RsspondInstance = new Rsspond(this, options || {});
        } else {
            this.RsspondInstance.update(options || {});
        }

        return this.show();
    };
})(jQuery);
