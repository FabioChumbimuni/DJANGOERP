// ===== FUNCIONES PRINCIPALES DEL DASHBOARD =====

// Función para refrescar la tabla
function refreshTable() {
    location.reload();
}

// Función para eliminar producto con confirmación
function deleteProducto(productoId, productoNombre) {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${productoNombre}"?`)) {
        fetch(`/productos/producto/${productoId}/eliminar/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('success', 'Producto eliminado exitosamente');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showToast('error', 'Error al eliminar el producto');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Error al eliminar el producto');
        });
    }
}

// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ===== SISTEMA DE TOASTS =====

// Función para mostrar toasts
function showToast(type, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    const template = document.getElementById(`toast${type.charAt(0).toUpperCase() + type.slice(1)}Template`);
    
    if (!template) {
        console.error('Template no encontrado para tipo:', type);
        return;
    }
    
    const toast = template.content.cloneNode(true);
    const toastElement = toast.querySelector('.toast');
    const messageElement = toastElement.querySelector('.toast-message');
    
    messageElement.textContent = message;
    
    // Configurar el botón de cerrar
    const closeButton = toastElement.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        removeToast(toastElement);
    });
    
    // Agregar el toast al contenedor
    container.appendChild(toastElement);
    
    // Animación de entrada
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 100);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
        removeToast(toastElement);
    }, duration);
}

// Función para remover toasts
function removeToast(toastElement) {
    toastElement.classList.remove('show');
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 300);
}

// ===== FUNCIONES DE UTILIDAD =====

// Función para formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function() {
    // Mostrar toasts de Django messages si existen
    const messages = document.querySelectorAll('.django-messages .message');
    messages.forEach(message => {
        const type = message.classList.contains('success') ? 'success' : 
                    message.classList.contains('error') ? 'error' : 
                    message.classList.contains('warning') ? 'warning' : 'info';
        const text = message.textContent.trim();
        showToast(type, text);
    });
    
    // Configurar tooltips si existen
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Configurar confirmaciones para enlaces de eliminación
    const deleteLinks = document.querySelectorAll('.delete-link');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm') || '¿Estás seguro?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
});

// ===== FUNCIONES DE FILTRADO Y BÚSQUEDA =====

// Función para filtrar productos en tiempo real
function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter')?.value;
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
        const name = row.querySelector('.name-cell strong')?.textContent.toLowerCase() || '';
        const type = row.querySelector('.type-badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || name.includes(searchTerm);
        const matchesType = !typeFilter || type.includes(typeFilter);
        
        row.style.display = matchesSearch && matchesType ? '' : 'none';
    });
}

// Función para limpiar filtros
function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = '';
    
    filterProducts();
}

// ===== EXPORTAR FUNCIONES GLOBALES =====

// Hacer las funciones disponibles globalmente
window.deleteProducto = deleteProducto;
window.refreshTable = refreshTable;
window.showToast = showToast;
window.filterProducts = filterProducts;
window.clearFilters = clearFilters; 