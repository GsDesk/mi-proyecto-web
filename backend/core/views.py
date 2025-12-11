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

# Grading Views

from .serializers import SubmissionGradeSerializer

class TaskSubmissionsList(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure only teachers can see this
        if not hasattr(self.request.user, 'profile') or self.request.user.profile.role != 'teacher':
             return Submission.objects.none()
        
        tarea_id = self.kwargs['pk']
        return Submission.objects.filter(tarea_id=tarea_id)

class SubmissionGradeUpdate(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionGradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # In a real app, add permission check to ensure user is a teacher

class MySubmissionsList(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user).select_related('tarea').order_by('tarea__unit', 'submitted_at')


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
	permission_classes = [permissions.IsAuthenticated]
    
# Report Generation
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import io
from datetime import datetime

class StudentReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Create a file-like buffer to receive PDF data.
        buffer = io.BytesIO()

        # Create the PDF object, using the buffer as its "file."
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Header
        p.setFont("Helvetica-Bold", 18)
        p.drawString(50, height - 50, "Informe de Actividades Académicas")
        
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 80, f"Estudiante: {request.user.username}")
        p.drawString(50, height - 95, f"Fecha de emisión: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        
        p.line(50, height - 110, width - 50, height - 110)

        # Content - List of Submissions
        y_position = height - 150
        submissions = Submission.objects.filter(student=request.user).order_by('-submitted_at')

        p.setFont("Helvetica-Bold", 14)
        p.drawString(50, y_position, "Historial de Entregas")
        y_position -= 30

        if not submissions.exists():
            p.setFont("Helvetica", 12)
            p.drawString(50, y_position, "No se han encontrado entregas registradas.")
        else:
            p.setFont("Helvetica-Bold", 10)
            p.drawString(50, y_position, "Tarea")
            p.drawString(300, y_position, "Fecha Entrega")
            p.drawString(450, y_position, "Archivo")
            y_position -= 15
            p.line(50, y_position, width - 50, y_position)
            y_position -= 20

            p.setFont("Helvetica", 10)
            for sub in submissions:
                if y_position < 50: # New Page if space is low
                    p.showPage()
                    y_position = height - 50
                
                title = sub.tarea.title[:45] + "..." if len(sub.tarea.title) > 45 else sub.tarea.title
                date_str = sub.submitted_at.strftime('%Y-%m-%d %H:%M')
                file_name = sub.file.name.split('/')[-1]

                p.drawString(50, y_position, title)
                p.drawString(300, y_position, date_str)
                p.drawString(450, y_position, file_name[:20]) # Truncate filename if long
                y_position -= 20

        # Footer
        p.setFont("Helvetica-Oblique", 8)
        p.drawString(50, 30, "Documento generado automáticamente por Sistema de Gestión Académica Golden Gazelle.")
        p.showPage()
        p.save()

        # FileResponse sets the Content-Disposition header so that browsers
        # present the option to save the file.
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')


from django.http import FileResponse, Http404
import os
from django.conf import settings

class DownloadFileView(APIView):
    def get(self, request, path, format=None):
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        print(f"DEBUG DOWNLOAD: Request path: {path}")
        print(f"DEBUG DOWNLOAD: MEDIA_ROOT: {settings.MEDIA_ROOT}")
        print(f"DEBUG DOWNLOAD: Full path: {file_path}")
        print(f"DEBUG DOWNLOAD: Exists? {os.path.exists(file_path)}")
        
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=False)
        raise Http404(f"Archivo no encontrado: {file_path}")
