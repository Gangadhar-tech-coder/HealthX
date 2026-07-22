from django.urls import path
from . import views

urlpatterns = [
    # Auth endpoints
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),

    # Assistant endpoints
    path('assistant/symptom-check/', views.symptom_check, name='symptom_check'),
    path('assistant/conversations/', views.get_conversations, name='get_conversations'),
    path('assistant/conversations/<int:conversation_id>/messages/', views.get_messages, name='get_messages'),

    # Contact form endpoint
    path('contact/', views.contact_form, name='contact_form'),
    
    # Diagnostic endpoint
    path('diagnostic/', views.diagnostic, name='diagnostic'),
]
