# Generated by Django 3.2 on 2021-06-30 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zeusapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plan',
            name='price',
        ),
        migrations.AddField(
            model_name='plan',
            name='max_deposite',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='plan',
            name='min_deposite',
            field=models.FloatField(null=True),
        ),
    ]