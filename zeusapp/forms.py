from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *

class ContactForm(forms.Form):
	name= forms.CharField(max_length=150)
	email= forms.EmailField()
	message= forms.CharField(widget=forms.Textarea)

class RequestForm(forms.Form):
    from_email = forms.EmailField(required=True)
    subject = forms.CharField(required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

class confirm_paymentForm(forms.Form):
    from_email = forms.EmailField(required=True)
    order_id = forms.CharField(required=True)
    amount = forms.CharField(required=True)

class CreateUserForm(UserCreationForm):
	firstname= forms.CharField(max_length=30, required=False)
	lastname= forms.CharField(max_length=30, required=False)
	class Meta:
		model = User
		fields = ['username', 'email', 'password1', 'password2']

class CustomerForm(ModelForm):
	class Meta:
		model= Customer
		fields= '__all__'
		exclude= ['user']