from django.db import models
from users.models import User

class Child(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    speech_level = models.CharField(max_length=50)  # e.g., "verbal", "non-verbal"
    time_of_practice = models.IntegerField()  # in minutes
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