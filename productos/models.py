from django.db import models

# Create your models here.

class Tag(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#007bff')  # Hex color
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='marcas/', blank=True, null=True)
    sitio_web = models.URLField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField('Nombre o Razón Social', max_length=150)
    contacto = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    # Se pueden agregar más campos para "Datos fiscales" si se requiere

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    TIPO_CHOICES = [
        ('bien', 'Bien'),
        ('servicio', 'Servicio'),
        ('otros', 'Otros'),
    ]
    nombre = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    marca = models.ForeignKey(Marca, on_delete=models.SET_NULL, null=True, blank=True)
    modelo = models.CharField(max_length=100, blank=True, null=True)
    cantidad = models.PositiveIntegerField(default=0)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='bien')
    precio_mayoreo = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Precio Mayoreo (S/)')
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Precio Unitario (S/)')
    costo_proveedor = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Costo Proveedor (S/)')
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre
