from fastapi import FastAPI
from pydantic import BaseModel
from shopee_scrape.get_review import ShopeeReviewScraper 
import pandas as pd
from model.spam_filtering import spam_filtering
from model.summarization import summarize
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ShopItemData(BaseModel):
    shopid: int
    itemid: int

@app.get("/")
async def root():
    return {"health_check": "OK"}

@app.post("/fetch_reviews")
async def fetch_reviews(shop_item_data: ShopItemData):
    shopid = shop_item_data.shopid
    itemid = shop_item_data.itemid

    # Fetch reviews using get_review.py
    scraper = ShopeeReviewScraper(itemid, shopid)
    all_reviews = scraper.get_reviews()

    # Return the CSV file for download
    all_reviews_df = pd.DataFrame(all_reviews)

    reviews = all_reviews_df['comment']

    # Spam filtering
    result = spam_filtering(reviews)
    result.sort_values(by='Predict',ascending=False ,inplace=True)

    # Summarization
    genuine = result[result['Predict']=='non-spam']['Reviews']
    summarization = summarize(result['Reviews'])

    return {
        "spam_filtering_results": result.to_json(orient='records'),
        "genuine_reviews": genuine.to_json(orient='records'),
        "summarization": summarization
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

    

    
