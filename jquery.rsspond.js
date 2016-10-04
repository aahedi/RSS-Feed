(function ($) {

    var Rsspond, defaultOptions, __bind;

    __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    defaultOptions = {
        url: '', 
        author: true,    
        desc: true,
        date: true,
        newWindow: true,        
        maxCount: 5,
        dateFormat: '',
        itemTemplate: '<li href="{{link}}"><img src="{{image}}" /></li>'
    };

    Rsspond = (function (options) {

        function Rsspond(handler, options) {
            // Trigger Element
            this.handler = handler;

            // Plugin Variables
            this.entries = [];

            // Extend default options.
            $.extend(true, this, defaultOptions, options);

            // Extended Variables
            this.query = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + this.url + '" LIMIT ' + this.maxCount;
            this.feedUrl = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(this.query) + "&format=json&diagnostics=false&callback=?";

            // Bind methods.
            this.update = __bind(this.update, this);

            // Init.
            this.createContainer();
            this.callFeed();
        };

        Rsspond.prototype.createContainer = function () {
            $(this.handler) ? $(this.containerTemplate).appendTo($(this.handler)) : false;
        };

        Rsspond.prototype.callFeed = function ( ) {
            var self = this;

            $.ajax({
                url: self.feedUrl,
                dataType: "json",
                success: function (data) {
                    // Store entries for local use
                    self.loopEntries( data.query.results.rss );

                    self.createItems();
                    // console.log(data);
                }
            });
        };

        Rsspond.prototype.loopEntries = function ( list ) {
            var self = this;

            $.each( list, function (i, entry) {
                console.log(entry.channel.item);

                // self.returnEntries(prop, entry.channel.item);

                self.createItems( entry.channel.item );
            });
        };

        Rsspond.prototype.returnEntries = function ( prop, obj ) {

            // if ( this.items !== [] ) {
                // $.each( this.entries, function (i, itm) {
                //     console.log(itm);
                //     console.log(i);
                // });

                // for (int i = 0; i < entries.length; i++) {
                //     entries[i] = new Entries();

                //     console.log(entries);
                // }
                     
        };

        Rsspond.prototype.stripTags = function ( value ) {
            
        };

        Rsspond.prototype.createItems = function ( data ) {
            var item = {},
                output,
                pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
                
                output = this.itemTemplate;

                console.log("pattern " + pattern);
                console.log("output " + output);

            $.each( data, function (key, value) {
                console.log(key);
                console.log(value);
            });
          

            // return output;
        };

        Rsspond.prototype.getObjectProperty = function (  ) {
           
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
