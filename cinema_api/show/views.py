from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Show, Reservations
from .serializers import ShowSerializer, ReservationsSerializer
from .permissions import IsAdminOrReadOnly

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all().order_by("id")
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    ordering_fields = ["id", "movie_title"]

class ReservationsViewSet(viewsets.ModelViewSet):
    queryset = Reservations.objects.select_related("show_id").all().order_by("-id")
    serializer_class = ReservationsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["show_id"]
    search_fields = ["customer_name", "seats", "status", "show_id__movie_title"]
    ordering_fields = ["id", "created_at"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()