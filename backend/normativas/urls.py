from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NormativaViewSet

router = DefaultRouter()
router.register(r'normativas', NormativaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
