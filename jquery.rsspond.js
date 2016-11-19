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
        itemTemplate: '<li><h3>{{title}}</h3><h4>{{creator}}</h4><h6>{{date}}</h6><p>{{description}}</p><a href="{{link}}">Read More</a></li>'
    };

    Rsspond = (function (options) {

        function Rsspond(handler, options) {
            // Trigger Element
            this.handler = handler;

            // Extend default options.
            $.extend(true, this, defaultOptions, options);

            // Extended Variables
            this.query = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + this.url + '" LIMIT ' + this.maxCount;
            this.feedUrl = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(this.query) + "&format=json&diagnostics=false&callback=?";

            // Bind methods.
            this.update = __bind(this.update, this);

            // Init.
            // this.splitTemplate();
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

                outputString = self.makeTemplate( itemOutput, d);   
                
                // Output to DOM
                $(self.handler).prepend(outputString);
            });

        };

        Rsspond.prototype.formatDate = function ( date ) {
            var postDate = new Date( date ),
                dateFormat = this.dateFormat,
                monthArr = [],
                year, month, day, time;

            monthArr.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

            year = postDate.getFullYear().toString();
            month = postDate.getMonth();
            day = postDate.getDate();
            time = postDate.getHours().toString() + ":" + postDate.getMinutes().toString();

            console.log(time);

            if ( dateFormat.indexOf("yy") ) {
                cutYear = year.substring(2);

                console.log(cutYear);
            }



                // switch ( this.dateFormat.toLowerCase().indexOf("d") )

                //MM DD YYYY

                //yy = 99
                //YY = 1999
                //m = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december' 
                //M = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'sept' | 'oct' | 'nov' | 'dec'
                //mm = "0", "04", "7", "12"
                //MM = "00", "04", "07", "12"
                //dd = "7th", "22nd", "31"
                //DD = "07", "31"


            // var d = postDate.getDate();
            // var m =  postDate.getMonth();
            // m += 1;  // JavaScript months are 0-11
            // var y = postDate.getFullYear();


            // replace the format template

            // console.log(d + "." + m + "." + y);
        };

        Rsspond.prototype.makeTemplate = function(template, data) {
            var self = this,
                output, pattern, ref, varName, varValue, newDesc;
            
            pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
            output = template;

          while (pattern.test(output)) {
            varName = output.match(pattern)[1];
            varValue = (ref = this.getObjectProperty(data, varName)) != null ? ref : '';

            if (varName == 'date' && self.dateFormat !== '') {
                self.formatDate( varValue );
            }

            if (varName == 'description' && varValue.length > 1) {
                var newValue = varValue[1];

                varValue = newValue;
            }

            output = output.replace(pattern, function() {
              return "" + varValue;
            });
          }
          
          return output;
        };

        Rsspond.prototype.getObjectProperty = function(object, property) {
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
