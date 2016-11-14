# -*- coding: utf-8 -*-
"""Test configs."""
from flaskapp.app import app_factory
from flaskapp.settings import DevConfig, ProdConfig


def test_production_config():
    """Production config."""
    app = app_factory(ProdConfig)
    assert app.config['ENV'] == 'prod'
    assert app.config['DEBUG'] is False
    assert app.config['DEBUG_TB_ENABLED'] is False


def test_dev_config():
    """Development config."""
    app = app_factory(DevConfig)
    assert app.config['ENV'] == 'dev'
    assert app.config['DEBUG'] is True
