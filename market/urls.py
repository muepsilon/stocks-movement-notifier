"""market URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
import stocks.views as views
from stocks.models import Stock
from django.http import HttpResponseRedirect
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
class StockSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Stock
        fields = ('company_name', 'symbol', 'invested_price', 'N_stocks','target_price','trigger_price_high','trigger_price_low')

# ViewSets define the view behavior.
class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'stocks', StockViewSet)

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^api/company/find',views.is_valid_symbol, name="validate_symbol"),
    url(r'^api/company/^[0-9]+$',views.company_info, name="comapany_info"),
    url(r'^api/latestprice/stocks/$',views.portfolio, name="portfolio"),
    url(r'^api/', include(router.urls,namespace="api")),
    url(r'^(?P<path>.*)/$', views.angular_router, name="index"),
]
