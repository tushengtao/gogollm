#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import psycopg2
from dotenv import load_dotenv

parent_dir = os.path.dirname(os.path.dirname(__file__))

dotenv_path = os.path.join(parent_dir, 'backend', '.env')

load_dotenv(dotenv_path)

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_DATABASE = os.getenv('DB_DATABASE')

conn = psycopg2.connect(
    dbname=DB_DATABASE,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST
)


def check_tables_count(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
        tables_count = cur.fetchone()[0]
    return tables_count > 0


if not check_tables_count(conn):
    sql_path = os.path.join(parent_dir, 'quick_deploy', 'gogollm_database_init.sql')
    with open(sql_path, 'r', encoding='utf-8') as file:
        sql_script = file.read()
    with conn.cursor() as cur:
        cur.execute(sql_script)
    conn.commit()

    print("Database initialized.")
else:
    print("Database is already initialized.")

conn.close()
