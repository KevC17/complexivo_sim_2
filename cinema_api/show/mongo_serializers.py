from rest_framework import serializers

class MovieCatalogSerializer(serializers.Serializer):
    _id = serializers.CharField()
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(max_length=120)
    duration_min = serializers.IntegerField()
    rating = serializers.CharField(max_length=120)
    is_active = serializers.BooleanField(default=True)

class ReservationEventsSerializer(serializers.Serializer):
    _id = serializers.CharField()
    reservation_id = serializers.CharField()
    
    class EventType:
        CREATED = "Created"
        CONFIRMED = "Confirmed"
        CANCELLED = "Cancelled"
        CHECKED_IN = "Checked_In"

        CHOICES = [
            (CREATED, "Created"),
            (CONFIRMED, "Confirmed"),
            (CANCELLED, "Cancelled"),
            (CHECKED_IN, "Checked_In"),
        ]
    event_type = serializers.ChoiceField(
        choices=EventType.CHOICES,
        default=EventType.CREATED
    )
    class Source:
        WEB = "Web"
        MOBILE = "Mobile"
        SYSTEM = "System"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Mobile"),
            (SYSTEM, "System"),
        ]
    source = serializers.ChoiceField(
        choices=Source.CHOICES,
        default=Source.WEB
    )
    
    note = serializers.CharField()
    created_at  = serializers.DateField()