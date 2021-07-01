# Generated by Django 3.2 on 2021-06-30 10:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, null=True)),
                ('phone', models.CharField(max_length=200, null=True)),
                ('email', models.CharField(max_length=200, null=True)),
                ('Wallet_address', models.CharField(max_length=400, null=True)),
                ('profile_pic', models.ImageField(blank=True, default='profile_pic.PNG', null=True, upload_to='')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('description', models.CharField(blank=True, max_length=2000, null=True)),
                ('price', models.FloatField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_id', models.CharField(blank=True, max_length=50, null=True)),
                ('title', models.CharField(blank=True, max_length=200, null=True)),
                ('plan_name', models.CharField(blank=True, max_length=200, null=True)),
                ('price', models.FloatField()),
                ('customer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='zeusapp.customer')),
            ],
        ),
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.IntegerField(choices=[(-1, 'Not Started'), (0, 'Unconfirmed'), (1, 'Partially Confirmed'), (2, 'Confirmed')], default=-1)),
                ('order_id', models.CharField(max_length=250)),
                ('address', models.CharField(blank=True, max_length=250, null=True)),
                ('btcvalue', models.IntegerField(blank=True, null=True)),
                ('received', models.IntegerField(blank=True, null=True)),
                ('txid', models.CharField(blank=True, max_length=250, null=True)),
                ('rbf', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='zeusapp.product')),
            ],
        ),
        migrations.CreateModel(
            name='Investment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deposite', models.IntegerField(default=0, null=True)),
                ('balance', models.IntegerField(default=0, null=True)),
                ('withdrawal', models.IntegerField(default=0, null=True)),
                ('profit', models.FloatField(default=0, null=True)),
                ('customer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='zeusapp.customer')),
            ],
        ),
    ]
