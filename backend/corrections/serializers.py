from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Correction
from django.contrib.auth.password_validation import validate_password
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class CorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correction
        fields = ("id", "original_text", "corrected_text", "created_at")
        read_only_fields = fields
