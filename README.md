RSSpond
====


The Purpose
----

RSSpond was created due to a lack of RSS feed plugins after Google deprecated their API. A number of these plugins relied on the Google API, and there are too few solutions that currently exist. This is a pure Javascript solution with no dependence on jQuery.

![alt text](http://i.imgur.com/QZdZUel.png "Screenshot of RSSpond")


## Using RSSpond  

Include the script in your HTML file, and call each iteration as such:

```
var feed = new Rsspond({
	url: 'http://yourfeedurl.com',
	itemTemplate: '<div><h3>{{title}}</h3><h4>{{creator}}</h4><p>{{description}}</p><a href="{{link}}">Read Full Story</a></div>'
});

feed.init();
```

## Options

#### selector

The element you want to contain all the feed items (default: '.js-rsspond').

#### url

Pretty important. The URL of the feed you're wanting to display. 

#### newWindow

Boolean value for links to open in a new page (default:true).

#### maxCount

The maximum number of items to display (default: m dd, YY TT).

#### dateFormat

A string format of how you want your date to display.

#### periodDay

A string format of how you want the daytime period to display (default: am).

#### periodNight

A string format of how you want the nighttime period to display (default: pm).

#### itemTemplate

A string format of how you want your info to display with markup. Denote each field with handlebars notation, {{key}}.

#### logData
Boolean value for logging out your data. This is helpful so you can locate fields to put in your template (default: false).

## Date Formatting

#### yy

Display the year in two-digit format(e.g. 16).

#### YY

Display the full year (e.g. 2016).

#### m

Display the full month (e.g October).

#### M

Display the partial month (e.g Oct).

#### MM

Display the numerical month (e.g 10).

#### dd

Display the day with an ordinal suffix (e.g. 16th).

#### DD

Display the numerical day (e.g 16).

#### TT

Display the time as military time (e.g 23:37).

#### tt

Display the time with period (e.g 11:37pm).


## Upcoming Changes

- Local Feed: Bypass the YQL if it's a local file or feed
- Image Functionality: Finding the image and displaying through the itemTemplate