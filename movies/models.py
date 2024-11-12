# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Directorgenres(models.Model):
    directorid = models.OneToOneField(
        "Directors", models.DO_NOTHING, db_column="DirectorID", primary_key=True
    )  # Field name made lowercase. The composite primary key (DirectorID, GenreID) found, that is not supported. The first column is selected.
    genreid = models.ForeignKey(
        "Genres", models.DO_NOTHING, db_column="GenreID"
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "DirectorGenres"
        unique_together = (("directorid", "genreid"),)


class Directors(models.Model):
    directorid = models.AutoField(
        db_column="DirectorID", primary_key=True
    )  # Field name made lowercase.
    name = models.CharField(
        db_column="Name", max_length=100, db_collation="Cyrillic_General_CI_AS"
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "Directors"


class Genres(models.Model):
    genreid = models.AutoField(
        db_column="GenreID", primary_key=True
    )  # Field name made lowercase.
    genrename = models.CharField(
        db_column="GenreName", max_length=50, db_collation="Cyrillic_General_CI_AS"
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "Genres"


class Movies(models.Model):
    movieid = models.AutoField(
        db_column="MovieID", primary_key=True
    )  # Field name made lowercase.
    title = models.CharField(
        db_column="Title", max_length=100, db_collation="Cyrillic_General_CI_AS"
    )  # Field name made lowercase.
    directorid = models.ForeignKey(
        Directors, models.DO_NOTHING, db_column="DirectorID", blank=True, null=True
    )  # Field name made lowercase.
    releasedate = models.DateField(
        db_column="ReleaseDate", blank=True, null=True
    )  # Field name made lowercase.
    genreid = models.ForeignKey(
        Genres, models.DO_NOTHING, db_column="GenreID", blank=True, null=True
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "Movies"


class Sessions(models.Model):
    sessionid = models.AutoField(
        db_column="SessionID", primary_key=True
    )  # Field name made lowercase.
    movieid = models.ForeignKey(
        Movies, models.DO_NOTHING, db_column="MovieID", blank=True, null=True
    )  # Field name made lowercase.
    sessiondatetime = models.DateTimeField(
        db_column="SessionDateTime"
    )  # Field name made lowercase.
    availableseats = models.IntegerField(
        db_column="AvailableSeats"
    )  # Field name made lowercase.
    price = models.DecimalField(
        db_column="Price", max_digits=10, decimal_places=2
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "Sessions"


class Tickets(models.Model):
    ticketid = models.AutoField(
        db_column="TicketID", primary_key=True
    )  # Field name made lowercase.
    sessionid = models.ForeignKey(
        Sessions, models.DO_NOTHING, db_column="SessionID", blank=True, null=True
    )  # Field name made lowercase.
    quantity = models.IntegerField(db_column="Quantity")  # Field name made lowercase.
    discount = models.DecimalField(
        db_column="Discount", max_digits=5, decimal_places=2
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "Tickets"
