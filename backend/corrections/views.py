import os
from openai import OpenAI
from django.conf import settings
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Correction
from .serializers import RegisterSerializer, CorrectionSerializer, UserProfileSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CorrectInputSerializer(serializers.Serializer):
    text = serializers.CharField(trim_whitespace=False, allow_blank=False)

class CorrectTextView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CorrectInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        original = serializer.validated_data["text"]
        if len(original) > settings.MAX_TEXT_LENGTH:
            return Response({"detail": f"Text is too long. Maximum length is {settings.MAX_TEXT_LENGTH} characters."}, status=413)

        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not api_key:
            return Response({"detail": "AI service is not configured. Add OPENAI_API_KEY to the project .env file."}, status=503)

        try:
            client = OpenAI(api_key=api_key)
            result = client.responses.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
                instructions=(
                    "You are a careful grammar correction assistant. Correct grammar, spelling, "
                    "punctuation, and grammatical sentence structure in the user's text. Preserve "
                    "the original meaning, tone, language, formatting, and factual claims. Do not "
                    "answer questions in the text, add new content, or summarize. Return only the "
                    "corrected text."
                ),
                input=original,
            )
            corrected = result.output_text.strip()
            if not corrected:
                return Response({"detail": "The AI service returned an empty result. Please try again."}, status=502)
        except Exception:
            return Response({"detail": "The correction service failed. Check the backend logs and AI configuration."}, status=502)

        saved_id = None
        if request.user and request.user.is_authenticated:
            record = Correction.objects.create(user=request.user, original_text=original, corrected_text=corrected)
            saved_id = record.id
        return Response({"original_text": original, "corrected_text": corrected, "history_id": saved_id})

class HistoryListView(generics.ListAPIView):
    serializer_class = CorrectionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Correction.objects.filter(user=self.request.user)

class HistoryDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = CorrectionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Correction.objects.filter(user=self.request.user)
