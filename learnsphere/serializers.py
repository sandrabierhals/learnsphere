from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Language

class RegisterSerializer(serializers.ModelSerializer):
    # Serializer for user registration
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        # Creates a new user using Django's create_user method
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    # Serializer for displaying user profile data
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        # Enforce minimum password length
        if len(value) < 8:
            raise serializers.ValidationError("New password must be at least 8 characters.")
        return value

class LanguageSerializer(serializers.ModelSerializer):
    # Serializer for displaying language information
    class Meta:
        model = Language
        fields = [
            'id',
            'name',
            'code',
            'schedule',
            'price',
            'description'
        ]

class EnrollLanguageSerializer(serializers.Serializer):
    language_id = serializers.IntegerField()

    def validate_language_id(self, value):
        # Check if the language exists
        try:
            language = Language.objects.get(pk=value)
        except Language.DoesNotExist:
            raise serializers.ValidationError("Language not found.")
        return value

    def save(self, **kwargs):
        # Enroll the current user in the selected language
        user = self.context['request'].user
        language = Language.objects.get(pk=self.validated_data['language_id'])
        user.enrolled_languages.add(language)
        return language