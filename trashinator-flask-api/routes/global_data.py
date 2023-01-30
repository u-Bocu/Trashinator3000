from flask import Blueprint, request, json
import pandas as pd
import numpy as np

global_data = Blueprint('global_data', __name__)


def setup_global_data():
    df = pd.read_csv("../trashinator-flask-api/assets/waste_dataset_world_bank/country_level_data_0-2.csv", sep=";")
    data_frame_calcul = (df[["composition_food_organic_waste_percent", "composition_glass_percent",
                           "composition_metal_percent", "composition_other_percent",
                           "composition_paper_cardboard_percent", "composition_plastic_percent"]].replace(',', '.',
                                                                                                          regex=True).astype(
        float) / 100).multiply(
        df["total_msw_total_msw_generated_tons_year"].replace(',', '.', regex=True).astype(float), axis=0)
    data_frame = pd.concat([df['country_name'], df['total_msw_total_msw_generated_tons_year'],
                           data_frame_calcul['composition_food_organic_waste_percent'],
                           data_frame_calcul['composition_glass_percent'], data_frame_calcul['composition_metal_percent'],
                           data_frame_calcul['composition_other_percent'],
                           data_frame_calcul['composition_paper_cardboard_percent'],
                           data_frame_calcul['composition_plastic_percent']], axis=1)

    return data_frame


# Global variable that will hold the final dataframe in order to not regenerate him at each request.
data_frame_final = setup_global_data().sort_values(by=['country_name'])


def request_country_name(data_frame_final):
    data = data_frame_final['country_name'].to_numpy().flatten()
    return data


def request_data(filter_string, data_frame_final):
    data = data_frame_final[data_frame_final['country_name'].str.startswith(filter_string)].to_numpy().flatten()
    return data


@global_data.route("/world_data", methods=['GET'])
def get_global_data():
    args = request.args
    filter_string = args.get("countryName", default="France", type=str)
    values = request_data(filter_string, data_frame_final)

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
def get_country_name_from_global_data():
    country_list = request_country_name(data_frame_final)

    err = ""
    message = "Liste des noms des pays"

    res = {
        "success": err,
        "message": message,
        "data": country_list.tolist()
    }
    print(res)

    return res
