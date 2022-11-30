"""CyberGarden URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import *
from django.conf.urls.static import static
from django.views.generic import TemplateView
from backend import views

urlpatterns = [
                  path("admin/", admin.site.urls),
                  path('', views.index),
                  path("about/", views.about),
                  path("api/", views.api),
                  path("auth/", views.auth),
                  path("account/", views.account),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
