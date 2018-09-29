#Serializer needed for our Job Restful API for Front-End Frameworks such as Vue.js 
from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('id','title','description','hours','payPerHour','city','image')
