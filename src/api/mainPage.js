import axiosClient from "./axiosClient";
import { API } from "./endpoints";

/**
 * Fetch templates and categories in parallel for the main page.
 * @returns {Promise<{ templates: Array, categories: Array }>}
 */
export const fetchMainPageData = async () => {
  try {
    const [templatesRes, categoriesRes] = await Promise.all([
      axiosClient.get(API.TEMPLATES.ROOT),
      axiosClient.get(API.CATEGORIES.ROOT),
    ]);

    return {
      templates: templatesRes.data,
      categories: categoriesRes.data,
    };
  } catch (error) {
    console.error("🔥 Error fetching main page data:", error);
    throw error;
  }
};

/**
 * Create a new card via the API.
 * @param {Object} cardData - The payload for the new card.
 * @param {string} cardData.sender
 * @param {string} cardData.recipient
 * @param {string} cardData.recipient_image
 * @param {string} [cardData.video]
 * @param {string} cardData.message
 * @param {string} cardData.template_id
 * @returns {Promise<Object>} - The created card response.
 */
export const createCard = async (cardData) => {
  try {
    const response = await axiosClient.post(API.CARDS.ROOT, cardData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      alert(error.response.data || "Unauthorized. Please sign in.");
    } else {
      console.error("❌ Error creating card:", error);
    }
    throw error;
  }
};
