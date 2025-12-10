from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Tarea, Submission


class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True)
	role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, write_only=True, required=False)

	class Meta:
		model = User
		fields = ('id', 'username', 'password', 'role')

	def create(self, validated_data):
		role = validated_data.pop('role', 'student')
		if User.objects.filter(username=validated_data['username']).exists():
			raise serializers.ValidationError({"username": ["Este nombre de usuario ya está en uso."]})
		
		user = User.objects.create_user(username=validated_data['username'], password=validated_data['password'])
		Profile.objects.create(user=user, role=role)
		return user


class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile
		fields = ('role',)




class TareaSerializer(serializers.ModelSerializer):
	created_by = serializers.ReadOnlyField(source='created_by.username')
	is_submitted = serializers.SerializerMethodField()

	class Meta:
		model = Tarea
		fields = '__all__'

	def get_is_submitted(self, obj):
		request = self.context.get('request')
		if request and request.user.is_authenticated:
			return Submission.objects.filter(tarea=obj, student=request.user).exists()
		return False


class SubmissionSerializer(serializers.ModelSerializer):
	student = serializers.ReadOnlyField(source='student.username')
	tarea = serializers.ReadOnlyField(source='tarea.title')

	class Meta:
		model = Submission
		fields = '__all__'



class UserListSerializer(serializers.ModelSerializer):
	role = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'role')

	def get_role(self, obj):
		return obj.profile.role if hasattr(obj, 'profile') else 'student'
