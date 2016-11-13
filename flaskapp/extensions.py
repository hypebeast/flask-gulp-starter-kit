# -*- coding: utf-8 -*-
"""Extensions module. Each extension is initialized in the app factory function in app.py"""
from flask_cache import Cache
from flask_debugtoolbar import DebugToolbarExtension
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect

csrf_protect = CsrfProtect()
db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
debug_toolbar = DebugToolbarExtension()
