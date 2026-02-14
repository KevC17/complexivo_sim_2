from rest_framework import serializers
from .models import Show, Reservations

class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = ["id", "movie_title", "room", "price", "available_seats"]

class ReservationsSerializer(serializers.ModelSerializer):
    show_movie_title = serializers.CharField(source="show.movie_title", read_only=True)

    class Meta:
        model = Reservations
        fields = ["id", "show_id", "show_movie_title", "customer_name", "seats", "status", "created_at"]