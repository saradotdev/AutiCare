from django.db import models

class Activity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    TYPE_CHOICES = [('SPEECH', 'Speech'), ('BEHAVIOR', 'Behavior')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    difficulty_level = models.IntegerField()  # 1 (Easy), 2 (Medium), 3 (Hard)
    duration = models.IntegerField()  # in minutes