import requests
import json

class ShopeeReviewScraper:

    def __init__(self, itemid, shopid):
        self.itemid = itemid
        self.shopid = shopid
        self.base_url = "https://shopee.vn/api/v2/item/get_ratings"
        self.headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0"}

    def _fetch_reviews(self, offset, limit):
        # Fetch link     
        url = f"{self.base_url}?exclude_filter=1&filter=1&filter_size=0&flag=1&fold_filter=0&itemid={self.itemid}&limit={limit}&offset={offset}&relevant_reviews=false&request_source=2&shopid={self.shopid}&tag_filter=&type=0&variation_filters="      
        print(f"Fetching reviews from {url}")
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return json.loads(response.text)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred while making the request: {e}")
            return None

    def _extract_review_data(self, review_data):
        return {
            'cmtid': review_data['cmtid'],
            'itemid': review_data['itemid'],
            'rating_star': review_data['rating_star'],
            'comment': review_data['comment'],
            'modelid': review_data['product_items'][0]['modelid'],
            'model_name': review_data['product_items'][0]['model_name'],
            'filter': review_data['filter'],
            'anonymous': review_data['anonymous'],
            'origin_region': review_data['sip_info']['origin_region'],
            'region': review_data['region'],
            'ctime': review_data['ctime'],
            'submit_time': review_data['submit_time']
        }

    def get_reviews(self):
        review_summary = self._fetch_reviews(10000000, 0)
        review_with_context = review_summary['data']['item_rating_summary']['rcount_with_context']
        # get reviews
        all_reviews = []
        offset = 0
        while offset < review_with_context:
            limit = min(50, review_with_context - offset)
            data = self._fetch_reviews(offset, limit)
            if data and data.get('error') == 0:
                all_reviews.extend([
                    self._extract_review_data(review_data) 
                    for review_data in data['data']['ratings']
                ])
                offset += limit
            else:
                print(f"Error fetching reviews: {data.get('error_msg', 'Unknown error')}")
                break
        print(f"Fetched {len(all_reviews)} reviews (with comment) from https://shopee.vn/product/{self.shopid}/{self.itemid}")
        return all_reviews

# # Example usage:
# itemid = 22489557572
# shopid = 543244849
# scraper = ShopeeReviewScraper(itemid, shopid)
# all_reviews = scraper.get_reviews()