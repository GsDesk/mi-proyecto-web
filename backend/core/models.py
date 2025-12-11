from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
	ROLE_CHOICES = (('student', 'Student'), ('teacher', 'Teacher'))
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

	def __str__(self):
		return f"{self.user.username} ({self.role})"


class Tarea(models.Model):
	UNIT_CHOICES = [(i, f"Unidad {i}") for i in range(1, 5)]
	title = models.CharField(max_length=200)
	instructions = models.TextField(blank=True)
	attached_file = models.FileField(upload_to='tareas/', null=True, blank=True)
	created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tareas')
	due_date = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	unit = models.IntegerField(choices=UNIT_CHOICES, default=1)

	def __str__(self):
		return f"[{self.get_unit_display()}] {self.title}"

class Submission(models.Model):
	tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='submissions')
	student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
	file = models.FileField(upload_to='submissions/')
	submitted_at = models.DateTimeField(auto_now_add=True)
	grade = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
	feedback = models.TextField(blank=True, null=True)

	def __str__(self):
		return f"Submission by {self.student} for {self.tarea}"

