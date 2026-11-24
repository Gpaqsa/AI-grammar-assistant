import os
from pathlib import Path
from datetime import timedelta
import ssl
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env", override=True)

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-local-development-key")
DEBUG = os.getenv("DJANGO_DEBUG", "1") == "1"
ALLOWED_HOSTS = [h.strip() for h in os.getenv("DJANGO_ALLOWED_HOSTS", "ai-grammar-assistant.onrender.com").split(",")]

INSTALLED_APPS = [
    'corsheaders',
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "rest_framework", "corrections",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request", "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {"default": {
    "ENGINE": "django.db.backends.mysql",
    "NAME": os.getenv("MYSQL_DATABASE"),
    "USER": os.getenv("MYSQL_USER"),
    "PASSWORD": os.getenv("MYSQL_ROOT_PASSWORD"),
    "HOST": os.getenv("MYSQL_HOST"),
    "PORT": os.getenv("MYSQL_PORT", "3306"),
    # "NAME": "grammar_correction_app_mysql",
    # "USER": "giogio",
    # "PASSWORD": "paksa@1234",
    # "HOST": "grammar-correction-app-mysql.mysql.database.azure.com",
    # "PORT": "3306",
    "OPTIONS": {
            'ssl': {
                'ca': str(BASE_DIR / 'DigiCertGlobalRootG2.crt.pem'),
            },
                 "charset": "utf8mb4"
             },
}}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

configured_frontend_origins = os.getenv("FRONTEND_ORIGINS")

if configured_frontend_origins:
    CORS_ALLOWED_ORIGINS = [
        origin.strip()
        for origin in configured_frontend_origins.split(",")
        if origin.strip()
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
        "http://127.0.0.1:3000",
        "http://192.168.1.12:3000",
    ]
# CORS_ALLOWED_ORIGINS = [
#     origin.strip()
#     for origin in configured_frontend_origins.split(",")
#     if origin.strip()
# ]
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=20),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}
MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "50000"))
CORS_ALLOW_CREDENTIALS = True