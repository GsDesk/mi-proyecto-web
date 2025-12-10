from rest_framework import serializers
from .models import Normativa

class NormativaSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Normativa
        fields = '__all__'
