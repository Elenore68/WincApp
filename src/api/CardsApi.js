// api/CardsApi.js
import axiosClient from "./axiosClient";
import { API } from "./endpoints";

export const getCardById = async (cardId) => {
  const response = await axiosClient.get(API.CARDS.BY_ID(cardId));
  return response.data;
};
