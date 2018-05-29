# MashUP - IronHacks

Hi!. If you want to know about a district in NY to live and that is close to your university, which is also safe and affordable, you are in the right place. In this application you will find information about the NY districts and analysis about each of them.

Important: The safety parameter its based on delits felony.


How to use?
First, wait to load information of datasets.
Second, filter to the metric that you desire
Third, press filter button
four, the chart will fill with 10 districts that comply with your filter

How Filter?
you choose a number between 0 and 1 to each metric, this number
represent the value that you give to metric.
If value is 0, the metric is not considered
If value is 1, the metric is considered, but will be the average of the filters that determines the value to districts

If the value the one metric its 1, but other metrics its 0, the table fill with 10 better districts that comply this metric
If anything metric its 1, get top districts.

How Choose the top 10 districts?

the equation is (a (Va) + b (Vb) + c (Vc) + c (Vc) + c (Vc)) / (number of 1 of metrics filters)

if you want choose a district and see where is, press the name of district. Its will draw one route to the NYU Stern School of Business.

The button "Get Top Districts" fill chart with three district that her average its better with metrics safety, affordability and distance.
The button "Export Data" exports data of the chart to file .csv .
The button "Make a chart" makes a chart with the 10 closest districts

This application uses free data obtained from:

[Neighborhood Names GIS](https://catalog.data.gov/dataset/neighborhood-names-gis)

[NY Districts geoshapes](https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson)

[Crimes in NY](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i/data)

[Dataset contains information on New York City housing by building data](https://catalog.data.gov/dataset/housing-new-york-units-by-building)

[Dataset contains information on New York City air quality surveillance
 data](https://catalog.data.gov/dataset/air-quality-ef520)

 [New York City Farmers Markets](https://catalog.data.gov/dataset/new-york-city-farmers-markets-574c2)


# Author
Andres Giovanny Aldana Wilches

agaldanaw@unal.edu.co
