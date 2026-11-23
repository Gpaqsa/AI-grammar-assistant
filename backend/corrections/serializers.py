from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Correction
from django.contrib.auth.password_validation import validate_password
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering a new user.
        args:
            serializers.ModelSerializer: A serializer that automatically generates fields based on the User model.
            password: A write-only field for the user's password, with a minimum length of 8 characters and no trimming of whitespace.
            returns:
                User: The newly created user instance.
    """
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_password(self, value):
        """Validate the password using Django's built-in validators.
        Args:
            value (str): The password to validate.
        Returns:
            str: The validated password.
        """
        validate_password(value)
        return value
    
    def create(self, validated_data):
        """Create a new user with the validated data.
        Args:
            validated_data (dict): The validated data from the serializer.
        Returns:
            User: The newly created user instance."""
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for viewing and updating user profiles.
        Args:
            serializers.ModelSerializer: A serializer that automatically generates fields based on the User model.
        returns:
            User: The user instance with the specified fields.
    """
    class Meta:
        """Meta class for the UserProfileSerializer.
            Args:
                model (User): The User model to use for the serializer.
                fields (tuple): The fields to include in the serializer.    
                read_only_fields (tuple): The fields that should be read-only in the serializer.
            returns:
                None
        """
        model = User
        fields = ("id", "username", "email", "date_joined")
        read_only_fields = fields

class CorrectionSerializer(serializers.ModelSerializer):
    """Serializer for viewing and updating correction entries."""
    class Meta:
        model = Correction
        fields = ("id", "original_text", "corrected_text", "created_at")
        read_only_fields = fields
