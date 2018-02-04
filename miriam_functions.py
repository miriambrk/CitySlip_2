# Dependencies
import requests as req
import json
import zipcodes
import pandas as pd

import numpy as np
import http.client
from datetime import datetime
import time as time
import csv
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import Column, Integer, String, Float, Text

#PROJ2: Get the home sales and rentals from the sqlite database
def get_real_estate_data(zip_code, Home_sales, Rentals,session):

    print("get real estate data zip: " + str(zip_code))
    # results = session.query( Home_sales.city, Home_sales.state, Home_sales.county).filter(Home_sales.zip_code == zip_code).all()
    # try:
    #     print("city: " + results['city'])
    # except:
    #     print("error; no city found")

    results = session.query (Home_sales.city, Home_sales.state, Home_sales.county).filter(Home_sales.zip_code == zip_code).all()
    try:
        for row in results:
            city = row[0]
            state = row[1]
            county = row[2]
        print("state: "+state)
    except:
        print("unable to get city st and county")

    results = session.query( Home_sales.s2014_03, Home_sales.s2014_06, Home_sales.s2014_09, Home_sales.s2014_12,\
         Home_sales.s2015_03, Home_sales.s2015_06, Home_sales.s2015_09, Home_sales.s2015_12, \
         Home_sales.s2016_03, Home_sales.s2016_06, Home_sales.s2016_09, Home_sales.s2016_12, \
         Home_sales.s2017_03, Home_sales.s2017_06, Home_sales.s2017_09,Home_sales.s2017_12).filter(Home_sales.zip_code == zip_code).all()
    try:
        print("NO PROBLEM AT ALL")

        all_homes = pd.DataFrame(results, columns=['2014_03', '2014_06', '2014_09','2014_12', '2015_03','2015_06', '2015_09','2015_12',\
        '2016_03','2016_06', '2016_09','2016_12','2017_03','2017_06', '2017_09','2017_12'])
        home_values = all_homes.values.tolist()
        print(home_values)
        periods = all_homes.columns.tolist()
        print(periods)
    except:
        print("PROBLEM")
        #z = find_near_zips(zipc, city, state)
        print("error; no home sales found")

    results = session.query( Rentals.r2014_03, Rentals.r2014_06, Rentals.r2014_09, Rentals.r2014_12,\
         Rentals.r2015_03, Rentals.r2015_06, Rentals.r2015_09, Rentals.r2015_12, \
         Rentals.r2016_03, Rentals.r2016_06, Rentals.r2016_09, Rentals.r2016_12, \
         Rentals.r2017_03, Rentals.r2017_06, Rentals.r2017_09,Rentals.r2017_12).filter(Rentals.zip_code == zip_code).all()
    try:
        all_rentals = pd.DataFrame(results, columns=['2014_03', '2014_06', '2014_09','2014_12', '2015_03','2015_06', '2015_09','2015_12',\
            '2016_03','2016_06', '2016_09','2016_12','2017_03','2017_06', '2017_09','2017_12'])
        rentals = all_rentals.values.tolist()
    except:
        #z = find_near_zips(zipc, city, state)
        print("error; no rentals found")

    REdata = []
    for i in range(len(periods)):
        row = {}
        row["period"] = periods[i]
        print(home_values[0][i])
        row["home_value"] = home_values[0][i]
        row["rental"] = rentals[0][i]
        REdata.append(row)

    #store the most recent home value and rent for use in score
    recent_home_value = all_homes.iloc[-1]['2017_12']
    recent_rent = all_rentals.iloc[-1]['2017_12']

    print(REdata)
    return (REdata, city, state, county, recent_home_value, recent_rent)

#PROJ2: get all market health index from sqlite; also get median home sales and rental price
# This index indicates the current health of a given region’s housing market relative to other markets nationwide.
# It is calculated on a scale of 0 to 10, with 0 = the least healthy markets and 10 = the healthiest markets.
def get_market_health_and_extremes(zip_code, Market_Health, Home_sales, Rentals, session):
    market_dict = {}
    results = session.query( Market_Health.market_health_index).filter(Market_Health.zip_code == zip_code).all()
    try:
        for mhi in results:
            market_health_index = mhi.market_health_index
        market_dict['market_health_index'] = market_health_index
    except:
        #no market health data for input zip code; store 0 as a N/A value
        market_dict["market_health_index"] = 0
    print("Market Health: %s" % market_dict['market_health_index'])

    results = session.query(Home_sales.s2017_12).all()
    all_homes = pd.DataFrame(results, columns=['2017_12'])

    results = session.query(Rentals.r2017_12).all()
    all_rentals = pd.DataFrame(results, columns=['2017_12'])

    #get median home values and rental prices
    median_home_value = all_homes['2017_12'].median()
    median_rental_price = all_rentals['2017_12'].median()

    market_dict["median_home_value"] = median_home_value
    market_dict["median_rental_price"] = median_rental_price
    return market_dict
















#---------------------------------------------------------------#
# Find the nearest zipcode to a zipcode missing data
def find_near_zips(zipc, city, state):
    x = zipcodes.similar_to(zipc[0],
                    zips=zipcodes.filter_by(zipcodes.list_all(), active=True, city= city, state = state))
    zipps = []
    for zips in x:
        zipps.append(zips['zip_code'])
    return zipps

#---------------------------------------------------------------#

# Function to store Zillow home values and monthly rental prices for 2013-2017 quarters
# Function requires a zip code string; returns data frame
# If there is no Zillow data for the zip code, find nearby zips and average their data

def get_home_data(zipc, city, state):
    zip_code = int(zipc)

    #create lists for the Zillow data
    home_values=[]
    monthly_rentals=[]
    periods = []
    years=["2014","2015","2016","2017"]
    months=["03","06","09","12"]

    #read all home values and monthly rents
    all_homes = pd.read_csv("Resources/Zip_Zhvi_AllHomes.csv")
    all_rental_homes = pd.read_csv("Resources/Zip_Zri_AllHomes.csv")

    ## Zillow Home Value Index (ZHVI) is a time series tracking the monthly median home value
    # get the data just for the input zip code
    try:
        #get home values for input zip
        zc_all_homes = all_homes[all_homes["RegionName"] == zip_code].iloc[0]

        ## Zillow Rental Index (ZRI) is a time series tracking the monthly median rental
        zc_all_rental_homes = all_rental_homes[all_rental_homes["RegionName"] == zip_code].iloc[0]

        #get the home value and monthly rental data for the years/months specified above
        for y in years:
            for m in months:
                col_name = "%s-%s" % (y,m)

                try:
                    #get the data for this column name
                    home_value = zc_all_homes[col_name]
                    rent = zc_all_rental_homes[col_name]
                    home_values.append(home_value)
                    monthly_rentals.append(rent)
                    periods.append(col_name)
                    #print(col_name, home_value, rent)
                except:
                    #print("no value for: %s" % col_name)
                    continue
        found = 3
    except:
        #find nearby zip codes because there are no rows for the input zip
        z = find_near_zips(zipc, city, state)
        #print(z)
        found = 3

        p = {}
        for q in z:
            q = int(q)
            try:
                zc_all_homes = all_homes[all_homes["RegionName"] == q].iloc[0]
                zc_all_rental_homes = all_rental_homes[all_rental_homes["RegionName"] == q].iloc[0]

                #get the home value and monthly rental data for the years/months specified above
                for y in years:
                    for m in months:
                        col_name = "%s-%s" % (y,m)
                        try:
                            #get the data for this column name
                            home_value = zc_all_homes[col_name]
                            rent = zc_all_rental_homes[col_name]
                            home_values.append(home_value)
                            monthly_rentals.append(rent)
                            periods.append(col_name)
                            #print(col_name, home_value, rent)
                        except:
                            continue
                            #print("no value for: %s" % col_name)

            except IndexError:
                next
        #if no data was found, store 0s
        if len(home_values) == 0 & len(monthly_rentals) == 0:
            periods.append(0)
            home_values.append(0)
            monthly_rentals.append(0)
            print("No Home Data Found")
            found = 0
        elif len(monthly_rentals) == 0:
            #monthly_rentals.append(0)
            print("No Rent Data Found")
            found = 1
            for i in range(0, len(home_values)):
            	monthly_rentals.append(0)
        elif len(home_values) == 0:
            #home_values.append(0)
            print("No Home Value Data Found")
            found = 2
            for j in range(0, len(monthly_rentals)):
            	home_values.append(0)

    #store rent and house prices into a DF

    zillow_df=pd.DataFrame({"period": periods,
                        "home_value": home_values,
                        "monthly_rent": monthly_rentals})


    df = zillow_df.groupby("period").mean()


    #store the most recent home value and rent for use in score
    home_value = df.iloc[-1]['home_value']
    rent = df.iloc[-1]['monthly_rent']

    return df, periods, home_value, rent, found


#---------------------------------------------------------------#
#Query Community API and return the results as JSON object 'resp'

#API URL: https://developer.onboard-apis.com/docs
#---------------------------------------------------------------#

# JUST CALL THIS; It's in Kris's

def get_community_data(target_zip):

   #Onboard API Key
    onboard_api_key = "727ca1bf9168cb8329806cb7e0eef3f6"

    conn = http.client.HTTPSConnection("search.onboard-apis.com")
    headers = {
        'accept': "application/json",
        'apikey': "727ca1bf9168cb8329806cb7e0eef3f6",
        }

    community_url = "/communityapi/v2.0.0/Area/Full/?"
    queries="AreaId=ZI"+target_zip
    query_url = community_url + queries
    conn.request("GET", query_url, headers=headers)
    res = conn.getresponse()
    resp = json.loads(res.read())
    return resp
#---------------------------------------------------------------#
# Extract age demographics from the 'resp' JSON object
# Provides a pie chart
#---------------------------------------------------------------#


#get_details(target_zip)
def get_details(target_zip):

    resp = get_community_data(target_zip)

    #store the individual fields in a dictionary

    crime = resp['response']['result']['package']['item'][0]['crmcytotc']
    sales_tax= resp['response']['result']['package']['item'][0]['salestaxrate']
    avg_jan = resp['response']['result']['package']['item'][0]['tmpavejan']
    avg_jul = resp['response']['result']['package']['item'][0]['tmpavejul']

    print("Average Winter Temperature (F): %s" % avg_jan)
    print("Average Summer Temperature (F): %s" % avg_jul)

    return crime, sales_tax, avg_jan, avg_jul

#---------------------------------------------------------------#

# Function to store various information about a location, such as walkability score, market health index, schools
# Function requires a zip code string, latitude and longitude and the dictionary; returns the dictionary
def get_zip_factors (zipc, lat, lng, zip_factors_dict):


    #1) Market Health Index:
    # This index indicates the current health of a given region’s housing market relative to other markets nationwide.
    # It is calculated on a scale of 0 to 10, with 0 = the least healthy markets and 10 = the healthiest markets.
    market_health_index = pd.read_csv("Resources/MarketHealthIndex_Zip.csv",encoding="ISO-8859-1")

    try:
        zip_market_health = market_health_index[market_health_index["RegionName"] == int(zipc)].iloc[0]
        zip_factors_dict["market_health"] = zip_market_health['MarketHealthIndex']
    except:
        #no market health data for input zip code; store 0 as a N/A value
        zip_factors_dict["market_health"] = 0
    print("Market Health: %s" % zip_factors_dict['market_health'])

    #2) ##get walkability, transit and bike scores from Walk Score.
    walk_api_key = "ca8240c847695f334874949c406f04aa"
    walk_url = "http://api.walkscore.com/score?format=json&"
    # Build query URL
    query_url = walk_url  + "&lat=" + str(lat) + "&lon=" + str(lng) + "&transit=1&bike=1" + "&wsapikey=" + walk_api_key
    walk_response = req.get(query_url).json()

    # Get the neighborhood data from the response
    walk_score = walk_response['walkscore']
    walk_description=walk_response['description']

    zip_factors_dict["walk_score"] = walk_score
    zip_factors_dict["walk_description"] = walk_description

    try:
        bike_score = walk_response['bike']['score']
        bike_description = walk_response['bike']['description']
        zip_factors_dict["bike_score"] = bike_score
        zip_factors_dict["bike_description"] = bike_description
    except:
        print("no bike score")
        bike_score = 0
        bike_description = ""
    print("Walkability and Bikability Scores: %s: %s, %s: %s" % (walk_score, walk_description, bike_score, bike_description))

    #3) get community data and store in dictionary
    crime, salestax, avgtempJan, avgtempJul = get_details(zipc)
    zip_factors_dict["crime_risk"] = crime
    zip_factors_dict["sales_tax_rate"] = salestax
    zip_factors_dict["avg_temp_jan"] = avgtempJan
    zip_factors_dict["avg_temp_jul"] = avgtempJul

    #4) store the median RE data in the dictionary
    zip_factors_dict["median_home_value"], zip_factors_dict["median_rent"] = get_real_estate_extremes()

    #print("crime risk: %s" % crime)
    #print("sales tax rate: %s" % salestax)
    #print("avgJan %s" % avgtempJan)
    #print("avgJul %s" % avgtempJul)

    return zip_factors_dict

#---------------------------------------------------------------#



#---------------------------------------------------------------#
# UPDATED FOR PROJ2 (2/3/18)
#function to calculate the city score/zip slip!  Calculate 0-100 score
def compute_score(zip_factors):

    #prepare to write the computed score and meta data to the sql database
    Base = declarative_base()
    engine = create_engine("sqlite:///city_slip.sqlite")
    session = Session(engine)

    class City_Slip(Base):
        __tablename__ = "city_slip"
        id = Column(Integer, primary_key=True)
        zip_code = Column(Integer)
        city = Column(Text)
        state = Column(Text)
        county = Column(Text)
        score_date = Column(Text)
        avg_home_value = Column(Float)
        avg_rent = Column(Float)
        re_market_health = Column(Float)
        avg_winter_temp = Column(Float)
        avg_summer_temp = Column(Float)
        total_schools = Column(Integer)
        total_pois = Column(Integer)
        pop_growth = Column(Float)
        sales_tax_rate = Column(Float)
        walkability = Column(Float)
        crime_risk = Column(Float)
        score = Column(Float)


    # compute ratios; closest to 1 is best
    # home and rent each have a max of 0.05
    #if no recent home value or rent data, set the scores to a median value but notify user
    if zip_factors['recent_sale'] == 0:
        RE_home = 0.025
        print("There is no Home Value Data.")
    else:
        home_value_ratio = zip_factors['recent_sale'] / zip_factors['market_dict']['median_home_value']

        #RE_value (home: 0.05; rent: 0.05)
        if home_value_ratio < 1.3:
            RE_home = 0.05
        elif home_value_ratio <= 1.8:
            RE_home = 0.03
        else:
            RE_home = 0.01

    if zip_factors['recent_rent'] == 0:
        RE_rent = 0.025
        print("There is no Monthly Rental Data.")
    else:
        rent_ratio = zip_factors['recent_rent'] / zip_factors['market_dict']['median_rental_price']
        if rent_ratio < 1.3:
            RE_rent= 0.05
        elif rent_ratio <= 1.8:
            RE_rent = 0.03
        else:
            RE_rent = 0.01

    #market health is 0.05
    MH = (zip_factors['market_dict']['market_health_index']/10) * .05


    # walkability is a percent -- worth 0.05
    WK = (zip_factors['community_dict']['walk_score']/100) * 0.05

    tax_rate = float(zip_factors['community_dict']['sales_tax'])
    #tax - worth 0.05
    if tax_rate == 0:
        TX = 0.05
    elif tax_rate <= 3:
        TX = 0.04
    elif tax_rate <= 5:
        TX = 0.03
    elif tax_rate <= 6:
        TX = 0.02
    elif tax_rate <= 7:
        TX = 0.01
    else:
        TX = 0

    #crime risk (100 is median); worth 0.15
    crime = float(zip_factors['community_dict']['crime'])
    if crime < 100:
        CM = .15
    elif crime <= 150:
        CM = .1
    elif crime <= 200:
        CM = 0.05
    else:
        CM = 0

    #weather; worth .1 total
    avg_jan = float(zip_factors['community_dict']['avg_jan'])
    if avg_jan < 20:
        WW = 0
    elif avg_jan < 30:
        WW = 0.01
    elif avg_jan < 40:
        WW = 0.03
    elif avg_jan < 50:
        WW = 0.04
    else:
        WW = 0.05

    avg_jul = float(zip_factors['community_dict']['avg_jul'])
    if avg_jul > 100:
        WS = 0
    elif avg_jul > 90:
        WS = 0.01
    elif avg_jul >80:
        WS = 0.03
    elif avg_jul >70:
        WS = 0.05
    else:
        WS = 0.04


    #population growth: 0.10 total
    ##########  NEED To GET RID OF THE ASSIGNMENT TO 0 WHEN THE REAL POP-GROWTH DATA IS AVAILABLE
    zip_factors['pop_growth'] = 0
    pop_growth = float(zip_factors['pop_growth'])
    #temporary; delete when the real thing is available
    if pop_growth < 0:
        PG = 0
    elif pop_growth >= 0.07:
        PG = 0.05
    else:
        PG = 0.1

    #POIs: total worth: .3 broken down as follows:

    points_of_interest = zip_factors['poi_json']['Groceryorsupermarket'] + \
        zip_factors['poi_json']['Gym'] + zip_factors['poi_json']['Liquorstore'] + zip_factors['poi_json']['Movietheater'] + \
        zip_factors['poi_json']['Park'] + zip_factors['poi_json']['Shoppingmall']
    if points_of_interest < 400:
    	POI = .1
    elif points_of_interest < 800:
    	POI = .2
    else:
    	POI = .3

    #use ratio of private to public schools; 0.1 total
    if zip_factors['community_dict']['public_school'] == 0:
        SCH = 0
    else:
        sum_schools = zip_factors['community_dict']['private_school'] + zip_factors['community_dict']['catholic_school'] + zip_factors['community_dict']['public_school']
        SCH = ((zip_factors['community_dict']['private_school'] + \
            zip_factors['community_dict']['catholic_school']) / zip_factors['community_dict']['public_school']) * 0.1
        #if ratio of private to public is over 1, then cap the SCH score
        if SCH > 0.1:
            SCH = 0.1


    #add up all the values to get the score:
    score = RE_home + RE_rent + MH + WK + TX + CM + WW + WS + PG + POI + SCH
    date = datetime.now().strftime("%m/%d/%y")
    city = zip_factors['city']
    zip_code = zip_factors['zip_code']
    state = zip_factors['state']
    county = zip_factors['county']

    # print the breakdown of total score
    print("Breakdown of Total Score for %s" % zip_code)
    print()
    print("Average Home Value: %s/5 | Average Rent: %s/5 | Real Estate Market Health: %s/5" % (round(RE_home*100, 2), round(RE_rent*100,2), round(MH*100,2)))
    print("Average Winter Temp (F): %s/5 | Average Summer Temp (F): %s/5" % (round(WW*100,2), round(WS*100,2)))
    print("Total Schools: %s/10 | Total Points of Interest: %s/30" % (round(SCH*100,2), round(POI*100,2)))
    print("Population Growth: %s/10" % round(PG*100, 2))
    print("Sales Tax Rate: %s/5" % round(TX*100,2))
    print("Walkability: %s/5" % round(WK*100,2))
    print("Crime Risk: %s/15" % round(CM*100,2))
    print()
    print("CitySlip Score (0-100): %s" % round(score * 100,2))

    #write the metadata to the City_Slip database
    score_data = City_Slip(
        zip_code = zip_factors['zip_code'],
        city = zip_factors['city'],
        state = zip_factors['state'],
        county = zip_factors['county'],
        score_date = date,
        avg_home_value = zip_factors['recent_sale'],
        avg_rent = zip_factors['recent_rent'],
        re_market_health = zip_factors['market_dict']['market_health_index'],
        avg_winter_temp = zip_factors['community_dict']['avg_jan'],
        avg_summer_temp = zip_factors['community_dict']['avg_jul'],
        total_schools = sum_schools,
        total_pois = points_of_interest,
        pop_growth = float(zip_factors['pop_growth']),
        sales_tax_rate = float(zip_factors['community_dict']['sales_tax']),
        walkability = zip_factors['community_dict']['walk_score'],
        crime_risk = zip_factors['community_dict']['crime'],
        score = score)

    session.add(score_data)
    session.commit()

    return score
