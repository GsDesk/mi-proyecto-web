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
    
    # Reports
    path('student/report/', views.StudentReportView.as_view(), name='student-report'),

    # Grading
    path('tareas/<int:pk>/submissions/', views.TaskSubmissionsList.as_view(), name='task-submissions'),
    path('submissions/<int:pk>/grade/', views.SubmissionGradeUpdate.as_view(), name='grade-submission'),
    path('my-grades/', views.MySubmissionsList.as_view(), name='my-grades'),
]
