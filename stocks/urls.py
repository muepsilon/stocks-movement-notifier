from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^portfolio',views.portfolio, name="portfolio"),
    url(r'^validateSymbol',views.is_valid_symbol, name="validate_symbol"),
]