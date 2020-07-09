from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Fingerprint(models.Model):
    digital_fingerprint = models.CharField(max_length=20)
    browser = models.CharField(max_length=20)
    operating_system = models.CharField(max_length=20)
    mobile = models.BooleanField(default=False)
    language = models.CharField(max_length=10)

    def __int__(self):
        return self.digital_fingerprint

class Link(models.Model):
    url = models.CharField(max_length=50)

    def __str__(self):
        return self.url

class Session(models.Model):
    user = models.ForeignKey(Fingerprint, on_delete=models.CASCADE)
    url = models.ForeignKey(Link, on_delete=models.CASCADE)
    time_in = models.DateTimeField(auto_now_add=True)
    time_out = models.DateTimeField(auto_now=True)
    
    def __Fingerprint__(self):
        return self.user  

class Heatmap(models.Model):
    user = models.ForeignKey(Fingerprint, on_delete=models.CASCADE)
    url = models.ForeignKey(Link, on_delete=models.CASCADE)
    x_axis = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    y_axis = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)

    def __Link__(self):
        return self.url
