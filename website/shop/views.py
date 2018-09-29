from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .models import Job
from rest_framework import viewsets
from .serializers import JobSerializer

class JobViewAPI(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


# Create your views here.




def detail(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    otherjobsSum = 0
    otherjobs= []

    for otherjob in Job.objects.all():
        if otherjob.user == job.user and otherjob.id != job_id:
            otherjobsSum += 1
            otherjobs.append(otherjob)



    return render(request, 'shop/detail.html',{'job':job, 'otherjobs':otherjobs})


@login_required(login_url="/signup")
def create(request):


    if request.method == 'POST':
        if request.POST['title'] and request.POST['description'] and request.POST['hours'] and request.POST['city'] and request.POST['payPerHour']  and request.POST['email'] and request.FILES['image']:
            job = Job()
            job.title = request.POST['title']
            job.description = request.POST['description']
            job.hours = request.POST['hours']
            job.payPerHour = request.POST['payPerHour']
            job.city = request.POST['city']
            job.email = request.POST['email']
            if request.POST['phone']:
                job.phone = request.POST['phone']
            job.image = request.FILES['image']
            job.user = request.user
            job.save()
            return redirect('/shop/' + str(job.id))
        else:
            return render(request, 'shop/create.html',{'error':'All fields are required.'})
    else:
        return render(request, 'shop/create.html')
