from django.shortcuts import render
from django.http import HttpResponse,HttpResponseBadRequest
import json
from nsetools import Nse
from django.core import serializers
from stocks.models import Stock
import math
from multiprocessing import Pool

# Create your views here.
def index(request):
  return render(request,'stocks/index.html')

def angular_router(request,path):
  return render(request,'stocks/index.html')

def is_valid_symbol(request):

  if request.method == 'GET':

    symbol = request.GET.get('symbol','').encode('ascii','ignore')
    nse = Nse()
    response = {}

    if len(symbol) == 0:
      return HttpResponseBadRequest("Bad Request",status = 400)
  
    if nse.is_valid_code(symbol):
      response['is_valid'] = True
      quote_data = nse.get_quote(symbol)
      response['companyName'] = quote_data['companyName']
    else:
      response['is_valid'] = False;

    return HttpResponse(json.dumps(response))

def company_info(request):
  pass
def get_quote(stock):
  # Get value from NSE
  nse = Nse()
  keys = ['lastPrice','low52','high52','previousClose','companyName','symbol']

  response = nse.get_quote(stock.symbol.encode('ascii','ignore'))

  # Filter out required fields
  filter_response = { key : response[key] for key in keys }

  # Process and add data
  filter_response['id'] = stock.pk
  filter_response['target_price'] = stock.target_price
  filter_response['N_stocks'] = stock.N_stocks
  filter_response['trigger_price_low'] = stock.trigger_price_low
  filter_response['trigger_price_high'] = stock.trigger_price_high
  filter_response['latest_value'] = stock.N_stocks*filter_response['lastPrice']
  filter_response['invested_price'] = stock.invested_price
  filter_response['invested_amount'] = math.ceil(stock.invested_price*stock.N_stocks)
  filter_response['amount_change'] = math.ceil(stock.N_stocks*(filter_response['lastPrice'] - stock.invested_price))
  filter_response['overall_change'] = math.ceil(((filter_response['lastPrice']/filter_response['invested_price'] - 1)*100)*100)/100
  filter_response['daily_change'] = math.ceil(((filter_response['lastPrice']/filter_response['previousClose'] - 1)*100)*100)/100
  filter_response['daily_amount_change'] = stock.N_stocks*(filter_response['lastPrice']-filter_response['previousClose'])
  
  return filter_response

def get_stock_info(request,param):
  stock = Stock.objects.get(pk = param.encode('ascii','ignore'))
  result = get_quote(stock)
  return HttpResponse(json.dumps(result))

def stocks_list(request):
  stocks = serializers.serialize("json", Stock.objects.all())
  return HttpResponse(stocks)

def portfolio(request):

  stocks = Stock.objects.all()
  results = []
  for stock in stocks:

    # Append the results
    results.append(get_quote(stock))

  return HttpResponse(json.dumps(results))