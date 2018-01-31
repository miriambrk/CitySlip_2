# Dependencies
import requests as req
import json
import zipcodes
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import http.client
from datetime import datetime
import time as time
import csv


# Use the google API to get a list of points of interest
def barfinder(lat, lng):
    # Google API Key
    gkey = "AIzaSyC3VaB3zuIfUjWkuK4rkhpBbt8EZCakNO4"

    # types of points of interest we care about
    target_types = ["liquor_store", "gym", "park", "shopping_mall", "grocery_or_supermarket", "movie_theater"]

    #create a blank dictionary to store results
    results = {}

    # loop through each target type and gather the number of each nearby
    for target in target_types:

        # set default values
        count = 0
        x = True

        # while loop that uses google radar to gather our numbers
        while x == True:

            # take in latitude and longitude, set the search radius to 5 miles (8k meters)
            target_area = {"lat": lat, "lng": lng}
            target_radius = 8000

            # create the target urls and use requests to gather the necessary data
            target_url = "https://maps.googleapis.com/maps/api/place/radarsearch/json" \
                "?types=%s&location=%s,%s&radius=%s&key=%s" % (
                    target, target_area["lat"], target_area["lng"], target_radius,
                    gkey)

            places_data = req.get(target_url).json()

            # use the len function to find the count of results
            numbers = len(places_data["results"])

            # use a series of if statments to check if we returned results. Run a second time if no results showed up as a check
            if numbers > 0:
                results[target.replace("_", " ").title()] = numbers
                x = False
            elif count == 1:
                x = False
            else:
                count += 1

    # return the results
    return results

#---------------------------------------------------------------#
# pie plot of all of the points of interest as percentage of points of interest
def pie_plot(rst, target_zip):
    # create a dataframe
    pie_df = pd.DataFrame.from_dict(rst, orient = 'index')

    # get the sum of points of interest
    tot_results = pie_df.sum()

    # turn the data frame into percentages
    pie_df = (pie_df/tot_results)*100

    # make the graph labels
    labels = pie_df.index

    fig = plt.figure(figsize = [10,10])
    plt.pie(pie_df, shadow=True, startangle=140, labels = labels, labeldistance=1.028, autopct="%1.1f%%", pctdistance = .65, textprops = {"fontsize": 12})

    plt.axis("equal")
    plt.title("Pct of Points of Interest w/in 5 Miles of %s" % target_zip)
    plt.savefig("Points_of_Interest_PieChart.png", bbox_inches='tight')
    plt.show()
