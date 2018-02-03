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
import os





# engine = create_engine("sqlite:///city_input.sqlite")
# Base = automap_base()
# # reflect an existing database into a new model
# Base.prepare(engine, reflect=True)
# session = Session(engine)

# Base.classes.keys()

# Create session (link) from Python to the DB




#---------------------------------------------------------------#

# Function requires a latitude and longitude value
# Call this function to generate census population data for 2010 - 2016
# def cen_block_query(lat,lng):
#     import sqlalchemy
#     from sqlalchemy.ext.automap import automap_base
#     from sqlalchemy.orm import Session
#     from sqlalchemy import create_engine, func
#     engine = create_engine("sqlite:///city_input.sqlite")
#     Base = automap_base()
# # reflect an existing database into a new model
#     Base.prepare(engine, reflect=True)
#     session = Session(engine)
#     census = Base.classes.census_pop
#     # Queries Census for county/State associated to Lat/Long
#     # API Info (No Key Required):  https://www.fcc.gov/general/census-block-conversions-api
#     cen_block_url = ('http://data.fcc.gov/api/block/find?format=json&latitude=%s&longitude=%s&showall=true' % (lat, lng))
#     lat_lon_county = req.get(cen_block_url).json()
#     county_name = lat_lon_county['County']['name']
#     state_name = lat_lon_county['State']['name']
#     sel = [census.state, census.county, census.pop_2010,census.pop_2011,census.pop_2012,
#     census.pop_2013, census.pop_2014, census.pop_2015,census.pop_2016]
#     county_census_pop = session.query(*sel).\
#         filter(census.county == county_name).\
#         filter(census.state == state_name)
#     # Match County and State name to retrieve population information from 2010 through 2016
#     pop_data = {}
#     for row in county_census_pop:
#         pop_data['STATE'] = result[3]
#         pop_data['COUNTY'] = result[4]
#     # pops = []
#     # for row in county_census_pop:
#     #     if str.lower(county_name) in row['county'] and row['state'] == str.lower(state_name): 
#     #         pops.append(int(row[2]))
#     #         pops.append(int(row[3]))
#     #         pops.append(int(row[4]))
#     #         pops.append(int(row[5]))
#     #         pops.append(int(row[6]))
#     #         pops.append(int(row[7]))
#     #         pops.append(int(row[8]))         
#     #     else:
#     #         next

#     # years = ['2010','2011','2012','2013','2014','2015','2016']
#     # pop_dict = {'Years': years, 'Population': pops}
#     # # Return a dataframe with population value for each year
#     # pop_est = pd.DataFrame(pop_dict)
#     return pop_data
#     # , county_name, state_name

#---------------------------------------------------------------#
# call this function to present a line graph of population change
def census_plot(pop_est,county_name,state_name):
    pop_len = len(pop_est['Population'])
    _2010 = pop_est['Population'][1]
    _2016 = pop_est['Population'][pop_len -1]
    pop_growth = 0
    if _2010 < _2016:
        #
        diff_ = (round(((_2016 - _2010)/ _2016) * 100))
        pop_growth = ((_2016 - _2010)/ _2016)
        diff_str = "Note:\nIncrease of population by\n" + str(diff_) + "% from 2010 to 2016"
    elif _2010 > _2016:
        diff_ = (round(((_2010 - _2016)/ _2010) * 100))
        diff_str = "Note:\nDecrease of population by\n" + str(diff_) + "% from 2010 to 2016"
    else:
        diff_str = "Note:\nPopulation estimated as\nthe same from 2010 to 2016"
    ax = pop_est.plot(figsize = (8,6),color='blue', legend=False, marker = '*',markersize=15)
    ax.set_xticklabels(pop_est['Years'], fontsize=13, rotation=45)
    plt.grid()
    plt.figtext(0.91,0.45,diff_str,fontsize=12)
    plt.title("Census Population Estimates (%s County, %s)"%(county_name,state_name), fontsize = 14)
    plt.ylabel("Population", fontsize=14)
    plt.savefig("Population_Change_LineGraph.png", bbox_inches='tight')
    plt.show()
    return pop_growth

#---------------------------------------------------------------#
# Call this function to capture a DF that includes yearly changes in population
def population_df_generator(pop_est):
    pop_len = len(pop_est['Population'])
    pop_diff = [0]
    pop_diff_prcnt = [0]
    for x in range(pop_len-1):
        diff = (pop_est['Population'][x+1] - pop_est['Population'][x])
        pop_diff.append(diff)
        diff_prcnt = round(((diff/ pop_est['Population'][x]) * 100),2)
        pop_diff_prcnt.append(diff_prcnt)
    census_pop_master_df = pop_est
    census_pop_master_df['Difference'] = pop_diff
    census_pop_master_df['Percent Change'] = pop_diff_prcnt
    return census_pop_master_df




#---------------------------------------------------------------#
#Query Community API and return the results as JSON object 'resp'

#API URL: https://developer.onboard-apis.com/docs
#---------------------------------------------------------------#

###------------------------------------------###
### START GET COMMUNITY DATA FUNCTION
### CALLS ONBOARD API FOR: ge demographics / avg Jan and Jun temps / crime rate / sales tax
def get_community_data(target_zip):

   #Onboard API Key
    onboard_api_key = "e01de281b458feb963cf591ed6355a8d"

    conn = http.client.HTTPSConnection("search.onboard-apis.com")
    headers = {
        'accept': "application/json",
        'apikey': "e01de281b458feb963cf591ed6355a8d",
        }

    community_url = "/communityapi/v2.0.0/Area/Full/?"
    queries="AreaId=ZI"+target_zip
    query_url = community_url + queries
    conn.request("GET", query_url, headers=headers)
    res = conn.getresponse()
    resp = json.loads(res.read())
    community_dict = {}
    community_dict['crime'] = resp['response']['result']['package']['item'][0]['crmcytotc']
    community_dict['sales_tax']= resp['response']['result']['package']['item'][0]['salestaxrate']
    community_dict['avg_jan'] = resp['response']['result']['package']['item'][0]['tmpavejan']
    community_dict['avg_jul'] = resp['response']['result']['package']['item'][0]['tmpavejul']
    age_columns = ['age00_04','age05_09','age10_14','age15_19','age20_24','age25_29','age30_34','age35_39','age40_44',
                    'age45_49','age50_54','age55_59','age60_64','age65_69','age70_74','age75_79','age80_84','agegt85']
    labels = []
    age_groups = []
    age_group_values = []
    county_name = resp['response']['result']['package']['item'][0]['countyname']
    for x in age_columns:
        group_name = x
        age_groups.append(x)
        route = resp['response']['result']['package']['item'][0][x]
        age_group_values.append(int(route))
        label = x.replace('age','').replace('_','-').replace('gt85',' >=85') #format labels
        labels.append(label)

    # Create DF with summarized age groups
    age_by_zip = {"Groups": age_groups, "Count": age_group_values}
    age_by_zip_df = pd.DataFrame(age_by_zip)
    community_dict['_0_09'] = age_by_zip_df[0:2]['Count'].sum()
    community_dict['_10_19'] = age_by_zip_df[2:4]['Count'].sum()
    community_dict['_20_29'] = age_by_zip_df[4:6]['Count'].sum()
    community_dict['_30_39'] = age_by_zip_df[6:8]['Count'].sum()
    community_dict['_40_49'] = age_by_zip_df[8:10]['Count'].sum()
    community_dict['_50_59'] = age_by_zip_df[10:12]['Count'].sum()
    community_dict['_60_69'] = age_by_zip_df[12:14]['Count'].sum()
    community_dict['_70_plus'] = age_by_zip_df[14:18]['Count'].sum()
    #Community dict used for FLASK app to jsonify
    return community_dict
### END GET COMMUNITY DATA FUNCTION
###------------------------------------------###


#---------------------------------------------------------------#
# Extract age demographics from the 'resp' JSON object
# Provides a pie chart
#---------------------------------------------------------------#

####!!!!!!!!!!!!!!!!!!! PROBABLY DON'T NEED THIS ANYMORE !!!!!!!!!!!!!!!

# def age_demographics_zip(resp, target_zip):
#     resp_keys = list(resp['response'].keys())
#     if 'result' not in resp_keys: #check if there is data in 'resp'
#         result = 2
#         print('No results to graph. This zip code may not be valid.')

#     else: # If there are results in the 'resp'
#         age_columns = ['age00_04','age05_09','age10_14','age15_19','age20_24','age25_29','age30_34','age35_39','age40_44',
#                     'age45_49','age50_54','age55_59','age60_64','age65_69','age70_74','age75_79','age80_84','agegt85']
#         labels = []
#         age_groups = []
#         age_group_values = []
#         county_name = resp['response']['result']['package']['item'][0]['countyname']
#         for x in age_columns:
#             group_name = x
#             age_groups.append(x)
#             route = resp['response']['result']['package']['item'][0][x]
#             age_group_values.append(int(route))
#             label = x.replace('age','').replace('_','-').replace('gt85',' >=85') #format labels
#             labels.append(label)

#         # Create DF with summarized age groups
#         age_by_zip = {"Groups": age_groups, "Count": age_group_values}
#         age_by_zip_df = pd.DataFrame(age_by_zip)
#         _0_09 = age_by_zip_df[0:2]['Count'].sum()
#         _10_19 = age_by_zip_df[2:4]['Count'].sum()
#         _20_29 = age_by_zip_df[4:6]['Count'].sum()
#         _30_39 = age_by_zip_df[6:8]['Count'].sum()
#         _40_49 = age_by_zip_df[8:10]['Count'].sum()
#         _50_59 = age_by_zip_df[10:12]['Count'].sum()
#         _60_69 = age_by_zip_df[12:14]['Count'].sum()
#         _70_plus = age_by_zip_df[14:18]['Count'].sum()
#         grp_sum_lables = ['1-9','10-19','20-29','30-39','40-49','50-59','60-69','>= 70']
#         grp_sums = [_0_09,_10_19,_20_29,_30_39,_40_49,_50_59,_60_69,_70_plus]
#         grp_dict = {'Groups':grp_sum_lables,'Count':grp_sums}
#         grouped_age_df = pd.DataFrame(grp_dict)
#         # Determine max value amongst age groups and set this to explode in pie chart
#         max_age = grouped_age_df['Count'].idxmax(axis=0, skipna=True)
#         explode_params = [0,0,0,0,0,0,0,0,]
#         explode_params[max_age] = 0.2
#         # Plot pie chart
#         fig = plt.figure(figsize = [10,10])
#         plt.pie(grouped_age_df['Count'], shadow=True, startangle=140,explode = explode_params,
#                 textprops={"fontsize": 12},labels = grouped_age_df['Groups'],autopct="%1.1f%%", pctdistance = .65)
#         plt.title("Age Groups for zip code %s\nin %s" %(target_zip,county_name))
#         plt.savefig("Age_Demographics_PieChart.png", bbox_inches='tight')
#         plt.show()

#         return county_name

###------------------------------------------###
### START GET SCHOOLS FUNCTION
### CALLS ONBOARD API FOR RADIUS OF 5 MILES TO GATHER SCHOOLS IN THE AREA
def get_schools(lat, lng):
    #SCHOOLS TO ADD COUNT TO
    private = 0
    public = 0
    cath = 0
    other = 0

    page_size = 50
    #Onboard API Key
    onboard_api_key = "e01de281b458feb963cf591ed6355a8d"
    conn = http.client.HTTPSConnection("search.onboard-apis.com")
    school_url = "/propertyapi/v1.0.0/school/snapshot?"
    headers = {
        'accept': "application/json",
        'apikey': onboard_api_key,
        }
        #RADIUS SET TO DEFAULT OF 5 MILES
    point = "latitude=" + str(lat) + "&longitude=" + str(lng) + "&radius=5"
    query_url = school_url + point + "&pageSize=" + str(page_size)

    #request the first page of school data
    conn.request("GET", query_url, headers=headers)
    res = conn.getresponse()
    resp = json.loads(res.read())
    #counts for types of schools
    private = 0
    public = 0
    cath = 0
    other = 0
  #loop through and count up private and public schools
    total_schools = resp['status']['total']
    more_schools = True
    schools_to_get = total_schools
    page = 1
    #print("total schools: % s" % total_schools)
    while more_schools:
        #determine how many results to process
        if schools_to_get - page_size >= 0:
            max_s = page_size
            schools_to_get = schools_to_get - page_size
        else:
            max_s = schools_to_get
        for i in range(0, max_s):
            #track number of types of schools
            sch_type = resp['school'][i]['School']['Filetypetext']
            if sch_type == "PRIVATE":
                private = private + 1
            elif sch_type == "PUBLIC":
                public = public + 1
            elif sch_type == "CATHOLIC":
                cath = cath + 1
            else:
                other = other + 1
        if total_schools - (private+public+cath+other) > 0:
            #get the next page of data
            page = page + 1
            query_url = school_url + point + "&pageSize=" + str(page_size) + "&page="+ str(page)
            conn.request("GET", query_url, headers=headers)
            res = conn.getresponse()
            resp = json.loads(res.read())
            resp
        else:
            more_schools = False
 #DICT USED IN THE FLASK APP TO JSONIFY           
    school_dict = {
        "private_school": private,
        "public_school": public,
        "catholic_school": cath,
        "other_school": other 
    }
    return school_dict
### END GET SCHOOLS FUNCTION
###------------------------------------------###