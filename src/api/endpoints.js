const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API = {
  USER: {
    // POST /user — Sign up
    // GET /user — Get authenticated user
    // PUT /user — Update user info
    // DELETE /user — Delete user
    ROOT: `${API_BASE_URL}/user`,

    // POST /user/auth — Sign in
    SIGN_IN: `${API_BASE_URL}/user/auth`,
  },

  CARDS: {
    // POST /card — Create new card
    // PUT /card — Update card (ID from JWT)
    // GET /card — Get all cards (user ID from JWT)
    ROOT: `${API_BASE_URL}/card`,

    // GET /card/:id — Get card by ID
    // DELETE /card/:id — Delete card by ID
    BY_ID: (id) => `${API_BASE_URL}/card/${id}`,
  },

  TEMPLATES: {
    // GET /template — Fetch all templates
    ROOT: `${API_BASE_URL}/template`,
  },
  CATEGORIES: {
    // GET /category — Fetch all categories
    ROOT: `${API_BASE_URL}/category`
  }
};
