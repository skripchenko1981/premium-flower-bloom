import axios, { AxiosInstance } from "axios";

const API_BASE = import.meta.env["VITE_API_URL"] || "/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add refresh interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
                refresh_token: refreshToken,
              });
              localStorage.setItem("access_token", data.access_token);
              localStorage.setItem("refresh_token", data.refresh_token);
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return this.client(originalRequest);
            } catch {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/auth";
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ============ Auth ============
  async login(email: string, password: string) {
    const { data } = await this.client.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data;
  }

  async register(email: string, password: string, firstName: string, lastName: string, phone?: string) {
    const { data } = await this.client.post("/auth/register", {
      email, password, first_name: firstName, last_name: lastName, phone,
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data;
  }

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  async getMe() {
    const { data } = await this.client.get("/auth/me");
    return data;
  }

  // ============ Products ============
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    sort_desc?: boolean;
  }) {
    const { data } = await this.client.get("/products", { params });
    return data;
  }

  async getFeaturedProducts(limit = 8) {
    const { data } = await this.client.get("/products/featured", { params: { limit } });
    return data;
  }

  async getProduct(slug: string) {
    const { data } = await this.client.get(`/products/${slug}`);
    return data;
  }

  async getProductsByCategory(slug: string, page = 1, size = 12) {
    const { data } = await this.client.get(`/products/category/${slug}`, { params: { page, size } });
    return data;
  }

  // ============ Categories ============
  async getCategories() {
    const { data } = await this.client.get("/categories");
    return data;
  }

  // ============ Orders ============
  async createOrder(order: {
    delivery_address: string;
    delivery_city: string;
    delivery_phone: string;
    delivery_notes?: string;
    payment_method: string;
    items: { product_id: number; quantity: number }[];
  }) {
    const { data } = await this.client.post("/orders", order);
    return data;
  }

  async getOrders(page = 1, size = 10) {
    const { data } = await this.client.get("/orders", { params: { page, size } });
    return data;
  }

  async getOrder(id: number) {
    const { data } = await this.client.get(`/orders/${id}`);
    return data;
  }

  // ============ Reviews ============
  async createReview(productId: number, rating: number, comment?: string) {
    const { data } = await this.client.post("/reviews", {
      product_id: productId, rating, comment,
    });
    return data;
  }

  async getProductReviews(productId: number, page = 1, size = 10) {
    const { data } = await this.client.get(`/reviews/product/${productId}`, { params: { page, size } });
    return data;
  }

  // ============ Contacts ============
  async submitContact(name: string, email: string, message: string, phone?: string, subject?: string) {
    const { data } = await this.client.post("/contacts", { name, email, message, phone, subject });
    return data;
  }

  // ============ Users ============
  async updateProfile(data: { first_name?: string; last_name?: string; phone?: string; email?: string }) {
    const { data: res } = await this.client.put("/users/me", data);
    return res;
  }

  // ============ Admin ============
  async getDashboardStats() {
    const { data } = await this.client.get("/dashboard/stats");
    return data;
  }

  async getAdminOrders(page = 1, size = 10, status?: string) {
    const { data } = await this.client.get("/orders", { params: { page, size, status_filter: status } });
    return data;
  }

  async updateOrderStatus(id: number, status: string) {
    const { data } = await this.client.put(`/orders/${id}/status`, { status });
    return data;
  }

  async getAdminCategories() {
    const { data } = await this.client.get("/categories/all");
    return data;
  }

  async createCategory(data: { name: string; description?: string; image_url?: string; sort_order?: number }) {
    const { data: res } = await this.client.post("/categories", data);
    return res;
  }

  async updateCategory(id: number, data: any) {
    const { data: res } = await this.client.put(`/categories/${id}`, data);
    return res;
  }

  async deleteCategory(id: number) {
    await this.client.delete(`/categories/${id}`);
  }

  async createProduct(data: any) {
    const { data: res } = await this.client.post("/products", data);
    return res;
  }

  async updateProduct(id: number, data: any) {
    const { data: res } = await this.client.put(`/products/${id}`, data);
    return res;
  }

  async deleteProduct(id: number) {
    await this.client.delete(`/products/${id}`);
  }

  async uploadProductImage(productId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await this.client.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  async getContacts() {
    const { data } = await this.client.get("/contacts");
    return data;
  }

  async markContactRead(id: number) {
    const { data } = await this.client.put(`/contacts/${id}/read`);
    return data;
  }

  async moderateReview(id: number) {
    const { data } = await this.client.put(`/reviews/${id}/moderate`);
    return data;
  }

  async deleteReview(id: number) {
    await this.client.delete(`/reviews/${id}`);
  }
}

export const api = new ApiClient();
export default api;
