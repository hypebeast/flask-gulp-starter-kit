# -*- coding: utf-8 -*-
"""Functional tests using WebTest.

See: http://webtest.readthedocs.org/
"""


class TestHome:
    """Home page."""

    def test_get_homepage_returns_200(self, testapp):
        """Get homepage successful."""
        # Goes to homepage
        res = testapp.get('/')
        assert res.status_code == 200


class TestAbout:
    """About page."""

    def test_get_about_returns_200(self, testapp):
        """Get about page successful."""
        # Goes to homepage
        res = testapp.get('/about/')
        assert res.status_code == 200
