from django.conf import settings
from django.db import models

class Correction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="corrections")
    original_text = models.TextField()
    corrected_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Correction {self.pk} by {self.user}"
