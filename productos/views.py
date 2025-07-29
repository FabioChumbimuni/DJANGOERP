from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Count, Sum
from .models import Producto, Tag, Proveedor, Marca
from .forms import ProductoForm, TagForm, ProveedorForm, MarcaForm

class DashboardView(LoginRequiredMixin, ListView):
    model = Producto
    template_name = 'productos/dashboard.html'
    context_object_name = 'productos'
    paginate_by = 10

    def get_queryset(self):
        queryset = Producto.objects.select_related('marca', 'proveedor').prefetch_related('tags')
        
        # Filtros
        search = self.request.GET.get('search', '')
        tipo = self.request.GET.get('tipo', '')
        
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
            
        return queryset.order_by('-creado')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Estadísticas para las cards
        context['stats'] = {
            'total_productos': Producto.objects.count(),
            'total_tags': Tag.objects.count(),
            'total_proveedores': Proveedor.objects.count(),
            'total_marcas': Marca.objects.count(),
        }
        
        # Productos más recientes
        context['productos_recientes'] = Producto.objects.select_related('marca').order_by('-creado')[:5]
        
        return context

class ProductoCreateView(LoginRequiredMixin, CreateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'productos/producto_form.html'
    success_url = reverse_lazy('productos:dashboard')

    def form_valid(self, form):
        messages.success(self.request, 'Producto creado exitosamente.')
        return super().form_valid(form)

class ProductoUpdateView(LoginRequiredMixin, UpdateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'productos/producto_form.html'
    success_url = reverse_lazy('productos:dashboard')

    def form_valid(self, form):
        messages.success(self.request, 'Producto actualizado exitosamente.')
        return super().form_valid(form)

class ProductoDeleteView(LoginRequiredMixin, DeleteView):
    model = Producto
    success_url = reverse_lazy('productos:dashboard')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Producto eliminado exitosamente.')
        return super().delete(request, *args, **kwargs)

# Vistas para Tags
class TagListView(LoginRequiredMixin, ListView):
    model = Tag
    template_name = 'productos/tags/tag_list.html'
    context_object_name = 'tags'
    paginate_by = 20

class TagCreateView(LoginRequiredMixin, CreateView):
    model = Tag
    form_class = TagForm
    template_name = 'productos/tags/tag_form.html'
    success_url = reverse_lazy('productos:tag_list')

    def form_valid(self, form):
        messages.success(self.request, 'Tag creado exitosamente.')
        return super().form_valid(form)

class TagUpdateView(LoginRequiredMixin, UpdateView):
    model = Tag
    form_class = TagForm
    template_name = 'productos/tags/tag_form.html'
    success_url = reverse_lazy('productos:tag_list')

    def form_valid(self, form):
        messages.success(self.request, 'Tag actualizado exitosamente.')
        return super().form_valid(form)

class TagDeleteView(LoginRequiredMixin, DeleteView):
    model = Tag
    success_url = reverse_lazy('productos:tag_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Tag eliminado exitosamente.')
        return super().delete(request, *args, **kwargs)

# Vistas para Proveedores
class ProveedorListView(LoginRequiredMixin, ListView):
    model = Proveedor
    template_name = 'productos/proveedores/proveedor_list.html'
    context_object_name = 'proveedores'
    paginate_by = 20

class ProveedorCreateView(LoginRequiredMixin, CreateView):
    model = Proveedor
    form_class = ProveedorForm
    template_name = 'productos/proveedores/proveedor_form.html'
    success_url = reverse_lazy('productos:proveedor_list')

    def form_valid(self, form):
        messages.success(self.request, 'Proveedor creado exitosamente.')
        return super().form_valid(form)

class ProveedorUpdateView(LoginRequiredMixin, UpdateView):
    model = Proveedor
    form_class = ProveedorForm
    template_name = 'productos/proveedores/proveedor_form.html'
    success_url = reverse_lazy('productos:proveedor_list')

    def form_valid(self, form):
        messages.success(self.request, 'Proveedor actualizado exitosamente.')
        return super().form_valid(form)

class ProveedorDeleteView(LoginRequiredMixin, DeleteView):
    model = Proveedor
    success_url = reverse_lazy('productos:proveedor_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Proveedor eliminado exitosamente.')
        return super().delete(request, *args, **kwargs)

# Vistas para Marcas
class MarcaListView(LoginRequiredMixin, ListView):
    model = Marca
    template_name = 'productos/marcas/marca_list.html'
    context_object_name = 'marcas'
    paginate_by = 20

class MarcaCreateView(LoginRequiredMixin, CreateView):
    model = Marca
    form_class = MarcaForm
    template_name = 'productos/marcas/marca_form.html'
    success_url = reverse_lazy('productos:marca_list')

    def form_valid(self, form):
        messages.success(self.request, 'Marca creada exitosamente.')
        return super().form_valid(form)

class MarcaUpdateView(LoginRequiredMixin, UpdateView):
    model = Marca
    form_class = MarcaForm
    template_name = 'productos/marcas/marca_form.html'
    success_url = reverse_lazy('productos:marca_list')

    def form_valid(self, form):
        messages.success(self.request, 'Marca actualizada exitosamente.')
        return super().form_valid(form)

class MarcaDeleteView(LoginRequiredMixin, DeleteView):
    model = Marca
    success_url = reverse_lazy('productos:marca_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Marca eliminada exitosamente.')
        return super().delete(request, *args, **kwargs)

# Vistas AJAX para modales
def crear_tag_ajax(request):
    if request.method == 'POST':
        form = TagForm(request.POST)
        if form.is_valid():
            tag = form.save()
            return JsonResponse({
                'success': True,
                'tag': {
                    'id': tag.id,
                    'nombre': tag.nombre,
                    'color': tag.color
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def crear_proveedor_ajax(request):
    if request.method == 'POST':
        form = ProveedorForm(request.POST)
        if form.is_valid():
            proveedor = form.save()
            return JsonResponse({
                'success': True,
                'proveedor': {
                    'id': proveedor.id,
                    'nombre': proveedor.nombre
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def crear_marca_ajax(request):
    if request.method == 'POST':
        form = MarcaForm(request.POST, request.FILES)
        if form.is_valid():
            marca = form.save()
            return JsonResponse({
                'success': True,
                'marca': {
                    'id': marca.id,
                    'nombre': marca.nombre,
                    'logo_url': marca.logo.url if marca.logo else None
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def obtener_tags_ajax(request):
    tags = Tag.objects.all()
    return JsonResponse({
        'tags': list(tags.values('id', 'nombre', 'color'))
    })

def obtener_proveedores_ajax(request):
    proveedores = Proveedor.objects.all()
    return JsonResponse({
        'proveedores': list(proveedores.values('id', 'nombre'))
    })

def obtener_marcas_ajax(request):
    marcas = Marca.objects.all()
    return JsonResponse({
        'marcas': list(marcas.values('id', 'nombre'))
    })
