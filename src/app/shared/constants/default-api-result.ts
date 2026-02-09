import { ApiResponseModel } from "@core/models/api-response-model";
import { NewsModel } from "@core/models/news-model";
import { PaginationModel } from "@core/models/pagination-model";

export const API_RESPONSE_PAGINATION_NEWS_LIST: ApiResponseModel<PaginationModel<NewsModel[]>> = {
  isSuccess: true,
  statusCode: 0,
  message: "",
  result: {
    count: 0,
    pages: 0,
    next: '',
    prev: '',
    result: [] 
  }
}

export const API_RESPONSE_NEWS: ApiResponseModel<NewsModel | null> = {
  isSuccess: true,
  statusCode: 0,
  message: "",
  result: null
}

