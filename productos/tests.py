from django.test import TestCase
from .models import Producto, Tag, Proveedor, Marca
from .forms import ProductoForm, TagForm, ProveedorForm, MarcaForm

# Create your tests here.

class ModeloProductoTest(TestCase):
    def test_creacion_producto(self):
        tag = Tag.objects.create(nombre='Test', color='#123456')
        marca = Marca.objects.create(nombre='MarcaTest')
        proveedor = Proveedor.objects.create(nombre='ProveedorTest')
        producto = Producto.objects.create(nombre='ProductoTest', marca=marca, proveedor=proveedor)
        producto.tags.add(tag)
        self.assertEqual(producto.nombre, 'ProductoTest')

class FormProductoTest(TestCase):
    def test_form_valido(self):
        marca = Marca.objects.create(nombre='MarcaTest')
        proveedor = Proveedor.objects.create(nombre='ProveedorTest')
        data = {
            'nombre': 'ProductoForm',
            'marca': marca.id,
            'proveedor': proveedor.id,
            'cantidad': 10,
            'tipo': 'bien',
            'precio_mayoreo': 100,
            'precio_unitario': 120,
            'costo_proveedor': 80,
        }
        form = ProductoForm(data)
        self.assertTrue(form.is_valid())
