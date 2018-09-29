
"""from django.views.generic import TemplateView

class HomePage(TemplateView):
    template_name = "index.html"
"""
from django.shortcuts import render

def HomePage(request):
    return render(request,'index.html',{})
