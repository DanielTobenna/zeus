from django.shortcuts import render, redirect, reverse

from django.core.mail import BadHeaderError, send_mail

from django.http import HttpResponse,HttpResponseRedirect

from django.contrib import messages

from django.contrib.auth import login, authenticate, logout

from django.contrib.auth.forms import UserCreationForm

from django.core.mail import EmailMessage

from django.conf import settings

from django.template.loader import render_to_string

from .models import *

from .forms import *

from django.contrib.auth.decorators import login_required

def home(request):
	return render(request, 'zeusapp/index.html')

def popper(request):
	return render(request, 'zeusapp/popper.html')

def terms(request):
	return render(request, 'zeusapp/terms.html')

def contact(request):
	return HttpResponse('Contact')

def signup(request):
	form= CreateUserForm()

	if request.method == 'POST':
		form = CreateUserForm(request.POST)
		if form.is_valid():
			user=form.save()
			username= form.cleaned_data.get('username')
			messages.success(request, "Account was created for " + username)

			Customer.objects.create(

				user=user,
				name= user.username,
				email= user.email,

				)

			return redirect('signin')

	context={'form':form}

	return render(request, 'zeusapp/signup.html')

def signin(request):
	if request.user.is_authenticated:
		return redirect('dashboard')

	else:
		if request.method == "POST":
			username= request.POST.get('username')
			password= request.POST.get('password')

			user= authenticate(request, username=username, password=password)

			if user is not None:
				login(request, user)
				return redirect('dashboard')

			else:
				messages.error(request, "username or password is incorrect")

	context={}
	return render(request, 'zeusapp/login.html')

@login_required(login_url='signin')
def dashboard(request):
	customer= Customer.objects.all()
	context={'customer': customer,}
	return render(request, 'zeusapp/dashboard.html', context)

@login_required(login_url='signin')
def requestwithdrawal(request):
	if request.method == 'GET':
		form = RequestForm()
	else:
		form = RequestForm(request.POST)
		if form.is_valid():
			subject = form.cleaned_data['subject']
			from_email = form.cleaned_data['from_email']
			message = form.cleaned_data['message']
			try:
				send_mail(subject, "Investor {} has requested a withdrawal of {}".format(from_email, subject),from_email, ['support@astroroi.net'])
			except BadHeaderError:
				return HttpResponse('Invalid header found.')
		return HttpResponse('Your withdrawal request has been made successfully')

	return render(request, 'zeusapp/requestwithdrawal.html', {'form': form})

@login_required(login_url='login')
def plans(request):
    plans= Plan.objects.all()
    return render(request, 'zeusapp/plan.html', context = {"plans":plans})


@login_required(login_url='login')
def deposite(request):
	customer= request.user.customer
	products= Product.objects.filter(customer=customer)
	context={'products': products}
	return render(request, 'zeusapp/deposite.html', context)

@login_required(login_url='signin')
def depositeform(request):
	customer= request.user.customer
	if request.method=='POST':
		plan_name= request.POST.get('planname')
		price= request.POST.get('price')
		if price:
			Product.objects.create(
				plan_name= plan_name,
				price= price,
				customer= customer,
				)
			return redirect('deposite')
			
	context={}
	return render(request, 'zeusapp/depositeform.html', context)

@login_required(login_url='signin')
def account_settings(request):

	customer= request.user.customer

	form=CustomerForm(instance=customer)

	if request.method=='POST':
		form= CustomerForm(request.POST, request.FILES, instance=customer)
		if form.is_valid():
			form.save()

	context= {"form":form}

	return render(request, 'zeusapp/account_settings.html', context)

def exchanged_rate(amount):
    url = "https://www.blockonomics.co/api/price?currency=USD"
    r = requests.get(url)
    response = r.json()
    return amount/response['price']

def track_invoice(request, pk):
    invoice_id = pk
    invoice = Invoice.objects.get(id=invoice_id)
    data = {
            'order_id':invoice.order_id,
            'bits':invoice.btcvalue/1e8,
            'value':invoice.product.price,
            'name': invoice.product.title,
            'addr': invoice.address,
            'status':Invoice.STATUS_CHOICES[invoice.status+1][1],
            'invoice_status': invoice.status,
        }
    if (invoice.received):
        data['paid'] =  invoice.received/1e8
        if (int(invoice.btcvalue) <= int(invoice.received)):
            data['path'] = invoice.product.product_image.url
    else:
        data['paid'] = 0

    return render(request,'zeusapp/invoice.html',context=data)

def create_payment(request, pk):
    product_id = pk
    product = Product.objects.get(id=product_id)
    url = 'https://www.blockonomics.co/api/new_address'
    headers = {'Authorization': "Bearer " + str('')}
    r = requests.post(url, headers=headers)
    print(r.json())
    if r.status_code == 200:
        address = r.json()['address']
        bits = exchanged_rate(product.price)
        order_id = uuid.uuid1()
        invoice = Invoice.objects.create(order_id=order_id,
                                address=address,btcvalue=bits*1e8, product=product)
        return HttpResponseRedirect(reverse('track_payment', kwargs={'pk':invoice.id}))
    else:
        print(r.status_code, r.text)
        return HttpResponse("Some Error, Try Again!")

def receive_payment(request):

    if (request.method != 'GET'):
        return

    txid  = request.GET.get('txid')
    value = request.GET.get('value')
    status = request.GET.get('status')
    addr = request.GET.get('addr')

    invoice = Invoice.objects.get(address = addr)

    invoice.status = int(status)
    if (int(status) == 2):
        invoice.received = value
    invoice.txid = txid
    invoice.save()
    return HttpResponse(200)


def logoutuser(request):
	logout(request)
	return redirect('signin')