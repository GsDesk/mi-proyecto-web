from rest_framework import viewsets, permissions
from .models import Normativa
from .serializers import NormativaSerializer

from core.permissions import IsTeacherOrReadOnly

class NormativaViewSet(viewsets.ModelViewSet):
    queryset = Normativa.objects.all().order_by('-created_at')
    serializer_class = NormativaSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
