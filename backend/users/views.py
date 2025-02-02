from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer
from .models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# def send_otp_email(user):
#     otp = generate_random_otp()  # Implement this
#     user.email_OTP = otp
#     user.save()
#     send_mail(
#         'AutiCare Email Verification',
#         f'Your OTP is: {otp}',
#         settings.DEFAULT_FROM_EMAIL,
#         [user.email],
#         fail_silently=False,
#     )