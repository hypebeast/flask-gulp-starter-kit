# -*- coding: utf-8 -*-
"""Defines fixtures available to all tests."""

import pytest
from webtest import TestApp

from flaskapp.app import app_factory
from flaskapp.settings import TestConfig


@pytest.yield_fixture(scope='function')
def app():
    """An application for the tests."""
    _app = app_factory(TestConfig)
    ctx = _app.test_request_context()
    ctx.push()

    yield _app

    ctx.pop()


@pytest.fixture(scope='function')
def testapp(app):
    """A Webtest app."""
    return TestApp(app)
