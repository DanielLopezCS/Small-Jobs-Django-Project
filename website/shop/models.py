from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Job(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250)
    hours = models.IntegerField(default = 1)
    payPerHour = models.IntegerField(default=10)
    city = models.CharField(max_length=20)
    image = models.ImageField(upload_to='images/')
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    email = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    def summary(self):
        return self.body[:25]

    def __str__(self):
        return self.title
