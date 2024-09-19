#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Dict, List, Optional
from langchain_core.pydantic_v1 import BaseModel
from backend.app.ggl.conf import gogollm_settings
from backend.app.ggl.flow.tools.duckduckgo.duckduckgo_search import DDGS

DUCKDUCKGO_BASE_URL = gogollm_settings.DUCKDUCKGO_BASE_URL


class DuckDuckGoSearchAPIWrapper(BaseModel):
    """Wrapper for DuckDuckGo Search API.

    Free and does not require any setup.
    """

    region: Optional[str] = "cn-zh"
    """
    See https://pypi.org/project/duckduckgo-search/#regions
    """
    safesearch: str = "on"
    """
    Options: strict, moderate, off
    """
    time: Optional[str] = "none"
    """
    Options: d, w, m, y ,none
    """
    max_results: int = 6
    backend: str = "api"
    """
    Options: api, html, lite
    """
    source: str = "text"
    """
    Options: text, news
    """

    class Config:
        extra = "forbid"

    def _ddgs_text(
            self, query: str, query_time_limit: str, max_results: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """Run query through DuckDuckGo text search and return results."""

        if query_time_limit:
            self.time = query_time_limit
        if self.time == "none":
            self.time = None
        with DDGS(base_url=DUCKDUCKGO_BASE_URL) as ddgs:
            ddgs_gen = ddgs.text(
                query,
                region=self.region,
                safesearch=self.safesearch,
                timelimit=self.time,
                max_results=max_results or self.max_results,
                backend=self.backend,
            )
            if ddgs_gen:
                return [r for r in ddgs_gen]
        return []

    def _ddgs_news(
            self, query: str,  query_time_limit: str, max_results: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """Run query through DuckDuckGo news search and return results."""
        if query_time_limit:
            self.time = query_time_limit

        with DDGS(base_url=DUCKDUCKGO_BASE_URL) as ddgs:
            ddgs_gen = ddgs.news(
                query,
                region=self.region,
                safesearch=self.safesearch,
                timelimit=self.time,
                max_results=max_results or self.max_results,
            )
            if ddgs_gen:
                return [r for r in ddgs_gen]
        return []

    def run(self, query: str, query_time_limit: str, source: str, max_results: int) -> str:
        """Run query through DuckDuckGo and return concatenated results."""
        if max_results:
            self.max_results = max_results

        if source == "news":
            self.source = "news"
        else:
            self.source = "text"

        if self.source == "text":
            results = self._ddgs_text(query=query, query_time_limit=query_time_limit)
        elif self.source == "news":
            results = self._ddgs_news(query=query, query_time_limit=query_time_limit)
        else:
            results = []

        if not results:
            return "No good DuckDuckGo Search Result was found"
        return str(results)

    def results(
            self, query: str, max_results: int, source: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """Run query through DuckDuckGo and return metadata.

        Args:
            query: The query to search for.
            max_results: The number of results to return.
            source: The source to look from.

        Returns:
            A list of dictionaries with the following keys:
                snippet - The description of the result.
                title - The title of the result.
                link - The link to the result.
        """
        source = source or self.source
        if source == "text":
            results = [
                {"snippet": r["body"], "title": r["title"], "link": r["href"]}
                for r in self._ddgs_text(query, max_results=max_results)
            ]
        elif source == "news":
            results = [
                {
                    "snippet": r["body"],
                    "title": r["title"],
                    "link": r["url"],
                    "date": r["date"],
                    "source": r["source"],
                }
                for r in self._ddgs_news(query, max_results=max_results)
            ]
        else:
            results = []

        if results is None:
            results = [{"Result": "No good DuckDuckGo Search Result was found"}]

        return results
