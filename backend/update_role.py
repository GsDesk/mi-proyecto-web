import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Profile

username = 'jeniffer@example.com'

try:
    user = User.objects.get(username=username)
    profile, created = Profile.objects.get_or_create(user=user)
    profile.role = 'teacher'
    profile.save()
    print(f"Successfully updated role for user '{username}' to 'teacher'.")
except User.DoesNotExist:
    print(f"User '{username}' does not exist.")
except Exception as e:
    print(f"An error occurred: {e}")
