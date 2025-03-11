from rest_framework import viewsets, status
from .models import Child, Session
from .serializers import (
    ChildSerializer, SessionSerializer, 
    FacialExpressionSerializer, FacialExpressionListSerializer,
    ExpressionGroupSerializer, ExpressionGroupListSerializer
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
import os
import random
import logging
from django.conf import settings
from django.urls import reverse

# Set up logging
logger = logging.getLogger(__name__)

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

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def facial_expressions_for_child(request, child_id):
    """
    API endpoint that returns facial expression images appropriate for a child's age.
    
    - For children aged "3-5" (string or integers 3-5): Returns 10 random images from happy/sad folders
    - For children aged "6-8": Returns 5 random images from all expression folders
    
    Returns:
        Response: JSON containing list of images with their ID, type, and URL
    """
    try:
        # Get the child, ensuring it belongs to the requesting user
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Define valid expressions and default settings
        VALID_EXPRESSIONS = {
            'happy': True,
            'sad': True,
            'angry': True,
            'fear': True,
            'disgust': True,
            'neutral': True,
            'surprise': True
        }
        
        # Configure settings based on age
        config = _get_expression_config_for_age(child.age)
        if not config:
            return Response(
                {"error": "Facial expressions are only available for children aged 3-5 or 6-8"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Collect and return images
        return _get_images_response(request, config, VALID_EXPRESSIONS)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error processing facial expressions: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _get_expression_config_for_age(age):
    """
    Helper function to determine expression configuration based on child's age
    
    Args:
        age: The age of the child (string value)
        
    Returns:
        dict: Configuration with expression_types, num_images, age_group, and special handling flags
    """
    # All possible expressions
    all_expressions = ['happy', 'sad', 'angry', 'fear', 'disgust', 'neutral', 'surprise']
    default_expressions = ['happy', 'sad']
    
    # Handle string age ranges only
    if age == "6-8":
        return {
            'expression_types': all_expressions,
            'num_images': 5,
            'age_group': "6-8",
            'special_handling': False
        }
    elif age == "3-5":
        return {
            'expression_types': default_expressions,
            'num_images': 5,
            'age_group': "3-5",
            'special_handling': False
        }
    elif age == "9-12":
        return {
            'expression_types': all_expressions,
            'num_images': 5,
            'age_group': "9-12",
            'special_handling': True,
            'correct_expressions': 1,  # Number of correct expressions to mark
            'different_expressions': 3  # Number of different expressions to include
        }
    
    # Age doesn't match any valid criteria
    return None

def _get_images_response(request, config, valid_expressions):
    """
    Helper function to collect and return facial expression images
    
    Args:
        request: The HTTP request object
        config: Dictionary with expression_types, num_images, and special handling flags
        valid_expressions: Dictionary of valid expression types
        
    Returns:
        Response: JSON response with facial expression images
    """
    expression_types = config['expression_types']
    num_images = config['num_images']
    age_group = config['age_group']
    special_handling = config.get('special_handling', False)
    
    # For special handling of 9-12 age group
    if special_handling:
        return _get_special_images_response(request, config, valid_expressions)
    
    # Standard handling for other age groups
    # Collect images from selected expression folders
    all_images = []
    
    for expression_type in expression_types:
        # Skip invalid expression types
        if expression_type not in valid_expressions:
            continue
            
        expression_dir = os.path.join(settings.BASE_DIR, 'facial_expression_images', expression_type)
        
        # Skip directories that don't exist
        if not os.path.exists(expression_dir):
            logger.warning(f"Expression directory not found: {expression_dir}")
            continue
        
        # Get list of image files in the directory
        try:
            image_files = [
                f for f in os.listdir(expression_dir) 
                if os.path.isfile(os.path.join(expression_dir, f))
            ]
            
            # Add to the combined list with their types
            all_images.extend([(file, expression_type) for file in image_files])
        except (FileNotFoundError, PermissionError) as e:
            logger.error(f"Error accessing directory {expression_dir}: {str(e)}")
    
    if not all_images:
        return Response(
            {"error": "No facial expression images found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Shuffle and select random images
    random.shuffle(all_images)
    selected_images = all_images[:min(num_images, len(all_images))]
    
    # Process selected images
    images_data = []
    for filename, expression_type in selected_images:
        image_id = os.path.splitext(filename)[0]
        
        # Construct the image URL
        image_url = request.build_absolute_uri(
            reverse('serve_facial_expression', kwargs={
                'expression_type': expression_type,
                'filename': filename
            })
        )
        
        # Add the image data
        images_data.append({
            'id': image_id,
            'type': expression_type,
            'image_url': image_url,
            'is_correct': False  # Default is not correct for standard cases
        })
    
    # Return the serialized response
    data = {
        'age_group': age_group,
        'images': images_data
    }
    serializer = FacialExpressionListSerializer(data)
    
    return Response(serializer.data)

def _get_special_images_response(request, config, valid_expressions):
    """
    Special handling for 9-12 age group with correct/incorrect expressions
    
    For age 9-12, returns EXACTLY 5 expression types with 3 images each
    For each expression type, only ONE image actually matches that expression type
    The other 2 images are from different expressions to test identification skills
    
    Args:
        request: The HTTP request object
        config: Dictionary with special handling configuration
        valid_expressions: Dictionary of valid expression types
        
    Returns:
        Response: JSON response with grouped expressions and images
    """
    all_expressions = [exp for exp in valid_expressions.keys()]
    age_group = config['age_group']
    
    # Get available expressions with at least 1 image
    expression_images = {}
    
    for expression_type in all_expressions:
        expression_dir = os.path.join(settings.BASE_DIR, 'facial_expression_images', expression_type)
        
        # Skip directories that don't exist
        if not os.path.exists(expression_dir):
            continue
        
        # Get list of image files in the directory
        try:
            image_files = [
                f for f in os.listdir(expression_dir) 
                if os.path.isfile(os.path.join(expression_dir, f))
            ]
            
            # Only keep expressions with at least 1 image
            if len(image_files) >= 1:
                expression_images[expression_type] = image_files
        except (FileNotFoundError, PermissionError) as e:
            logger.error(f"Error accessing directory {expression_dir}: {str(e)}")
    
    # Make sure we have at least 3 different expression types
    available_expressions = list(expression_images.keys())
    if len(available_expressions) < 3:
        return Response(
            {"error": "At least 3 different facial expression types needed"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Always select EXACTLY 5 expression types to test (with replacement if necessary)
    selected_expressions = random.choices(available_expressions, k=5)
    
    # Build the response data
    expressions_data = []
    
    # For each selected expression type
    for target_expression in selected_expressions:
        # Get all images for the target expression type
        target_images = expression_images[target_expression]
        
        # Select 1 correct image from the target expression
        correct_image_filename = random.choice(target_images)
        correct_image_id = os.path.splitext(correct_image_filename)[0]
        
        # Construct the correct image URL
        correct_image_url = request.build_absolute_uri(
            reverse('serve_facial_expression', kwargs={
                'expression_type': target_expression,
                'filename': correct_image_filename
            })
        )
        
        # Create a list of 3 images (1 correct, 2 incorrect) for this expression type
        images_data = [
            {
                'id': correct_image_id,
                'image_url': correct_image_url,
                'is_correct': True
            }
        ]
        
        # Get other expression types to use as incorrect options
        other_expressions = [exp for exp in available_expressions if exp != target_expression]
        
        # Make sure we have at least 2 other expressions
        if len(other_expressions) < 2:
            other_expressions = other_expressions * 2  # Duplicate if needed
        
        # Choose 2 different expressions for incorrect options
        incorrect_expressions = random.sample(other_expressions, 2)
        
        # Add 2 incorrect images from different expression types
        for incorrect_exp in incorrect_expressions:
            # Choose a random image from this incorrect expression
            incorrect_filename = random.choice(expression_images[incorrect_exp])
            incorrect_id = os.path.splitext(incorrect_filename)[0]
            
            # Construct the URL for the incorrect image
            incorrect_url = request.build_absolute_uri(
                reverse('serve_facial_expression', kwargs={
                    'expression_type': incorrect_exp,
                    'filename': incorrect_filename
                })
            )
            
            # Add this incorrect image
            images_data.append({
                'id': incorrect_id,
                'image_url': incorrect_url,
                'is_correct': False
            })
        
        # Shuffle the images so the correct one isn't always first
        random.shuffle(images_data)
        
        # Add this expression group to the response
        expressions_data.append({
            'type': target_expression,
            'images': images_data
        })
    
    # Return the serialized response
    data = {
        'age_group': age_group,
        'expressions': expressions_data
    }
    serializer = ExpressionGroupListSerializer(data)
    
    return Response(serializer.data)

@api_view(['GET'])
def serve_facial_expression(request, expression_type, filename):
    """
    Serve a facial expression image directly from the file system
    
    Args:
        request: The HTTP request
        expression_type: The type of expression (happy, sad, etc.)
        filename: The name of the image file
        
    Returns:
        Response: The image file content with appropriate content type
    """
    # Define valid expression types
    valid_expression_types = [
        'happy', 'sad', 'angry', 'fear', 
        'disgust', 'neutral', 'surprise'
    ]
    
    if expression_type not in valid_expression_types:
        return Response(
            {"error": "Invalid expression type"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Construct the file path
    file_path = os.path.join(
        settings.BASE_DIR, 
        'facial_expression_images', 
        expression_type, 
        filename
    )
    
    # Check if the file exists
    if not os.path.exists(file_path):
        logger.warning(f"Image file not found: {file_path}")
        return Response(
            {"error": "Image not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Read and serve the file
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        # Determine the content type based on the file extension
        content_type = 'image/svg+xml' if filename.lower().endswith('.svg') else 'image/jpeg'
        
        return Response(file_content, content_type=content_type)
    except Exception as e:
        logger.error(f"Error serving image {file_path}: {str(e)}")
        return Response(
            {"error": "Error serving image"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )