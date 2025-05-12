import re
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logger = logging.getLogger(__name__)

class SessionAutoResetMiddleware(MiddlewareMixin):
    """
    Middleware to automatically check and reset app sessions at midnight Pakistani time
    When any authenticated API request is made, this middleware checks if the user has
    children with active sessions from previous days and resets them
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        # Compile regex pattern for API paths we want to check
        self.api_pattern = re.compile(r'^/api/')
        # Add async_mode attribute required by Django 5.1.5
        self.async_mode = False
        
    def process_request(self, request):
        """Process the request before it reaches the view"""
        # Only check API requests
        if not self.api_pattern.match(request.path):
            return None
            
        # Only proceed if we have an authenticated user
        try:
            # Try to authenticate with JWT
            jwt_auth = JWTAuthentication()
            jwt_auth_result = jwt_auth.authenticate(request)
            
            if jwt_auth_result is not None:
                user, token = jwt_auth_result
                
                # Import here to avoid circular imports
                from .models import Child, Session
                
                # Get all children for this user
                children = Child.objects.filter(user=user)
                
                # Check and reset sessions for each child
                for child in children:
                    try:
                        Session.check_and_reset_session(child)
                    except Exception as e:
                        logger.error(f"Error auto-resetting session for child {child.id}: {str(e)}")
                        
        except Exception as e:
            # Just log errors but don't interrupt request processing
            logger.error(f"Error in SessionAutoResetMiddleware: {str(e)}")
            
        return None 