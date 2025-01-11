import asyncio
import aiohttp

class ShopeeReviewScraper:

    def __init__(self, itemid, shopid):
        self.itemid = itemid
        self.shopid = shopid
        self.base_url = "https://shopee.vn/api/v2/item/get_ratings"
        self.headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0"}
        self.semaphore = asyncio.Semaphore(5)  # Limit concurrent requests, 5 requests means 250 reviews at a time

    async def _fetch_reviews(self, session, offset, limit):
        url = f"{self.base_url}?exclude_filter=1&filter=1&filter_size=0&flag=1&fold_filter=0&itemid={self.itemid}&limit={limit}&offset={offset}&relevant_reviews=false&request_source=2&shopid={self.shopid}&tag_filter=&type=0&variation_filters="
        print(f"Fetching reviews from {url}")
        async with self.semaphore:  # Acquire semaphore before making request
            try:
                async with session.get(url, headers=self.headers) as response:
                    response.raise_for_status()  # Raise an exception for bad status codes
                    return await response.json()
            except aiohttp.ClientError as e:
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

    async def get_reviews(self):

        async with aiohttp.ClientSession() as session:  # Create a single session

            review_summary = await self._fetch_reviews(session, offset=10000000, limit=0)
            if not review_summary:
                return []  # Handle case where summary fetch fails

            review_with_context = review_summary['data']['item_rating_summary']['rcount_with_context']

            all_reviews = []
            offset = 0
            tasks = []

            while offset < review_with_context:
                limit = min(50, review_with_context - offset) # Maximum limit is 50 reviews per request
                tasks.append(self._fetch_reviews(session, offset, limit))
                offset += limit

            results = await asyncio.gather(*tasks)  # Execute tasks concurrently

            for data in results:
                if data and data.get('error') == 0:
                    all_reviews.extend([
                        self._extract_review_data(review_data)
                        for review_data in data['data']['ratings']
                    ])
                else:
                    print(f"Error fetching reviews: {data.get('error_msg', 'Unknown error') if data else 'Request failed'}")
        
        print(f"Fetched {len(all_reviews)} reviews (with comment) from https://shopee.vn/product/{self.shopid}/{self.itemid}")
        return all_reviews


# Example usage:
async def main():
    itemid = 22489557572
    shopid = 543244849
    scraper = ShopeeReviewScraper(itemid, shopid)
    all_reviews = await scraper.get_reviews()
    print(len(all_reviews))

if __name__ == "__main__":
    asyncio.run(main())