from django.contrib import admin
from .models import Normativa

@admin.register(Normativa)
class NormativaAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_by', 'created_at')
    list_filter = ('created_at', 'uploaded_by')
    search_fields = ('title', 'description')
