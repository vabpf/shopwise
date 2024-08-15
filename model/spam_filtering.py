import torch
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from preprocessing.deemojify import deEmojify
from preprocessing.remove_duplicates import filter_similar_reviews
from preprocessing.remove_stopwords import filter_stop_words


def preprocess(text, lowercased=True):
    text = filter_stop_words(text)
    text = deEmojify(text)
    text = text.lower() if lowercased else text
    return text

def pre_process_features_test(X, lowercased=True):
    X = np.array(X)
    X = [preprocess(str(p), lowercased=lowercased) for p in X]
    return X

tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModelForSequenceClassification.from_pretrained(r"./PhoBERT_finetuned")

def spam_detection(texts, model, tokenizer):
    with torch.no_grad(): # Disable gradient calculation during inference
        inputs = pre_process_features_test(texts, lowercased=False)
        inputs = tokenizer(inputs, truncation=True, padding=True, max_length=100, return_tensors='pt')
        outputs = model(**inputs)  # Pass inputs as keyword arguments 
        # Apply softmax to get probabilities
        probabilities = torch.softmax(outputs.logits, dim=-1)
        # Get the predicted class index
        predicted_class_indices = torch.argmax(probabilities, dim=-1)
    return predicted_class_indices.tolist()

def spam_filtering(reviews):

    filtered_reviews, duplicate_reviews = filter_similar_reviews(reviews, similarity_threshold=0.8)

    predicts = spam_detection(filtered_reviews, model, tokenizer)
    label_map = {0: 'non-spam', 1: 'spam'}
    df = pd.DataFrame({'Reviews': filtered_reviews, 'Predict': [label_map[pred] for pred in predicts]})
    df_ = pd.DataFrame({'Reviews':duplicate_reviews, 'Predict':['spam']*len(duplicate_reviews)})

    results = pd.concat([df, df_], ignore_index=True)

    return results

