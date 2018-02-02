from flask import Flask, render_template, jsonify, redirect
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#from zip_functions import bar_finder, cen_block_query, population_df_generator, get_real_estate_extremes
#from zip_functions import find_near_zips, get_home_data, age_demographics_zip, get_details, get_zip_factors, get_school_data, compute_score
from miriam_functions import get_real_estate_data

app = Flask(__name__)

Base = automap_base()
engine = create_engine("sqlite:///city_input.sqlite")
# reflect an existing database into a new model
Base.prepare(engine, reflect=True)
Base.classes.keys()
# Create session (link) from Python to the DB
session = Session(engine)
Home_sales = Base.classes.home_sales
Rentals = Base.classes.rentals

default_zip = 22180



#1) read all the static files and store in JSON structures
# zip code file, 3 real estate files, census
all_homes_json = get_real_estate_data(default_zip, Home_sales, Rentals)

#2 call everything for the default zip codes
# all API calls
# build all data for the graphs


# display dashboard homepage
@app.route("/")


def index():
    return render_template("index.html")



#return list of existing zip codes with scores
@app.route("/zips")
def zips():
    return (jsonify(zip_list))


#return Real Estate data and score for a specific zip code
@app.route("/REdata/<zip>")
def redata(zip):
    print("REdata/zip: "+ str(zip))
    all_homes_json = get_real_estate_data(zip)
    return(jsonify(all_homes_json))



#return all POIs for a specific lat/long
@app.route("/POIdata/<lat>/<lng>")
def poidata(zip):
    print("POIdata/lat: "+ str(lat))
    poi_json = barfinder(lat,lng)
    return(jsonify(poi_json))



# #return all data and score for a specific zip code
# @app.route("/alldata/<zip>")
# def alldata(zip):
#     print("alldata/zip: "+ str(zip))
#     # get_zip_factors()
#     # print(alldata[zip])
#     # return (jsonify(alldata[zip]))
#



if __name__ == "__main__":
    app.run(debug=True)
