#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Dict, List
from sqlalchemy import text
from backend.database.db_sql import get_sync_db


def search(select_table: str, retrieve_vector: List[float], limit: int, field_name: str) -> List[Dict]:
    # TODO FIXME 需要动态传参 probes、lists参数对召回和响应时间影响很大，1百万内 probes = lists/10 、lists = rows/1000
    # set_probes_sql_str = "SET ivfflat.probes = 10;"

    retrieve_vector_sql_str = """
        SELECT id, content, field_name,
        (1 - (content_vector <=> '{retrieve_vector}')) AS score
        FROM {select_table}
        WHERE field_name = '{field_name}'
        ORDER BY score DESC
            LIMIT {limit};
"""

    retrieve_vector_sql_str = retrieve_vector_sql_str.format(
        select_table=select_table,
        retrieve_vector=retrieve_vector,
        field_name=field_name,
        limit=limit
    )

    with get_sync_db() as db:
        # db.execute(text(set_probes_sql_str))
        retrieve_vector_sql = text(retrieve_vector_sql_str)
        result = db.execute(retrieve_vector_sql)
        columns = result.keys()
        json_results = [dict(zip(columns, row)) for row in result.fetchall()]
        return json_results
