import { CATEGORIES, MOST_POPULAR_USERS } from './endpoints';
import { axiosInstance } from 'utils/api/axios';

class Services {
  static async getMostPopularUsers() {
    const res = await axiosInstance.get(MOST_POPULAR_USERS);
    return res.data;
  }
  static async getCategories(searchParams?: object) {
    const res = await axiosInstance.get(CATEGORIES, {
      params: searchParams,
    });
    return res.data;
  }
}

export default Services;
