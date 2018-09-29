from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [

    #path('',views.test, name='test'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    
    #path('', views.HomePage.as_view(),name = "home"),

]
