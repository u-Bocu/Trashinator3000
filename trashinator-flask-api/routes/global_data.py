from flask import Blueprint, request, json
import pandas as pd
import numpy as np

global_data = Blueprint('global_data', __name__)


def setup_global_data():
    df = pd.read_csv("../trashinator-flask-api/assets/waste_dataset_world_bank/country_level_data_0-2.csv", sep=";")
    dataFrameCalcul = (df[["composition_food_organic_waste_percent", "composition_glass_percent",
                           "composition_metal_percent", "composition_other_percent",
                           "composition_paper_cardboard_percent", "composition_plastic_percent"]].replace(',', '.',
                                                                                                          regex=True).astype(
        float) / 100).multiply(
        df["total_msw_total_msw_generated_tons_year"].replace(',', '.', regex=True).astype(float), axis=0)
    dataFrame = pd.concat([df['country_name'], df['total_msw_total_msw_generated_tons_year'],
                           dataFrameCalcul['composition_food_organic_waste_percent'],
                           dataFrameCalcul['composition_glass_percent'], dataFrameCalcul['composition_metal_percent'],
                           dataFrameCalcul['composition_other_percent'],
                           dataFrameCalcul['composition_paper_cardboard_percent'],
                           dataFrameCalcul['composition_plastic_percent']], axis=1)

    return dataFrame


# Global variable that will hold the final dataframe in order to not regenerate him at each request.
dataFrameFinal = setup_global_data().sort_values(by=['country_name'])


def request_countryName(dataFrameFinal):
    data = dataFrameFinal['country_name'].to_numpy().flatten()
    return data


def request_data(filter_string, dataFrameFinal):
    data = dataFrameFinal[dataFrameFinal['country_name'].str.startswith(filter_string)].to_numpy().flatten()
    return data


@global_data.route("/world_data", methods=['GET'])
def get_GlobalData():
    args = request.args
    filter_string = args.get("countryName", default="France", type=str)
    values = request_data(filter_string, dataFrameFinal)

    data = {
        "countryName": values[0],
        "totalWastePerYear": values[1],
        "organicWaste": values[2],
        "glassWaste": values[3],
        "metalWaste": values[4],
        "otherWaste": values[5],
        "paperWaste": values[6],
        "plasticWaste": values[7]
    }

    err = ""
    message = "Données lié au pays sélectionné"

    res = {
        "success": err,
        "message": message,
        "data": data
    }

    return res


@global_data.route("/country_name", methods=['GET'])
def get_CountryNameFromGlobalData():
    countryList = request_countryName(dataFrameFinal)

    err = ""
    message = "Liste des noms des pays"

    res = {
        "success": err,
        "message": message,
        "data": countryList.tolist()
    }
    print(res)

    return res
