from django.db import models
from children.models import Child, Session

class ProgressReport(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    total_sessions = models.IntegerField()
    score = models.IntegerField()  # e.g., 0-100