from django import forms
from .models import Producto, Tag, Proveedor, Marca

class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['nombre', 'color', 'descripcion']
        widgets = {
            'color': forms.TextInput(attrs={'type': 'color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2}),
        }

class MarcaForm(forms.ModelForm):
    class Meta:
        model = Marca
        fields = ['nombre', 'logo', 'sitio_web', 'descripcion']
        widgets = {
            'descripcion': forms.Textarea(attrs={'rows': 2}),
        }

class ProveedorForm(forms.ModelForm):
    class Meta:
        model = Proveedor
        fields = ['nombre', 'contacto', 'telefono', 'email', 'direccion']
        widgets = {
            'direccion': forms.Textarea(attrs={'rows': 2}),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and not forms.EmailField().clean(email):
            raise forms.ValidationError('Formato de email inválido')
        return email

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['nombre', 'imagen', 'tags', 'marca', 'modelo', 'cantidad', 'tipo', 'precio_mayoreo', 'precio_unitario', 'costo_proveedor', 'proveedor']
        widgets = {
            'tags': forms.CheckboxSelectMultiple(attrs={'class': 'tags-checkbox'}),
            'marca': forms.Select(attrs={'class': 'select2'}),
            'proveedor': forms.Select(attrs={'class': 'select2'}),
            'tipo': forms.RadioSelect(attrs={'class': 'tipo-radio'}),
            'imagen': forms.FileInput(attrs={'accept': 'image/*', 'class': 'file-input'}),
        }

    def clean_cantidad(self):
        cantidad = self.cleaned_data.get('cantidad')
        if cantidad is not None and cantidad < 0:
            raise forms.ValidationError('La cantidad no puede ser negativa.')
        return cantidad

    def clean_precio_mayoreo(self):
        val = self.cleaned_data.get('precio_mayoreo')
        if val is not None and val < 0:
            raise forms.ValidationError('El precio no puede ser negativo.')
        return val

    def clean_precio_unitario(self):
        val = self.cleaned_data.get('precio_unitario')
        if val is not None and val < 0:
            raise forms.ValidationError('El precio no puede ser negativo.')
        return val

    def clean_costo_proveedor(self):
        val = self.cleaned_data.get('costo_proveedor')
        if val is not None and val < 0:
            raise forms.ValidationError('El costo no puede ser negativo.')
        return val 