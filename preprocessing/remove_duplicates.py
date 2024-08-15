import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def filter_similar_reviews(reviews, similarity_threshold=0.8):
    """
    Filters out reviews with high similarities from a list of reviews.
    
    Parameters:
    - reviews: List of review texts.
    - similarity_threshold: Cosine similarity threshold above which reviews are considered similar.
    
    Returns:
    - filtered_reviews: List of reviews with high similarities filtered out.
    """
    
    # Convert reviews to bag-of-words model
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(reviews)
    
    # Compute cosine similarity matrix
    cosine_sim_matrix = cosine_similarity(X)
    
    # Identify similar reviews
    num_reviews = len(reviews)
    to_remove = set()
    
    for i in range(num_reviews):
        for j in range(i + 1, num_reviews):
            if cosine_sim_matrix[i, j] > similarity_threshold:
                to_remove.add(j)
    
    # Filter out similar reviews
    filtered_reviews = pd.Series([reviews[i] for i in range(num_reviews) if i not in to_remove])
    
    return filtered_reviews, to_remove