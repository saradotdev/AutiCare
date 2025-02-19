from django.db import models
from users.models import User

class Child(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    age = models.CharField(max_length=10)  # Ensure you set a max_length for consistency
    GENDER_CHOICES = [('male', 'male'), ('female', 'female'), ('other', 'other')]
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    speech_level = models.CharField(max_length=50)  # e.g., "verbal", "non-verbal"
    time_of_practice = models.IntegerField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='child_profiles/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Session(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    activity = models.ForeignKey('activities.Activity', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    completed = models.BooleanField(default=False)
    duration = models.IntegerField()  # in minutes