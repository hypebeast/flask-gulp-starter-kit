# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import sys
import logging
from flask import Flask, render_template

from flaskapp.home import blueprint as home
from flaskapp.extensions import cache, csrf_protect, db, debug_toolbar, migrate
from flaskapp.settings import ProdConfig
from flaskapp import commands

DEFAULT_BLUEPRINTS = (
    home,
)


def app_factory(config_object=ProdConfig, blueprints=DEFAULT_BLUEPRINTS):
    """An application factory, that creates a new Flask app.

    More information can be found here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split('.')[0])

    configure_app(app, config_object)
    register_extensions(app)
    register_blueprints(app, blueprints)
    register_errorhandlers(app)
    register_filters(app)
    register_hooks(app)
    configure_logging(app)
    register_shellcontext(app)
    register_commands(app)
    return app


def configure_app(app, config):
    app.config.from_object(config)


def register_extensions(app):
    """Register Flask extensions.

    :app: The Flask app.
    """
    cache.init_app(app)
    db.init_app(app)
    csrf_protect.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    return None


def register_blueprints(app, blueprints):
    """Register Flask blueprints."""
    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return None


def register_errorhandlers(app):
    """Register error handlers."""
    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template('errors/{0}.html'.format(error_code)), error_code

    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)

    return None


def register_filters(app):
    """Configure template filters."""
    from flaskapp.filters import format_date

    app.jinja_env.filters['format_date'] = format_date


def register_hooks(app):
    """Configure hook."""
    @app.before_request
    def before_request():
        print 'Before request hook'


def register_shellcontext(app):
    """Register shell context objects."""
    def shell_context():
        """Shell context objects."""
        return { 'db': db }

    app.shell_context_processor(shell_context)


def configure_logging(app):
    """Configure logging."""
    loggers = [app.logger]
    stream_handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)
    for logger in loggers:
        logger.setLevel(app.config['LOG_LEVEL'])
        logger.addHandler(stream_handler)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.urls)
