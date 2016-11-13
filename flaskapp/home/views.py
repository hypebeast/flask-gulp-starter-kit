# -*- coding: utf-8 -*-
"""Public section, including homepage."""
from flask import Blueprint, render_template

blueprint = Blueprint('home', __name__)


@blueprint.route('/')
def home():
    """Home page."""
    return render_template('home/index.html')


@blueprint.route('/about/')
def about():
    """About page."""
    return render_template('home/about.html')
