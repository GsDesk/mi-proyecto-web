from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # Tareas
    path('tareas/', views.TareaListCreate.as_view(), name='tarea_list_create'),
    path('tareas/<int:pk>/', views.TareaDetail.as_view(), name='tarea_detail'),

    # Submissions (upload a submission for a given tarea)
    path('tareas/<int:pk>/submit/', views.SubmissionCreate.as_view(), name='tarea_submit'),
    # Profile for frontend to check role
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('users/', views.UserListView.as_view(), name='user-list'),
]
