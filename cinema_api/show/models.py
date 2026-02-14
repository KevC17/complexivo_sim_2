from django.db import models

class Show(models.Model):
    movie_title = models.CharField(max_length=120, blank=True)
    room = models.CharField(max_length=120, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return self.movie_title

class Reservations(models.Model):
    show_id  = models.ForeignKey(Show, on_delete=models.PROTECT, related_name="reservations")
    customer_name  = models.CharField(max_length=120, blank=True)
    seats = models.IntegerField(default=0, blank=True)
    
    class Status(models.TextChoices):
        RESERVED = "RESERVED", "Reserved"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RESERVED
    )
    
    created_at  = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return f"{self.show_id.movie_title} {self.customer_name} ({self.status})"