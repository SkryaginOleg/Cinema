from django.urls import path, include
from .views import MovieListView, SessionListView, TicketPurchaseView, scalar_function_view, table_function_view
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('sessions/', SessionListView.as_view(), name='session-list'),
    path('tickets/', TicketPurchaseView.as_view(), name='ticket-purchase'),
    path('count_sessions/', scalar_function_view, name='count_sessions'),
    path('top_selling_movies/', table_function_view, name='top_selling_movies'),
]