from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, TareaSerializer, SubmissionSerializer
from .models import Tarea, Submission
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ProfileSerializer


class RegisterView(generics.CreateAPIView):
	queryset = User.objects.all()
	permission_classes = [permissions.AllowAny]
	serializer_class = RegisterSerializer




from .permissions import IsTeacherOrReadOnly

class TareaListCreate(generics.ListCreateAPIView):
	queryset = Tarea.objects.all().order_by('-created_at')
	serializer_class = TareaSerializer
	permission_classes = [IsTeacherOrReadOnly]

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class TareaDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Tarea.objects.all()
	serializer_class = TareaSerializer
	permission_classes = [IsTeacherOrReadOnly]


class SubmissionCreate(generics.CreateAPIView):
	queryset = Submission.objects.all()
	serializer_class = SubmissionSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_create(self, serializer):
		from rest_framework.exceptions import ValidationError
		tarea = Tarea.objects.get(pk=self.kwargs['pk'])
		if Submission.objects.filter(tarea=tarea, student=self.request.user).exists():
			raise ValidationError("Ya has enviado esta tarea. No se permiten múltiples envíos.")
		serializer.save(student=self.request.user, tarea=tarea)


class ProfileView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		# Return the profile for the authenticated user
		profile = getattr(request.user, 'profile', None)
		if not profile:
			return Response({'role': 'student'})
		serializer = ProfileSerializer(profile)
		return Response(serializer.data)



from .serializers import UserListSerializer

class UserListView(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = UserListSerializer
	permission_classes = [permissions.IsAuthenticated]
