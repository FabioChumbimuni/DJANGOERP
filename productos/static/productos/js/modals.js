// ===== FUNCIONES DE MODALES =====

// Variables globales para los modales
let currentModal = null;

// ===== MODAL DE TAG =====

function openTagModal() {
    currentModal = 'tag';
    document.getElementById('tagModal').style.display = 'flex';
    document.getElementById('tag_nombre').focus();
    
    // Configurar previsualización en tiempo real
    setupTagPreview();
}

function closeTagModal() {
    document.getElementById('tagModal').style.display = 'none';
    document.getElementById('tagForm').reset();
    currentModal = null;
}

function setupTagPreview() {
    const nombreInput = document.getElementById('tag_nombre');
    const colorInput = document.getElementById('tag_color');
    const previewTag = document.getElementById('tagPreview').querySelector('.preview-tag');
    const colorPreview = document.getElementById('colorPreview');
    
    function updatePreview() {
        const nombre = nombreInput.value || 'Nuevo Tag';
        const color = colorInput.value;
        
        previewTag.textContent = nombre;
        previewTag.style.backgroundColor = color + '20';
        previewTag.style.color = color;
        
        colorPreview.style.backgroundColor = color;
    }
    
    nombreInput.addEventListener('input', updatePreview);
    colorInput.addEventListener('input', updatePreview);
    updatePreview();
}

// ===== MODAL DE PROVEEDOR =====

function openProveedorModal() {
    currentModal = 'proveedor';
    document.getElementById('proveedorModal').style.display = 'flex';
    document.getElementById('proveedor_nombre').focus();
}

function closeProveedorModal() {
    document.getElementById('proveedorModal').style.display = 'none';
    document.getElementById('proveedorForm').reset();
    currentModal = null;
}

// Función para cambiar pestañas en el modal de proveedor
function switchTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Desactivar todos los botones de pestaña
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
}

// ===== MODAL DE MARCA =====

function openMarcaModal() {
    currentModal = 'marca';
    document.getElementById('marcaModal').style.display = 'flex';
    document.getElementById('marca_nombre').focus();
    
    // Configurar previsualización en tiempo real
    setupMarcaPreview();
}

function closeMarcaModal() {
    document.getElementById('marcaModal').style.display = 'none';
    document.getElementById('marcaForm').reset();
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('logoPreview').style.display = 'none';
    currentModal = null;
}

function setupMarcaPreview() {
    const nombreInput = document.getElementById('marca_nombre');
    const descripcionInput = document.getElementById('marca_descripcion');
    const sitioWebInput = document.getElementById('marca_sitio_web');
    const logoInput = document.getElementById('marca_logo');
    
    const previewNombre = document.getElementById('marcaPreviewNombre');
    const previewDesc = document.getElementById('marcaPreviewDesc');
    const previewWeb = document.getElementById('marcaPreviewWeb');
    const previewLogo = document.getElementById('marcaPreviewLogo');
    
    function updatePreview() {
        const nombre = nombreInput.value || 'Nombre de la Marca';
        const descripcion = descripcionInput.value || 'Descripción de la marca';
        const sitioWeb = sitioWebInput.value;
        
        previewNombre.textContent = nombre;
        previewDesc.textContent = descripcion;
        
        if (sitioWeb) {
            previewWeb.style.display = 'block';
            previewWeb.href = sitioWeb;
        } else {
            previewWeb.style.display = 'none';
        }
    }
    
    nombreInput.addEventListener('input', updatePreview);
    descripcionInput.addEventListener('input', updatePreview);
    sitioWebInput.addEventListener('input', updatePreview);
    
    // Manejar previsualización del logo
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const logoPreview = document.getElementById('logoPreview');
                const uploadPlaceholder = document.getElementById('uploadPlaceholder');
                
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                
                // Actualizar previsualización de la marca
                previewLogo.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 100%; height: auto;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    updatePreview();
}

// ===== MANEJO DE FORMULARIOS AJAX =====

// Configurar formularios cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de Tag
    const tagForm = document.getElementById('tagForm');
    if (tagForm) {
        tagForm.addEventListener('submit', handleTagSubmit);
    }
    
    // Formulario de Proveedor
    const proveedorForm = document.getElementById('proveedorForm');
    if (proveedorForm) {
        proveedorForm.addEventListener('submit', handleProveedorSubmit);
    }
    
    // Formulario de Marca
    const marcaForm = document.getElementById('marcaForm');
    if (marcaForm) {
        marcaForm.addEventListener('submit', handleMarcaSubmit);
    }
    
    // Cerrar modales al hacer clic fuera de ellos
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeCurrentModal();
        }
    });
});

function handleTagSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar loading
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    submitButton.disabled = true;
    
    fetch('/productos/ajax/tag/crear/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('success', 'Tag creado exitosamente');
            closeTagModal();
            
            // Actualizar el select de tags en el formulario principal
            updateTagsSelect(data.tag);
        } else {
            showToast('error', 'Error al crear el tag: ' + Object.values(data.errors).flat().join(', '));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Error al crear el tag');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

function handleProveedorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar loading
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    submitButton.disabled = true;
    
    fetch('/productos/ajax/proveedor/crear/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('success', 'Proveedor creado exitosamente');
            closeProveedorModal();
            
            // Actualizar el select de proveedores en el formulario principal
            updateProveedoresSelect(data.proveedor);
        } else {
            showToast('error', 'Error al crear el proveedor: ' + Object.values(data.errors).flat().join(', '));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Error al crear el proveedor');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

function handleMarcaSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar loading
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    submitButton.disabled = true;
    
    fetch('/productos/ajax/marca/crear/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('success', 'Marca creada exitosamente');
            closeMarcaModal();
            
            // Actualizar el select de marcas en el formulario principal
            updateMarcasSelect(data.marca);
        } else {
            showToast('error', 'Error al crear la marca: ' + Object.values(data.errors).flat().join(', '));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Error al crear la marca');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// ===== FUNCIONES PARA ACTUALIZAR SELECTS =====

function updateTagsSelect(newTag) {
    const tagsSelect = document.querySelector('select[name="tags"]');
    if (tagsSelect) {
        const option = document.createElement('option');
        option.value = newTag.id;
        option.textContent = newTag.nombre;
        option.style.color = newTag.color;
        tagsSelect.appendChild(option);
    }
}

function updateProveedoresSelect(newProveedor) {
    const proveedoresSelect = document.querySelector('select[name="proveedor"]');
    if (proveedoresSelect) {
        const option = document.createElement('option');
        option.value = newProveedor.id;
        option.textContent = newProveedor.nombre;
        proveedoresSelect.appendChild(option);
    }
}

function updateMarcasSelect(newMarca) {
    const marcasSelect = document.querySelector('select[name="marca"]');
    if (marcasSelect) {
        const option = document.createElement('option');
        option.value = newMarca.id;
        option.textContent = newMarca.nombre;
        marcasSelect.appendChild(option);
    }
}

// ===== FUNCIÓN PARA CERRAR MODAL ACTUAL =====

function closeCurrentModal() {
    switch(currentModal) {
        case 'tag':
            closeTagModal();
            break;
        case 'proveedor':
            closeProveedorModal();
            break;
        case 'marca':
            closeMarcaModal();
            break;
    }
}

// ===== EXPORTAR FUNCIONES GLOBALES =====

window.openTagModal = openTagModal;
window.closeTagModal = closeTagModal;
window.openProveedorModal = openProveedorModal;
window.closeProveedorModal = closeProveedorModal;
window.openMarcaModal = openMarcaModal;
window.closeMarcaModal = closeMarcaModal;
window.switchTab = switchTab; 