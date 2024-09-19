#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
from typing import List, Optional


class EmbeddingClient:
    def __init__(self, api_key, api_url, model):
        self.api_key = api_key
        self.api_url = api_url
        self.model = model
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(self.api_key)
        }

    def embed_query(self, text: str) -> List[float]:
        data = {
            "input": text,
            "model": self.model
        }
        response = requests.post(self.api_url, headers=self.headers, json=data)
        if response.status_code == 200:
            response_data = response.json()
            return response_data["data"][0]["embedding"]
        else:
            raise Exception("Error: {} - {}".format(response.status_code, response.text))

    def embed_documents(self, texts: List[str], chunk_size: Optional[int] = 0) -> List[List[float]]:
        data = {
            "input": texts,
            "model": self.model
        }
        response = requests.post(self.api_url, headers=self.headers, json=data)
        if response.status_code == 200:
            response_data = response.json()
            result = []
            for item in response_data["data"]:
                result.append(item["embedding"])
            return result
        else:
            raise Exception("Error: {} - {}".format(response.status_code, response.text))
