# -*- coding: utf-8 -*-
"""Module with Jinja template filters. The template filters are registered in app.py."""

def format_date(value, format='%Y-%m-%d'):
    return value.strftime(format)
