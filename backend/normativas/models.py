from django.db import models

from django.contrib.auth.models import User

class Normativa(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='normativas/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='normativas')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
