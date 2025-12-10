from django.contrib import admin
from .models import Profile, Tarea, Submission


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'role')


@admin.register(Tarea)
class TareaAdmin(admin.ModelAdmin):
	list_display = ('title', 'created_by', 'due_date', 'created_at')
	list_filter = ('created_at', 'due_date', 'created_by')
	search_fields = ('title', 'instructions')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
	list_display = ('tarea', 'student', 'submitted_at')
	list_filter = ('submitted_at', 'tarea', 'student')