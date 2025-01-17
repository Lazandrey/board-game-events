import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { geocode } from "@esri/arcgis-rest-geocoding";

const authentication = ApiKeyManager.fromKey(
  process.env.ARCGIS_API_KEY as string
);

export const getGeocode = async (address: {
  street: string;
  city: string;
  country: string;
}) => {
  const geocodeAdress = {
    address: address.street + " " + address.city,
    countryCode: address.country,
    authentication,
  };
  const response = await geocode(geocodeAdress);
  return response;
};
