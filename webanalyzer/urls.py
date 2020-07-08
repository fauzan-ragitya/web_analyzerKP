from django.urls import path

from . import views

app_name = 'webanalyzer'
urlpatterns = [
    path('fingerprint/', views.collect, name='collect'),
    path('fingerprint1/', views.collect, name='collect'),
    path('fingerprint2/', views.collect, name='collect'),
    path('pie-chart/', views.pie_chart , name= 'pie-chart'),
    path('session_analisis' , views.session_average_analisis , name = 'session_analisis'),
    #tambahan
    path('', views.dashboard_with_pivot, name='dashboard_with_pivot'),
    path('data', views.pivot_data, name='pivot_data'),
]
    