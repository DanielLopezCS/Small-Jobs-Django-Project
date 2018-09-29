from django.urls import path, include
from . import views
from rest_framework import routers
#routers registered needed for Restful API calls
router = routers.DefaultRouter()
router.register('jobs', views.JobViewAPI)

urlpatterns = [
    path('create/', views.create, name='create'),
    path('<int:job_id>', views.detail, name='detail'),
    path('api/',include(router.urls)),

]
