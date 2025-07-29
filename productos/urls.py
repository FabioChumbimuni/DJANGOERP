from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    # Dashboard principal
    path('', views.DashboardView.as_view(), name='dashboard'),
    
    # CRUD de productos
    path('producto/nuevo/', views.ProductoCreateView.as_view(), name='producto_create'),
    path('producto/<int:pk>/editar/', views.ProductoUpdateView.as_view(), name='producto_update'),
    path('producto/<int:pk>/eliminar/', views.ProductoDeleteView.as_view(), name='producto_delete'),
    
    # CRUD de Tags
    path('tags/', views.TagListView.as_view(), name='tag_list'),
    path('tags/nuevo/', views.TagCreateView.as_view(), name='tag_create'),
    path('tags/<int:pk>/editar/', views.TagUpdateView.as_view(), name='tag_update'),
    path('tags/<int:pk>/eliminar/', views.TagDeleteView.as_view(), name='tag_delete'),
    
    # CRUD de Proveedores
    path('proveedores/', views.ProveedorListView.as_view(), name='proveedor_list'),
    path('proveedores/nuevo/', views.ProveedorCreateView.as_view(), name='proveedor_create'),
    path('proveedores/<int:pk>/editar/', views.ProveedorUpdateView.as_view(), name='proveedor_update'),
    path('proveedores/<int:pk>/eliminar/', views.ProveedorDeleteView.as_view(), name='proveedor_delete'),
    
    # CRUD de Marcas
    path('marcas/', views.MarcaListView.as_view(), name='marca_list'),
    path('marcas/nuevo/', views.MarcaCreateView.as_view(), name='marca_create'),
    path('marcas/<int:pk>/editar/', views.MarcaUpdateView.as_view(), name='marca_update'),
    path('marcas/<int:pk>/eliminar/', views.MarcaDeleteView.as_view(), name='marca_delete'),
    
    # Endpoints AJAX para modales
    path('ajax/tag/crear/', views.crear_tag_ajax, name='crear_tag_ajax'),
    path('ajax/proveedor/crear/', views.crear_proveedor_ajax, name='crear_proveedor_ajax'),
    path('ajax/marca/crear/', views.crear_marca_ajax, name='crear_marca_ajax'),
    
    # Endpoints AJAX para obtener datos
    path('ajax/tags/', views.obtener_tags_ajax, name='obtener_tags_ajax'),
    path('ajax/proveedores/', views.obtener_proveedores_ajax, name='obtener_proveedores_ajax'),
    path('ajax/marcas/', views.obtener_marcas_ajax, name='obtener_marcas_ajax'),
] 