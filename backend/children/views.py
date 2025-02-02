from rest_framework import viewsets
from .models import Child, Session
from .serializers import ChildSerializer, SessionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated



class ChildViewSet(viewsets.ModelViewSet):
    serializer_class = ChildSerializer
    queryset = Child.objects.all()
    authentication_classes = [JWTAuthentication]  # Use your preferred authentication
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    # Add this method to filter children by the logged-in user
    def get_queryset(self):
        return Child.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate child with logged-in user
        serializer.save(user=self.request.user)

class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    queryset = Session.objects.all()