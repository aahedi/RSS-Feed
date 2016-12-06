/**
 * Rsspond RSS Feed Plugin
 * Version 1.0
 * Author: Brian Kelley
 * Tested with:
 * http://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml
 * http://jquery-plugins.net/rss
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
        dateFormat: 'm dd, YY tt',
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

                outputString = self.replaceTemplate( itemOutput, d);   
                
                // Output to DOM
                $(self.handler).prepend(outputString);
            });

        };

        Rsspond.prototype.getOrdinal = function ( number ) {
            var suffix = ["th","st","nd","rd"],
            
            v = number % 100;

            return number + ( suffix[ (v-20) % 10 ] || suffix[v] || suffix[0] );
        };       

        Rsspond.prototype.stripTags = function ( el ) {
            var tmp = document.createElement("div");
            tmp.innerHTML = el;

            return tmp.textContent || tmp.innerText || "";
        };

        Rsspond.prototype.testTemplate = function ( pattern ) {
            return pattern.test(this.dateFormat);
        };

        Rsspond.prototype.CheckTemplate = function  () {
            // body...
        };

        Rsspond.prototype.formatDate = function ( date ) {
            var postDate = new Date( date ),
                dateTemplate = this.dateFormat,
                year = postDate.getFullYear().toString(),
                month = postDate.getMonth(),
                day = postDate.getDate(),
                hours = postDate.getHours().toString(),
                minutes = postDate.getMinutes().toString(),
                period = (hours >= 12) ? this.periodNight : this.periodDay,
                partial,
                revDay;

            var CheckTemplate = {
                "yearFull": function () {
                    dateTemplate = dateTemplate.replace(/\bYY\b/, year);
                },
                "yearPartial": function () {
                    dateTemplate = dateTemplate.replace(/\byy\b/, year.substring(2));                    
                },
                "monthNumber": function () {
                    dateTemplate = dateTemplate.replace(/\bM\b/, month);                    
                },
                "monthFull": function () {
                    dateTemplate = dateTemplate.replace(/\bm\b/, this.months[month]);                    
                },
                "monthPartial": function () {
                    dateTemplate = dateTemplate.replace(/\byy\b/, this.months[month].slice(0,3));                    
                },
                "dayNumber": function () {
                    dateTemplate = dateTemplate.replace(/\bdd\b/, day);                    
                },
                "dayOrdinal": function () {
                    dateTemplate = dateTemplate.replace(/\bDD\b/, '0' + (day + 1).toString());                    
                },
                "timeFull": function () {
                    dateTemplate = dateTemplate.replace(/\btt\b/, hours + ":" + minutes + period);                  
                },
                "timePeriod": function () {
                    dateTemplate = dateTemplate.replace(/\bTT\b/, year.substring(2));                    
                },
            };

            this.months.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

            if ( CheckTemplate[partial] ) {
                CheckTemplate[partial]();
            }

            // Year       
            // if ( this.testTemplate(/\byy\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\byy\b/, year.substring(2));
            // } else if ( this.testTemplate(/\bYY\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\bYY\b/, year);
            // }

            // // Month
            // if ( this.testTemplate(/\bm\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\bm\b/, this.months[month] );
            // } else if ( this.testTemplate(/\bM\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\bM\b/, this.months[month].slice(0,3) );
            // }

            // // Day
            // if ( this.testTemplate(/\bdd\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\bdd\b/, this.getOrdinal(day) );
            // } else if ( this.testTemplate(/\bDD\b/) ) {
            //     if (day.length <= 1 ) {
            //         revDay = '0' + (revDay + 1).toString();
            //     }

            //     dateTemplate = dateTemplate.replace(/\bDD\b/, revDay );
            // }

            // // Time
            // if ( this.testTemplate(/\btt\b/) ) {
            //     if (hours > 12) {
            //         hours = hours - 12;
            //     }

            //     dateTemplate = dateTemplate.replace(/\btt\b/, hours + ":" + minutes + period);
            // } else if ( this.testTemplate(/\bTT\b/) ) {
            //     dateTemplate = dateTemplate.replace(/\bTT\b/, hours + ":" + minutes);
            // }

            return dateTemplate;
        };

        Rsspond.prototype.replaceTemplate = function(template, data) {
            var self = this,
                output, pattern, ref, key, value;
            
            pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
            output = template;

            while (pattern.test(output)) {
                key = output.match(pattern)[1];
                value = (ref = this.getObjectProperty(data, key)) != null ? ref : '';

                if (key == 'date' && self.dateFormat !== '') {
                    value = self.formatDate( value );
                }

                if (key == 'description') {
                    
                    if ( typeof value == 'object') {
                        var newValue = value[1];
                    } else if ( typeof value == 'string' ) {
                        var newValue = self.stripTags(value);
                    }

                    value = newValue;
                }

                if (key == 'link' && typeof value == 'object') {
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
