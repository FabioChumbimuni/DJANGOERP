from django.contrib import admin
from .models import Producto, Tag, Proveedor, Marca

admin.site.register(Producto)
admin.site.register(Tag)
admin.site.register(Proveedor)
admin.site.register(Marca)
