from rest_framework import generics
from .models import Movies, Sessions
from .serializers import MovieSerializer, SessionSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import connection

from django.db import connection, DatabaseError

from django.http import JsonResponse
from rest_framework.decorators import api_view

class MovieListView(generics.ListAPIView):
    queryset = Movies.objects.select_related("directorid", "genreid").all()
    serializer_class = MovieSerializer


class SessionListView(generics.ListAPIView):
    serializer_class = SessionSerializer

    def get_queryset(self):
        movie_id = self.request.query_params.get("movie", None)

        if movie_id:
            return Sessions.objects.filter(movieid=movie_id).select_related("movieid")

        return Sessions.objects.all().select_related("movieid")


class TicketPurchaseView(APIView):
    def post(self, request):
        session_id = request.data.get("session_id")
        quantity = request.data.get("quantity", 1)
        discount = request.data.get("discount", 0)

        print(
            f"Received data: session_id={session_id}, quantity={quantity}, discount={discount}"
        )

        if not session_id or quantity <= 0:
            return Response(
                {
                    "message": "Invalid input parameters",
                    "session_id": session_id,
                    "quantity": quantity,
                    "discount": discount,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "EXEC purchase_ticket @session_id=%s, @quantity=%s, @discount=%s",
                    [session_id, quantity, discount],
                )

            return Response(
                {"message": "Ticket purchased successfully"},
                status=status.HTTP_201_CREATED,
            )
        except DatabaseError as e:
            error_message = str(e)

            if 'Not enough seats available' in error_message:
                return Response(
                    {"message": "Not enough seats available for this session"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"message": f"Database error occurred: {error_message}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            return Response(
                {"message": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def scalar_function_view(request):
    price = request.GET.get('price', 0)
    with connection.cursor() as cursor:
        cursor.execute("SELECT dbo.CountSessionsCheaperThan(%s)", [price])
        count = cursor.fetchone()[0]
    return JsonResponse(count, safe=False)

def table_function_view(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM GetTopSellingMoviesByGenre()")
            result = [dict(zip([col[0] for col in cursor.description], row)) for row in cursor.fetchall()]
        return JsonResponse(result, safe=False)
    except DatabaseError as e:
        return JsonResponse({"error": "Ошибка при вызове функции GetTopSellingMoviesByGenre", "details": str(e)}, status=500)