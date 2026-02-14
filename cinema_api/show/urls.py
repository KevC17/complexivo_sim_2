from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowViewSet, ReservationsViewSet
from .movie_catalog_views import movie_catalog_list_create, movie_catalog_detail
from .reservation_events_views import reservation_events_list_create, reservation_events_detail

router = DefaultRouter()
router.register(r"show", ShowViewSet, basename="show")
router.register(r"reservations", ReservationsViewSet, basename="reservations")

urlpatterns = [
    # Mongo
    path("movie-catalog/", movie_catalog_list_create),
    path("movie-catalog//", movie_catalog_detail),
    path("reservation-events/", reservation_events_list_create),
    path("reservation-events//", reservation_events_detail),
]

urlpatterns += router.urls