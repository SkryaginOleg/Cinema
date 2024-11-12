# serializers.py
from rest_framework import serializers
from .models import Movies, Directors, Genres, Sessions

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Directors
        fields = ['name']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = ['genrename']

class MovieSerializer(serializers.ModelSerializer):
    director = DirectorSerializer(source='directorid', read_only=True)
    genre = GenreSerializer(source='genreid', read_only=True)

    class Meta:
        model = Movies
        fields = ['movieid', 'title', 'director', 'genre', 'releasedate']

class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(source='movieid', read_only=True)

    class Meta:
        model = Sessions
        fields = ['sessionid', 'movie', 'sessiondatetime', 'availableseats', 'price']
